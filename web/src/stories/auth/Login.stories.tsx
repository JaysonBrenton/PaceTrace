import type { Meta, StoryObj } from "@storybook/react";
import { LoginScreen } from "@/components/auth/LoginScreen";

const meta: Meta<typeof LoginScreen> = {
  title: "Auth/Login",
  component: LoginScreen,
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

type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    errorMessage: "Incorrect password. Try again.",
  },
};

export const ProviderInProgress: Story = {
  args: {
    provider: "google",
  },
};

export const SuccessRedirect: Story = {
  args: {
    success: true,
  },
};
