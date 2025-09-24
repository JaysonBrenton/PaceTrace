import Link from "next/link";

interface AuthHeaderProps {
  className?: string;
}

export function AuthHeader({ className }: AuthHeaderProps) {
  const baseClass = "mx-auto w-full max-w-4xl px-4 pt-12 text-center sm:px-6";
  const composedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <header className={composedClass}>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        <Link className="transition hover:text-accent-muted" href="/">
          PaceTrace — the one-stop lap logic shop.
        </Link>
      </p>
    </header>
  );
}
