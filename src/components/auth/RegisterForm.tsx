"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { ErrorBanner } from "./ErrorBanner";
import { PrimaryButton } from "./PrimaryButton";
import { TextInput } from "./TextInput";

const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  missingFields: "We need all fields to keep your workspace request on track.",
  invalidEmail: "That email format looks off. Double-check it before resubmitting.",
  weakPassword: "Passwords need at least 8 characters to stay race-ready.",
  emailInUse: "That email already has an account in review.",
  invalidInput: "We need valid account details to continue.",
  unknown: "We couldn't process that request. Please try again.",
};

function validateForm(form: HTMLFormElement) {
  const email = (form.email?.value as string | undefined)?.trim() ?? "";
  const displayName = (form.displayName?.value as string | undefined)?.trim() ?? "";
  const password = (form.password?.value as string | undefined) ?? "";

  if (!email || !displayName || !password) {
    return { error: "missingFields" } as const;
  }

  if (!/^.+@.+\..+$/.test(email)) {
    return { error: "invalidEmail" } as const;
  }

  if (password.length < 8) {
    return { error: "weakPassword" } as const;
  }

  return {
    data: {
      email,
      name: displayName,
      password,
    },
  } as const;
}

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const disableFields = pending || success;

  const errorMessage = useMemo(() => {
    if (!error) {
      return undefined;
    }

    return REGISTER_ERROR_MESSAGES[error] ?? REGISTER_ERROR_MESSAGES.unknown;
  }, [error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    const form = event.currentTarget;
    const validation = validateForm(form);

    if ("error" in validation) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    setPending(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
        setError(payload?.error ?? "unknown");
        return;
      }

      setSuccess(true);
      form.reset();
    } catch (submitError) {
      console.error("[register] submission failed", submitError);
      setError("unknown");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-6" aria-label="Create account form" onSubmit={handleSubmit}>
      {errorMessage && !success ? <ErrorBanner message={errorMessage} /> : null}
      {success ? (
        <p
          role="status"
          className="rounded-lg border border-accent/30 bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-4 py-3 text-sm text-accent"
        >
          Thanks — your account is pending approval.
        </p>
      ) : null}
      <TextInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="team@pacetrace.app"
        required
        disabled={disableFields}
      />
      <TextInput
        label="Display name"
        name="displayName"
        autoComplete="name"
        placeholder="Your team handle"
        required
        disabled={disableFields}
      />
      <div className="space-y-2">
        <TextInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          required
          disabled={disableFields}
        />
        <p className="text-sm text-muted">Use at least 8 characters with a mix of numbers and symbols.</p>
      </div>
      <PrimaryButton isLoading={pending} disabled={disableFields && !pending}>
        Request access
      </PrimaryButton>
    </form>
  );
}
