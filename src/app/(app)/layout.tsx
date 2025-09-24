import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-card/60 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              PT
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">PaceTrace Ops</p>
              <p className="text-xs text-muted-foreground/80">
                {session.user.email}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Link className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-border/80 hover:text-foreground" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-border/80 hover:text-foreground" href="/timeline">
              Timeline
            </Link>
            <Link className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-border/80 hover:text-foreground" href="/ops">
              Operations
            </Link>
          </nav>
          <SignOutButton email={session.user.email ?? ""} />
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
