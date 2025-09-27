import type { Meta, StoryObj } from "@storybook/react";

import { Page, PageHeader, ThemeAudit } from "@/components/ui";

const meta: Meta<typeof ThemeAudit> = {
  title: "Foundations/Theme Audit",
  component: ThemeAudit,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      disable: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ThemeAudit>;

export const Midnight: Story = {
  name: "Midnight",
  render: () => (
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
  ),
};
