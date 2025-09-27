"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button, FormField, Input, Muted } from "@/components/ui";

export interface LoginFormProps {
  isLoading?: boolean;
  errorMessage?: string;
  success?: boolean;
}

export function LoginForm({ isLoading, errorMessage, success }: LoginFormProps) {
  const searchParams = useSearchParams();
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const queryError = searchParams?.get("error");

  useEffect(() => {
    if (!queryError) {
      setInternalError(null);
      return;
    }

    const normalized = queryError.toLowerCase();
    const message =
      normalized === "credentialssignin"
        ? "We couldn't verify those credentials. Give it another lap."
        : normalized === "oauthsignin"
          ? "We couldn't reach the identity provider. Please try again."
          : "We hit a bump while signing you in. Try again in a moment.";

    setInternalError(message);
    setIsSubmitting(false);
  }, [queryError]);

  const busy = useMemo(() => {
    if (success) {
      return false;
    }

    if (typeof isLoading === "boolean") {
      return isLoading;
    }

    return isSubmitting;
  }, [isLoading, isSubmitting, success]);

  const error = success ? undefined : errorMessage ?? internalError ?? undefined;
  const disableForm = Boolean(success || busy);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInternalError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = ((formData.get("email") as string | null) ?? "").trim();
    const password = (formData.get("password") as string | null) ?? "";

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Failed to sign in", error);
      if (!isMountedRef.current) {
        return;
      }
      setInternalError("We hit a bump while signing you in. Try again in a moment.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" aria-label="Sign in form" onSubmit={handleSubmit}>
      <FormField htmlFor="email" label="Email" requiredIndicator="*">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="driver@pacetrace.app"
          required
          disabled={disableForm}
        />
      </FormField>
      <FormField
        htmlFor="password"
        label="Password"
        requiredIndicator="*"
        error={error}
        errorId="password-error"
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          disabled={disableForm}
          invalid={Boolean(error)}
          aria-describedby={error ? "password-error" : undefined}
        />
      </FormField>
      <div className="flex justify-end text-sm">
        <a className="font-semibold text-accent transition hover:text-accent-strong" href="/forgot-password">
          Forgot password?
        </a>
      </div>
      {success ? (
        <Muted role="status" className="text-sm text-success">
          Success! Redirecting to your workspace…
        </Muted>
      ) : null}
      <Button type="submit" isLoading={busy} disabled={disableForm && !busy} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
