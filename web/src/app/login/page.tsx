import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/LoginScreen";
import type { AuthProvider } from "@/components/auth/ProviderButton";

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "Login — PaceTrace",
};

const allowedProviders: AuthProvider[] = ["google", "apple", "facebook"];

function resolveProvider(value?: string | string[]): AuthProvider | undefined {
  if (!value) {
    return undefined;
  }

  const candidate = Array.isArray(value) ? value[0] : value;

  return allowedProviders.find((provider) => provider === candidate) ?? undefined;
}

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
  const provider = resolveProvider(params.provider);

  return <LoginScreen errorMessage={error} success={success} provider={provider} />;
}
