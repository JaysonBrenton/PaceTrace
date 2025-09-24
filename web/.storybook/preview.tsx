import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
    },
    chromatic: {
      diffThreshold: 0.2,
      pauseAnimationAtEnd: true,
    },
    options: {
      storySort: {
        order: ["Theme", "Auth"],
      },
    },
  },
};

export default preview;
