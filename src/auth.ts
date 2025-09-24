import NextAuth, {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getLogger } from "@/lib/logging";
import { trackAuthEvent } from "@/lib/telemetry";

const demoEmail = process.env.AUTH_DEMO_EMAIL ?? "driver@pacetrace.app";
const demoPassword = process.env.AUTH_DEMO_PASSWORD ?? "pitlane";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: demoEmail },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const logger = getLogger();
        logger.info("auth.credentials.attempt", {
          email: credentials?.email,
        });

        if (!credentials?.email || !credentials.password) {
          logger.warn("auth.credentials.missing", {
            hasEmail: Boolean(credentials?.email),
            hasPassword: Boolean(credentials?.password),
          });
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        if (normalizedEmail === demoEmail && password === demoPassword) {
          const user = {
            id: "demo-user",
            email: normalizedEmail,
            name: "Race Strategist",
            role: "owner" as const,
          };

          trackAuthEvent("credentials.success", {
            email: normalizedEmail,
          });

          logger.info("auth.credentials.success", {
            email: normalizedEmail,
          });

          return user;
        }

        trackAuthEvent("credentials.failure", {
          email: normalizedEmail,
        });

        logger.warn("auth.credentials.invalid", {
          email: normalizedEmail,
        });

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "member";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "demo-user";
        session.user.role = (token.role as string | undefined) ?? "member";
      }

      return session;
    },
  },
  logger: {
    error: (code, metadata) => {
      getLogger().error("auth.error", { code, metadata });
    },
    warn: (code) => {
      getLogger().warn("auth.warn", { code });
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV !== "production") {
        getLogger().debug("auth.debug", { code, metadata });
      }
    },
  },
  events: {
    async signIn(message) {
      trackAuthEvent("signIn", {
        userId: message.user.id,
        provider: message.account?.provider,
      });
    },
    async signOut(message) {
      trackAuthEvent("signOut", {
        userId: message.token?.sub,
      });
    },
  },
};

export const auth = () => getServerSession(authOptions);

export const authHandler = NextAuth(authOptions);

export const handlers = { GET: authHandler, POST: authHandler };
