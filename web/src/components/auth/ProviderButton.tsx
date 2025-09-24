import type { ButtonHTMLAttributes } from "react";

export type AuthProvider = "google" | "apple" | "facebook";

const providerCopy: Record<AuthProvider, { label: string; glyph: string }> = {
  google: { label: "Google", glyph: "G" },
  apple: { label: "Apple", glyph: "" },
  facebook: { label: "Facebook", glyph: "f" },
};

interface ProviderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: AuthProvider;
  isLoading?: boolean;
}

export function ProviderButton({ provider, isLoading, className, disabled, ...props }: ProviderButtonProps) {
  const { label, glyph } = providerCopy[provider];
  const isDisabled = Boolean(disabled || isLoading);
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-base font-medium text-foreground transition hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/40 disabled:cursor-not-allowed disabled:opacity-70 ${
        className ?? ""
      }`}
      aria-label={`Continue with ${label}`}
      data-provider={provider}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm uppercase">
        {glyph}
      </span>
      <span className="flex-1 text-left">Continue with {label}</span>
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border border-foreground/20 border-t-accent" aria-hidden />
      ) : null}
    </button>
  );
}
