"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

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
    <Fragment>
      <form className="space-y-6" method="post" data-analytics-event="auth:submit" onSubmit={handleSubmit}>
        <div className="grid gap-2 text-left">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isBusy}
            className="block w-full rounded-xl border border-border bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))] disabled:opacity-70"
            placeholder="you@teamradio.com"
          />
        </div>

        <div className="grid gap-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="password">
              Password
            </label>
            <Link className="text-sm font-semibold text-accent transition hover:text-accent-muted" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isBusy}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "password-error" : undefined}
            className="block w-full rounded-xl border border-border bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))] disabled:opacity-70"
            placeholder="••••••••"
          />
          {passwordError ? (
            <p className="text-sm font-medium text-destructive" id="password-error" role="alert">
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end text-sm">
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Lap ready</span>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-semibold text-[hsl(var(--color-card))] transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-accent)/0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-80"
          data-analytics-event="auth:submit:primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Fragment>
  );
}
