import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — PaceTrace",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p>
        We are finalizing the PaceTrace privacy commitments and will publish the
        full policy soon.
      </p>
      <p className="text-sm text-muted-foreground">Last updated: July 5, 2024.</p>
    </div>
  );
}
