"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, type FormEvent } from "react";

import { ErrorBanner } from "@/components/auth/error-banner";
import { PrimaryButton } from "@/components/auth/primary-button";
import { TextInput } from "@/components/auth/text-input";
import { trackUiEvent } from "@/lib/telemetry";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isBusy = useMemo(() => isSubmitting, [isSubmitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string | null)?.trim();
    trackUiEvent("auth.reset", { email });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage("If an account exists, we just sent a reset link to that inbox.");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      setGlobalError("We couldn't complete that request. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {globalError ? <ErrorBanner>{globalError}</ErrorBanner> : null}
      {successMessage ? (
        <div className="rounded-2xl border border-success/30 bg-[hsla(var(--color-success)/0.08)] px-4 py-3 text-sm font-medium text-success">
          {successMessage}
        </div>
      ) : null}

      <form className="space-y-6" method="post" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isBusy}
          placeholder="you@teamradio.com"
          required
        />

        <PrimaryButton type="submit" isLoading={isSubmitting} loadingLabel="Sending reset link…">
          Send reset link
        </PrimaryButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link className="font-semibold text-accent transition hover:text-accent-muted" href="/login">
          Sign in
        </Link>
      </p>
    </Fragment>
  );
}
