"use client";

import type { FormHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

import { ErrorBanner } from "./ErrorBanner";
import { PrimaryButton } from "./PrimaryButton";
import { TextInput } from "./TextInput";

interface RegisterFormProps extends Pick<FormHTMLAttributes<HTMLFormElement>, "action"> {
  errorMessage?: string;
  success?: boolean;
}

export function RegisterForm({ action, errorMessage, success }: RegisterFormProps) {
  return (
    <form className="space-y-6" aria-label="Create account form" action={action}>
      <RegisterFormContent errorMessage={errorMessage} success={success} />
    </form>
  );
}

function RegisterFormContent({ errorMessage, success }: { errorMessage?: string; success?: boolean }) {
  const { pending } = useFormStatus();
  const disableFields = pending || Boolean(success);

  return (
    <>
      {errorMessage && !success ? <ErrorBanner message={errorMessage} /> : null}
      {success ? (
        <p
          role="status"
          className="rounded-lg border border-accent/30 bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-4 py-3 text-sm text-accent"
        >
          Account request received — continue to {" "}
          <a className="underline-offset-4 hover:underline" href="/login">
            Login
          </a>
          .
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
      <RegisterSubmitButton pending={pending} disabled={disableFields && !pending} />
    </>
  );
}

function RegisterSubmitButton({ pending, disabled }: { pending: boolean; disabled: boolean }) {
  return (
    <PrimaryButton isLoading={pending} disabled={disabled}>
      Request access
    </PrimaryButton>
  );
}
