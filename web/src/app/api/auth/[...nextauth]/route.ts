import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";

import { prisma } from "@/server/prisma";

interface AuthorizedUser {
  id: string;
  email: string;
  name?: string | null;
  status: string;
}

function isAuthorizedUser(value: unknown): value is AuthorizedUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "string" && typeof candidate.email === "string" && typeof candidate.status === "string";
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await argon2.verify(user.passwordHash, password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
        } satisfies AuthorizedUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (isAuthorizedUser(user) && user.status !== "ACTIVE") {
        throw new Error("Account pending approval");
      }

      return true;
    },
    async jwt({ token, user }) {
      if (isAuthorizedUser(user)) {
        (token as Record<string, unknown>).userStatus = user.status;
      }

      return token;
    },
    async session({ session, token }) {
      const status = (token as Record<string, unknown>).userStatus;

      if (session.user && typeof status === "string") {
        (session.user as Record<string, unknown>).status = status;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
