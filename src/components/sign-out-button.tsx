"use client";

import { signOut } from "next-auth/react";

import { getEmailTelemetry } from "@/lib/email";
import { trackUiEvent } from "@/lib/telemetry";

type Props = {
  email: string;
};

export function SignOutButton({ email }: Props) {
  const handleSignOut = async () => {
    trackUiEvent("auth.signOut", getEmailTelemetry(email));
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground transition hover:border-accent/60 hover:text-accent"
    >
      Sign out
    </button>
  );
}
