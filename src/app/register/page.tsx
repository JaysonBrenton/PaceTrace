import type { Metadata } from "next";
import Link from "next/link";

import { Card, Muted, Page, PageHeader } from "@/components/ui";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register — PaceTrace",
};

export default function RegisterPage() {
  return (
    <Page>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">
          <PageHeader
            eyebrow="PaceTrace"
            title="Create account"
            description="Start your PaceTrace workspace."
            className="space-y-4 text-center"
          />
          <Card className="space-y-8 p-10 sm:p-12">
            <RegisterForm />
          </Card>
          <Muted className="text-center">
            Already a member?{" "}
            <Link className="font-semibold text-accent transition hover:text-accent-strong" href="/login">
              Sign in
            </Link>
          </Muted>
        </div>
      </main>
      <footer className="border-t border-border/60 bg-surface/80 py-6">
        <p className="mx-auto max-w-4xl px-4 text-center text-xs text-fg-muted sm:px-6">
          Need a refresher on our policies? Visit our{" "}
          <Link className="font-medium text-accent transition hover:text-accent-strong" href="/legal/privacy">
            Privacy
          </Link>{" "}
          and{" "}
          <Link className="font-medium text-accent transition hover:text-accent-strong" href="/legal/terms">
            Terms
          </Link>{" "}
          pages.
        </p>
      </footer>
    </Page>
  );
}
