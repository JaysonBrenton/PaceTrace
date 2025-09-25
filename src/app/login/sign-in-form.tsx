"use client";

import Link from "next/link";
import { signIn, getProviders, type ClientSafeProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";

import { trackUiEvent } from "@/lib/telemetry";

const providerCopy: Record<string, { label: string; busy: string }> = {
  google: {
    label: "Continue with Google",
    busy: "Connecting to Google…",
  },
  apple: {
    label: "Continue with Apple",
    busy: "Connecting to Apple…",
  },
  facebook: {
    label: "Continue with Facebook",
    busy: "Connecting to Facebook…",
  },
};

const socialProviderOrder = ["google", "apple", "facebook"] as const;

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProviderSubmitting, setIsProviderSubmitting] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [availableProviders, setAvailableProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  const isBusy = useMemo(() => isSubmitting || Boolean(isProviderSubmitting), [isSubmitting, isProviderSubmitting]);

  useEffect(() => {
    let isMounted = true;

    void getProviders()
      .then((providers) => {
        if (!isMounted) return;
        setAvailableProviders(providers ?? {});
      })
      .catch(() => {
        if (!isMounted) return;
        setAvailableProviders({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const enabledSocialProviders = useMemo(() => {
    if (!availableProviders) {
      return [];
    }

    return socialProviderOrder.filter((provider) => Boolean(availableProviders[provider]));
  }, [availableProviders]);

  const handleProviderSignIn = async (provider: "google" | "apple" | "facebook") => {
    if (!availableProviders?.[provider]) {
      return;
    }

    setPasswordError(null);
    setIsProviderSubmitting(provider);
    trackUiEvent("auth.provider", { provider });

    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } finally {
      setIsProviderSubmitting(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string | null)?.trim();
    const password = (formData.get("password") as string | null) ?? "";
    const remember = formData.get("remember") === "on";

    trackUiEvent("auth.submit", { email, remember });

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

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-semibold text-[hsl(var(--color-card))] transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-accent)/0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-80"
          data-analytics-event="auth:submit:primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {availableProviders && enabledSocialProviders.length > 0 ? (
        <Fragment>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
            <span className="h-px flex-1 bg-muted" aria-hidden />
            Or continue with
            <span className="h-px flex-1 bg-muted" aria-hidden />
          </div>

          <div className="space-y-3" aria-label="Social sign in options">
            {enabledSocialProviders.map((provider) => (
              <button
                key={provider}
                type="button"
                className={
                  provider === "google"
                    ? "inline-flex w-full items-center justify-center rounded-full bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-semibold text-[hsl(var(--color-card))] transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-accent)/0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-80"
                    : provider === "apple"
                      ? "inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-70"
                      : "inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-[hsl(var(--color-accent-2))] hover:text-[hsl(var(--color-accent-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-accent-2))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-70"
                }
                data-analytics-event={`auth:provider:${provider}`}
                disabled={isBusy}
                onClick={() => void handleProviderSignIn(provider)}
              >
                {isProviderSubmitting === provider ? providerCopy[provider].busy : providerCopy[provider].label}
              </button>
            ))}
          </div>
        </Fragment>
      ) : null}

      {availableProviders && enabledSocialProviders.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground" role="status">
          Single sign-on providers will appear here once configured for your team.
        </p>
      ) : null}
    </Fragment>
  );
}
