import type { Meta, StoryObj } from "@storybook/react";
import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";

const meta: Meta<typeof ForgotPasswordScreen> = {
  title: "Auth/Forgot",
  component: ForgotPasswordScreen,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    errorMessage: { control: "text" },
    isLoading: { control: "boolean" },
    success: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof ForgotPasswordScreen>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Sent: Story = {
  args: {
    success: true,
  },
};
