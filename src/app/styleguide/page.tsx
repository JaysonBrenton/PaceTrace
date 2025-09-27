import type { Metadata } from "next";

import { Page, PageHeader, ThemeAudit } from "@/components/ui";

export const metadata: Metadata = {
  title: "Styleguide — PaceTrace",
  description: "Visual audit of PaceTrace design tokens and primitives.",
};

export default function StyleguidePage() {
  return (
    <Page>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-12">
        <PageHeader
          eyebrow="Design system"
          title="Midnight theme audit"
          description="Use this grid to validate contrast, spacing, and primitive states."
          className="text-left"
        />
        <ThemeAudit />
      </main>
    </Page>
  );
}
