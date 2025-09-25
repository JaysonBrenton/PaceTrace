import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms — PaceTrace",
};

export default function TermsPage() {
  return (
    <div className="space-y-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p>
        These interim terms outline the PaceTrace participation guidelines while
        we prepare the complete agreement.
      </p>
      <p className="text-sm text-muted-foreground">Last updated: July 5, 2024.</p>
    </div>
  );
}
