"use client";

import type { FormHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

import { ErrorBanner } from "./ErrorBanner";
import { PrimaryButton } from "./PrimaryButton";
import { TextInput } from "./TextInput";

interface ForgotPasswordFormProps extends Pick<FormHTMLAttributes<HTMLFormElement>, "action"> {
  errorMessage?: string;
  success?: boolean;
}

export function ForgotPasswordForm({ action, errorMessage, success }: ForgotPasswordFormProps) {
  return (
    <form className="space-y-6" aria-label="Reset password form" action={action}>
      <ForgotPasswordFormContent errorMessage={errorMessage} success={success} />
    </form>
  );
}

function ForgotPasswordFormContent({ errorMessage, success }: { errorMessage?: string; success?: boolean }) {
  const { pending } = useFormStatus();
  const disableFields = pending || Boolean(success);

  return (
    <>
      <TextInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@pacetrace.app"
        required
        disabled={disableFields}
        error={!success ? errorMessage : undefined}
      />
      {success ? (
        <p
          role="status"
          className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-sm text-accent"
        >
          If the email exists, a reset link has been sent.
        </p>
      ) : null}
      <ForgotPasswordSubmitButton pending={pending} disabled={disableFields && !pending} />
    </>
  );
}

function ForgotPasswordSubmitButton({ pending, disabled }: { pending: boolean; disabled: boolean }) {
  return (
    <PrimaryButton isLoading={pending} disabled={disabled}>
      Send reset link
    </PrimaryButton>
  );
}
