interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/30 bg-[color:color-mix(in_srgb,var(--color-danger)_15%,transparent)] px-4 py-3 text-sm text-danger"
    >
      {message}
    </div>
  );
}
