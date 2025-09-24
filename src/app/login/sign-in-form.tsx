"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, type FormEvent } from "react";

import { ErrorBanner } from "@/components/auth/error-banner";
import { Divider } from "@/components/auth/divider";
import { PrimaryButton } from "@/components/auth/primary-button";
import { ProviderButton, type AuthProvider } from "@/components/auth/provider-button";
import { TextInput } from "@/components/auth/text-input";
import { trackUiEvent } from "@/lib/telemetry";

const providers: AuthProvider[] = ["google", "apple", "facebook"];

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const isBusy = useMemo(() => isSubmitting || Boolean(activeProvider), [isSubmitting, activeProvider]);

  const handleProviderSignIn = async (provider: AuthProvider) => {
    setPasswordError(null);
    setGlobalError(null);
    setActiveProvider(provider);
    trackUiEvent("auth.provider", { provider });

    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      setGlobalError("We hit a network snag while contacting that provider. Try again.");
    } finally {
      setActiveProvider(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setGlobalError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string | null)?.trim();
    const password = (formData.get("password") as string | null) ?? "";
    const remember = formData.get("remember") === "on";

    trackUiEvent("auth.submit", { email, remember });

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setPasswordError("We couldn't verify those credentials. Give it another lap.");
        trackUiEvent("auth.error", { email, code: result.error });
        setIsSubmitting(false);
        return;
      }

      if (result?.url) {
        trackUiEvent("auth.success", { email });
        router.push(result.url);
        router.refresh();
        form.reset();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setGlobalError("We couldn't complete that request. Check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {globalError ? <ErrorBanner>{globalError}</ErrorBanner> : null}

      <form className="space-y-6" method="post" data-analytics-event="auth:submit" onSubmit={handleSubmit}>
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
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={isBusy}
          placeholder="••••••••"
          required
          action={
            <Link className="text-sm font-semibold text-accent transition hover:text-accent-muted" href="/forgot-password">
              Forgot password?
            </Link>
          }
          error={passwordError}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-muted-foreground" htmlFor="remember">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              disabled={isBusy}
              className="h-4 w-4 rounded border border-border bg-transparent text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
            />
            Remember me
          </label>
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Lap ready</span>
        </div>

        <PrimaryButton
          type="submit"
          data-analytics-event="auth:submit:primary"
          isLoading={isSubmitting}
          loadingLabel="Signing in…"
        >
          Sign in
        </PrimaryButton>
      </form>

      <Divider>Or continue with</Divider>

      <div className="space-y-3" aria-label="Social sign in options">
        {providers.map((provider) => (
          <ProviderButton
            key={provider}
            provider={provider}
            data-analytics-event={`auth:provider:${provider}`}
            isLoading={activeProvider === provider}
            disabled={isBusy}
            onClick={() => void handleProviderSignIn(provider)}
          />
        ))}
      </div>
    </Fragment>
  );
}
