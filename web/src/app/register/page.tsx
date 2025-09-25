import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";

interface RegisterPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: "Register — PaceTrace",
};

const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  missingFields: "We need all fields to keep your workspace request on track.",
  invalidEmail: "That email format looks off. Double-check it before resubmitting.",
  weakPassword: "Passwords need at least 8 characters to stay race-ready.",
  unknown: "We couldn't process that request. Please try again.",
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

function redirectWithSearch(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  redirect(query ? `/register?${query}` : "/register");
}

async function registerAction(formData: FormData) {
  "use server";

  const email = ((formData.get("email") as string | null) ?? "").trim();
  const displayName = ((formData.get("displayName") as string | null) ?? "").trim();
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !displayName || !password) {
    redirectWithSearch({ error: "missingFields" });
  }

  if (!/^.+@.+\..+$/.test(email)) {
    redirectWithSearch({ error: "invalidEmail" });
  }

  if (password.length < 8) {
    redirectWithSearch({ error: "weakPassword" });
  }

  // Placeholder: this action only validates field shape today.
  // When we wire up persistence, persist the workspace request and emit onboarding notifications here.
  redirectWithSearch({ success: "1" });
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = searchParams ?? {};
  const success = resolveBoolean(params.success);
  const errorKey = resolveString(params.error);

  const errorMessage = errorKey ? REGISTER_ERROR_MESSAGES[errorKey] ?? REGISTER_ERROR_MESSAGES.unknown : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col items-center px-4">
        <AuthCard
          title="Create account"
          helper="Start your PaceTrace workspace."
          footerSlot={
            <span>
              Already a member? <a className="text-accent" href="/login">Sign in</a>
            </span>
          }
        >
          <RegisterForm action={registerAction} errorMessage={errorMessage} success={success} />
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
