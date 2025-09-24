"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Fragment, useState, type FormEvent } from "react";

import { trackUiEvent } from "@/lib/telemetry";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProviderSubmitting, setIsProviderSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))]"
          data-analytics-event="auth:provider:google"
          disabled={Boolean(isProviderSubmitting)}
          onClick={() => void handleProviderSignIn("google")}
        >
          {isProviderSubmitting === "google" ? "Connecting to Google…" : "Continue with Google"}
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-border/60 bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:border-border hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))]"
          data-analytics-event="auth:provider:facebook"
          disabled={Boolean(isProviderSubmitting)}
          onClick={() => void handleProviderSignIn("facebook")}
        >
          {isProviderSubmitting === "facebook" ? "Connecting to Facebook…" : "Continue with Facebook"}
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-border/60 bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:border-border hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))]"
          data-analytics-event="auth:provider:apple"
          disabled={Boolean(isProviderSubmitting)}
          onClick={() => void handleProviderSignIn("apple")}
        >
          {isProviderSubmitting === "apple" ? "Connecting to Apple…" : "Continue with Apple"}
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-border/60 bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:border-border hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))]"
          data-analytics-event="auth:provider:phone"
          disabled={Boolean(isProviderSubmitting)}
          onClick={() => void handleProviderSignIn("phone")}
        >
          {isProviderSubmitting === "phone" ? "Texting your phone…" : "Continue with phone number"}
        </button>
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
          className="block w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
          placeholder="you@teamradio.com"
        />
        </div>

        <div className="grid gap-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground/80" htmlFor="password">
              Password
            </label>
            <span className="text-xs font-medium text-accent">Contact ops</span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(var(--color-bg))]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-semibold text-background transition hover:bg-[hsl(var(--color-accent-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--color-foreground)/0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-70"
          data-analytics-event="auth:submit:primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </Fragment>
  );
}
