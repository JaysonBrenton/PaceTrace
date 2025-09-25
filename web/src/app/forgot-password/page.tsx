import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

interface ForgotPasswordPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: "Forgot Password — PaceTrace",
};

function resolveBoolean(value?: string | string[]): boolean {
  if (!value) {
    return false;
  }

  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate === "true" || candidate === "1";
}

function resolveString(value?: string | string[]): string | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

function redirectWithSearch(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  redirect(query ? `/forgot-password?${query}` : "/forgot-password");
}

async function forgotPasswordAction(formData: FormData) {
  "use server";

  const email = ((formData.get("email") as string | null) ?? "").trim();

  if (!email) {
    redirectWithSearch({ error: "missingEmail" });
  }

  // Placeholder: this action only acknowledges the request today.
  // When email delivery is available, enqueue the reset token send here.
  redirectWithSearch({ success: "1" });
}

const FORGOT_PASSWORD_ERROR_MESSAGES: Record<string, string> = {
  missingEmail: "Enter the email tied to your PaceTrace workspace to continue.",
  unknown: "We couldn't process that reset attempt. Try again shortly.",
};

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = searchParams ?? {};
  const success = resolveBoolean(params.success);
  const errorKey = resolveString(params.error);
  const errorMessage = errorKey ? FORGOT_PASSWORD_ERROR_MESSAGES[errorKey] ?? FORGOT_PASSWORD_ERROR_MESSAGES.unknown : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col items-center px-4">
        <AuthCard
          title="Reset password"
          helper="We'll send you a secure reset link."
          footerSlot={
            <span>
              Remembered it? <a className="text-accent" href="/login">Return to sign in</a>
            </span>
          }
        >
          <ForgotPasswordForm action={forgotPasswordAction} errorMessage={errorMessage} success={success} />
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
