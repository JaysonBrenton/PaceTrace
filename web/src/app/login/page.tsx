import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/LoginScreen";

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "Login — PaceTrace",
};

function resolveString(value?: string | string[]): string | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

function resolveBoolean(value?: string | string[]): boolean {
  if (!value) {
    return false;
  }

  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate === "true" || candidate === "1";
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ?? {};

  const error = resolveString(params.error);
  const success = resolveBoolean(params.success);

  return <LoginScreen errorMessage={error} success={success} />;
}
