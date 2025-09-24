import type { Meta, StoryObj } from "@storybook/react";
import { RegisterScreen } from "@/components/auth/RegisterScreen";

const meta: Meta<typeof RegisterScreen> = {
  title: "Auth/Register",
  component: RegisterScreen,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    errorMessage: { control: "text" },
    isLoading: { control: "boolean" },
    provider: {
      control: "select",
      options: ["google", "apple", "facebook", undefined],
    },
    success: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof RegisterScreen>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    errorMessage: "Display name is already taken.",
  },
};

export const ProviderInProgress: Story = {
  args: {
    provider: "apple",
  },
};

export const Success: Story = {
  args: {
    success: true,
  },
};
