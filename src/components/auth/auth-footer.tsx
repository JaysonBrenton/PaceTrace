import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/70 py-8 backdrop-blur-sm">
      <p className="mx-auto max-w-4xl px-4 text-center text-xs text-muted-foreground sm:px-6">
        © PaceTrace •{" "}
        <Link className="font-medium text-accent transition hover:text-accent-muted" href="/legal/privacy">
          Privacy
        </Link>{" "}
        •{" "}
        <Link className="font-medium text-accent transition hover:text-accent-muted" href="/legal/terms">
          Terms
        </Link>{" "}
        • <span className="font-semibold text-foreground">See the data. Find the pace.</span>
      </p>
    </footer>
  );
}
