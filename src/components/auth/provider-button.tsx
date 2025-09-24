import { forwardRef, type ButtonHTMLAttributes } from "react";

export type AuthProvider = "google" | "apple" | "facebook";

interface ProviderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: AuthProvider;
  isLoading?: boolean;
  loadingLabel?: string;
}

const providerCopy: Record<AuthProvider, { label: string; loading: string; className: string }> = {
  google: {
    label: "Continue with Google",
    loading: "Connecting to Google…",
    className: "bg-accent text-card hover:bg-accent-muted focus-visible:ring-accent",
  },
  apple: {
    label: "Continue with Apple",
    loading: "Connecting to Apple…",
    className: "border border-border bg-card text-foreground hover:border-accent hover:text-accent focus-visible:ring-accent",
  },
  facebook: {
    label: "Continue with Facebook",
    loading: "Connecting to Facebook…",
    className:
      "border border-border bg-card text-foreground hover:border-[hsl(var(--color-accent-2))] hover:text-[hsl(var(--color-accent-2))] focus-visible:ring-[hsl(var(--color-accent-2))]",
  },
};

export const ProviderButton = forwardRef<HTMLButtonElement, ProviderButtonProps>(
  ({ provider, isLoading = false, loadingLabel, className, disabled, children, ...props }, ref) => {
    const copy = providerCopy[provider];
    const composedClass =
      "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-70 " +
      copy.className +
      (className ? ` ${className}` : "");

    return (
      <button
        ref={ref}
        type="button"
        className={composedClass}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        {...props}
      >
        {children ?? (isLoading ? loadingLabel ?? copy.loading : copy.label)}
      </button>
    );
  },
);

ProviderButton.displayName = "ProviderButton";
