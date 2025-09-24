"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, type FormEvent } from "react";

import { ErrorBanner } from "@/components/auth/error-banner";
import { Divider } from "@/components/auth/divider";
import { PrimaryButton } from "@/components/auth/primary-button";
import { ProviderButton, type AuthProvider } from "@/components/auth/provider-button";
import { TextInput } from "@/components/auth/text-input";
import { trackUiEvent } from "@/lib/telemetry";

const providers: AuthProvider[] = ["google", "apple", "facebook"];

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isBusy = useMemo(() => isSubmitting || Boolean(activeProvider), [isSubmitting, activeProvider]);

  const handleProviderSignIn = async (provider: AuthProvider) => {
    setGlobalError(null);
    setSuccessMessage(null);
    setActiveProvider(provider);
    trackUiEvent("auth.provider", { provider, surface: "register" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage(`Redirecting to ${provider}…`);
    } catch (error) {
      console.error(error);
      setGlobalError("We hit a network snag while contacting that provider. Try again.");
    } finally {
      setActiveProvider(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string | null)?.trim();
    const displayName = (formData.get("displayName") as string | null)?.trim();
    trackUiEvent("auth.register", { email, displayName });

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccessMessage("Account created! Redirecting to sign in…");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 900);
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

        <TextInput
          label="Display name"
          name="displayName"
          autoComplete="name"
          disabled={isBusy}
          placeholder="Your full name"
          required
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={isBusy}
          placeholder="••••••••••"
          required
          description="Use at least 12 characters"
        />

        <PrimaryButton type="submit" isLoading={isSubmitting} loadingLabel="Creating account…">
          Create account
        </PrimaryButton>
      </form>

      <Divider>Or</Divider>

      <div className="space-y-3" aria-label="Social registration options">
        {providers.map((provider) => (
          <ProviderButton
            key={provider}
            provider={provider}
            data-analytics-event={`auth:register:provider:${provider}`}
            isLoading={activeProvider === provider}
            disabled={isBusy}
            onClick={() => void handleProviderSignIn(provider)}
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-accent transition hover:text-accent-muted" href="/login">
          Sign in
        </Link>
      </p>
    </Fragment>
  );
}
