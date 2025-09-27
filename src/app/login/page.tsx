import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Page, PageHeader, Card, Muted } from "@/components/ui";

import { LoginForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authenticate to access PaceTrace telemetry and coaching tools.",
};

export default function LoginPage() {
  return (
    <Page>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">
          <PageHeader
            eyebrow="PaceTrace — the one-stop lap logic shop."
            title="Sign in"
            description="Access your PaceTrace data."
            className="space-y-4 text-center"
          />
          <Card className="space-y-8 p-10 sm:p-12">
            <Suspense
              fallback={
                <div className="space-y-4" aria-busy="true">
                  <div className="h-12 w-full rounded-lg bg-fg-subtle/20" />
                  <div className="h-40 w-full rounded-2xl bg-fg-subtle/10" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </Card>
          <Muted className="text-center">
            Need an account?{" "}
            <Link className="font-semibold text-accent transition hover:text-accent-strong" href="/register">
              Create one
            </Link>
          </Muted>
        </div>
      </main>
      <footer className="border-t border-border/60 bg-surface/80 py-6">
        <p className="mx-auto max-w-4xl px-4 text-center text-xs text-fg-muted sm:px-6">
          © PaceTrace •{" "}
          <Link className="font-medium text-accent transition hover:text-accent-strong" href="/legal/privacy">
            Privacy
          </Link>{" "}
          •{" "}
          <Link className="font-medium text-accent transition hover:text-accent-strong" href="/legal/terms">
            Terms
          </Link>{" "}
          • <span className="font-semibold text-fg">See the data. Find the pace.</span>
        </p>
      </footer>
    </Page>
  );
}
