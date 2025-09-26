import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register — PaceTrace",
};

export default function RegisterPage() {
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
          <RegisterForm />
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
