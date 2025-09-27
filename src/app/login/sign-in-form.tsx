"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Button, FormField, Input, Muted } from "@/components/ui";
import { getEmailTelemetry } from "@/lib/email";
import { trackUiEvent } from "@/lib/telemetry";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const handledQueryErrorRef = useRef<string | null>(null);

  const isBusy = useMemo(() => isSubmitting, [isSubmitting]);

  const queryError = searchParams?.get("error") ?? null;
  const searchParamsString = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!queryError || handledQueryErrorRef.current === queryError) {
      return;
    }

    handledQueryErrorRef.current = queryError;

    const normalized = queryError.toLowerCase();
    const formSafeError =
      normalized === "credentialssignin"
        ? "We couldn't verify those credentials. Give it another lap."
        : normalized === "oauthsignin"
          ? "We couldn't reach the identity provider. Please try again."
          : "We hit a bump while signing you in. Try again, or refresh before your next attempt.";

    const emailTelemetry = getEmailTelemetry(null);
    trackUiEvent("auth.error", { ...emailTelemetry, code: queryError, surfacedFromQuery: true });

    setPasswordError(formSafeError);
    setIsSubmitting(false);

    const mutableParams = new URLSearchParams(searchParamsString);
    mutableParams.delete("error");
    const nextQuery = mutableParams.toString();

    router.replace(nextQuery ? `/login?${nextQuery}` : "/login");
  }, [queryError, router, searchParamsString]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string | null)?.trim();
    const password = (formData.get("password") as string | null) ?? "";
    const emailTelemetry = getEmailTelemetry(email);

    trackUiEvent("auth.submit", emailTelemetry);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setPasswordError("We couldn't verify those credentials. Give it another lap.");
      trackUiEvent("auth.error", { ...emailTelemetry, code: result.error });
      setIsSubmitting(false);
      return;
    }

    if (result?.url) {
      trackUiEvent("auth.success", emailTelemetry);
      router.push(result.url);
      router.refresh();
      form.reset();
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6"
      method="post"
      data-analytics-event="auth:submit"
      onSubmit={handleSubmit}
    >
      <FormField htmlFor="email" label="Email address" requiredIndicator="*">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isBusy}
          placeholder="you@teamradio.com"
        />
      </FormField>

      <FormField
        htmlFor="password"
        label="Password"
        requiredIndicator="*"
        error={passwordError ?? undefined}
        errorId="password-error"
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isBusy}
          invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "password-error" : undefined}
          placeholder="••••••••"
        />
      </FormField>

      <div className="flex justify-end text-sm">
        <Link className="font-semibold text-accent transition hover:text-accent-strong" href="/forgot-password">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      {passwordError ? (
        <Muted role="status" className="text-center text-sm text-danger">
          Need help? Reset your password or contact support if the issue persists.
        </Muted>
      ) : null}
    </form>
  );
}
