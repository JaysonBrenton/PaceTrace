import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Dashboard — PaceTrace",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?error=unauthenticated");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
      <h1 className="text-3xl font-semibold">Welcome, {session.user?.email ?? "pace-setter"}</h1>
      <p className="mt-2 text-sm text-muted">
        This is your PaceTrace workspace shell. We will hydrate it with live telemetry soon.
      </p>
    </main>
  );
}
