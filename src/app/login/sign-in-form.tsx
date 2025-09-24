"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Fragment, useState, type FormEvent, type JSX } from "react";

import { trackUiEvent } from "@/lib/telemetry";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProviderSubmitting, setIsProviderSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const providers: Array<{ id: string; label: string; description: string; connecting: string; icon: JSX.Element }> = [
    {
      id: "google",
      label: "Continue with Google",
      description: "Use your verified Google Workspace identity.",
      connecting: "Connecting to Google…",
      icon: (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M23.04 12.26c0-.78-.07-1.53-.2-2.26H12v4.27h6.24c-.27 1.4-1.1 2.6-2.34 3.4v2.83h3.78c2.2-2.03 3.46-5.02 3.46-8.24Z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.96-1.08 7.95-2.9l-3.78-2.83c-1.05.7-2.39 1.12-4.17 1.12-3.2 0-5.92-2.16-6.9-5.06H1.15v3.02C3.13 21.78 7.2 24 12 24Z"
            fill="#34A853"
          />
          <path
            d="M5.1 14.33c-.24-.7-.38-1.45-.38-2.22 0-.77.14-1.52.37-2.22V6.87H1.15C.42 8.32 0 9.97 0 11.78c0 1.8.42 3.45 1.15 4.9l3.95-2.35Z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.74c1.76 0 3.35.61 4.6 1.82l3.44-3.44C17.94 1.18 15.22 0 12 0 7.2 0 3.13 2.22 1.15 6.02l3.95 3.02c.98-2.9 3.7-5.06 6.9-5.06Z"
            fill="#EA4335"
          />
        </svg>
      ),
    },
    {
      id: "apple",
      label: "Continue with Apple",
      description: "Sign in with your Apple ID and Face/Touch ID.",
      connecting: "Connecting to Apple…",
      icon: (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.83 1.81c0 1.04-.46 2.04-1.23 2.78-.74.7-1.94 1.25-3.07 1.14-.14-1.02.46-2.07 1.19-2.74.78-.71 2.05-1.24 3.11-1.18Zm4.32 17.65c-.63 1.45-.93 2.11-1.75 3.39-1.14 1.73-2.75 3.89-4.73 3.9-1.77.02-2.23-1.14-4.65-1.12-2.42.02-2.94 1.15-4.72 1.13-1.98-.01-3.51-1.86-4.65-3.59-3.19-4.84-3.53-10.53-1.56-13.53 1.4-2.13 3.63-3.37 5.71-3.37 2.12 0 3.46 1.14 5.22 1.14 1.72 0 2.77-1.14 5.24-1.14 1.86 0 3.83.98 5.22 2.66-4.58 2.51-3.84 9.05.67 10.54Z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Continue with Facebook",
      description: "Authenticate with your team’s Facebook workspace.",
      connecting: "Connecting to Facebook…",
      icon: (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 1.88 6.48 1.88 12.06c0 4.99 3.66 9.13 8.44 9.94v-7.03H7.97v-2.91h2.35V9.84c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.76h2.59l-.41 2.91h-2.18V22c4.78-.81 8.44-4.95 8.44-9.94Z" />
        </svg>
      ),
    },
    {
      id: "phone",
      label: "Continue with phone number",
      description: "Receive a verification code via SMS for quick access.",
      connecting: "Texting your phone…",
      icon: (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.707 13.293a1 1 0 0 0-1.414 0l-1.647 1.647a12.077 12.077 0 0 1-5.586-5.586l1.647-1.647a1 1 0 0 0 0-1.414l-3.5-3.5a1 1 0 0 0-1.414 0L4.03 4.312c-.314.314-.487.74-.487 1.183 0 .209-.021 5.16 3.632 8.813C10.828 19.96 15.78 19.94 15.99 19.94c.442 0 .868-.173 1.182-.487l1.216-1.216a1 1 0 0 0 0-1.414l-3.681-3.53Z" />
        </svg>
      ),
    },
  ];

  const handleProviderSignIn = async (provider: string) => {
    setError(null);
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
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string | null)?.trim();
    const password = formData.get("password") as string | null;

    trackUiEvent("auth.submit", { email });

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("We couldn't verify those credentials. Give it another lap.");
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
      <div className="space-y-3">
        {providers.map((provider) => {
          const isActive = isProviderSubmitting === provider.id;

          return (
            <button
              key={provider.id}
              type="button"
              className="group inline-flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-sm transition hover:border-border hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed"
              data-analytics-event={`auth:provider:${provider.id}`}
              disabled={Boolean(isProviderSubmitting)}
              onClick={() => void handleProviderSignIn(provider.id)}
            >
              <span className="flex items-center gap-3 font-semibold text-foreground">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-foreground">
                  {provider.icon}
                </span>
                {isActive ? provider.connecting : provider.label}
              </span>
              <span className="hidden text-xs text-muted-foreground/80 sm:inline">{provider.description}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        <span className="h-px flex-1 bg-muted/60" aria-hidden />
        Or
        <span className="h-px flex-1 bg-muted/60" aria-hidden />
      </div>

      <form className="space-y-6" method="post" data-analytics-event="auth:submit" onSubmit={handleSubmit}>
        <div className="grid gap-2 text-left">
          <label className="text-sm font-medium text-foreground/80" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-2xl border border-border/70 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
            placeholder="you@teamradio.com"
            aria-describedby="email-hint"
          />
          <p id="email-hint" className="text-xs text-muted-foreground/80">
            Use the email you received your PaceTrace invite with.
          </p>
        </div>

        <div className="grid gap-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground/80" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-accent transition hover:text-[hsl(var(--color-accent-muted))]"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"} password
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="block w-full rounded-2xl border border-border/70 bg-transparent px-4 py-3 pr-16 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
              placeholder="••••••••"
              aria-describedby="password-hint"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Secure
            </span>
          </div>
          <p id="password-hint" className="text-xs text-muted-foreground/80">
            Minimum 8 characters. Session notifications let you know about new sign-ins instantly.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm text-foreground/80">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-border/70 bg-transparent text-[hsl(var(--color-accent))] focus:ring-[hsl(var(--color-accent))]"
            />
            Remember this device
          </label>
          <Link className="text-sm font-medium text-accent transition hover:text-[hsl(var(--color-accent-muted))]" href="mailto:ops@pacetrace.io">
            Need a reset link?
          </Link>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-semibold text-background transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-70"
          data-analytics-event="auth:submit:primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Secure sign in"}
        </button>
        <p className="text-xs text-muted-foreground/80">
          PaceTrace uses device verification and encryption at rest. We’ll never share your telemetry or credentials.
        </p>
        {error ? (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}
      </form>
    </Fragment>
  );
}
