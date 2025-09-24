import type { Meta, StoryObj } from "@storybook/react";

const swatches = [
  { name: "--color-accent", description: "Primary brand accent" },
  { name: "--color-accent-2", description: "Secondary accent highlight" },
  { name: "--color-danger", description: "Errors and destructive actions" },
  { name: "--color-bg", description: "Application background" },
  { name: "--color-fg", description: "Primary text" },
  { name: "--color-muted", description: "Secondary text" },
  { name: "--color-border", description: "Strokes and separators" },
];

const meta: Meta = {
  title: "Theme/Reference",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Tokens: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-8 py-16 text-foreground">
      <div className="w-full max-w-4xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">PaceTrace Theme Tokens</h1>
          <p className="text-base text-muted">Design tokens drive every auth surface. Use these references when extending the system.</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2">
          {swatches.map((token) => (
            <div key={token.name} className="rounded-xl border border-border bg-background p-6 shadow-card">
              <div
                className="h-20 w-full rounded-lg border border-border"
                style={{ background: `var(${token.name})` }}
                aria-hidden
              />
              <dl className="mt-4 space-y-1">
                <dt className="text-sm font-semibold text-foreground">{token.name}</dt>
                <dd className="text-sm text-muted">{token.description}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
