import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";

import { ResetPasswordForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a PaceTrace password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(var(--color-accent)/0.2),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-10%] h-[420px] bg-[radial-gradient(circle_at_top_right,hsla(var(--color-accent-2)/0.25),transparent_65%)]"
      />

      <AuthHeader className="relative z-10" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-8 sm:px-6">
        <AuthCard helper="Enter your email and we’ll send a reset link." title="Reset your password">
          <ResetPasswordForm />
        </AuthCard>
      </main>

      <AuthFooter />
    </div>
  );
}
