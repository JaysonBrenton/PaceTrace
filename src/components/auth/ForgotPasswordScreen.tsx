import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";
import { AuthHeader } from "./AuthHeader";
import { PrimaryButton } from "./PrimaryButton";
import { TextInput } from "./TextInput";

interface ForgotPasswordScreenProps {
  isLoading?: boolean;
  errorMessage?: string;
  success?: boolean;
}

export function ForgotPasswordScreen({ isLoading, errorMessage, success }: ForgotPasswordScreenProps) {
  const disableForm = Boolean(isLoading || success);
  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col items-center px-4">
        <AuthCard
          title="Reset password"
          helper="We'll send you a secure reset link."
          footerSlot={
            <span>
              Remembered it? <a className="text-accent" href="/login">Return to sign in</a>
            </span>
          }
        >
          <form className="space-y-6" aria-label="Reset password form">
            <TextInput
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@pacetrace.app"
              required
              disabled={disableForm}
              error={!success ? errorMessage : undefined}
            />
            {success ? (
              <p role="status" className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-sm text-accent">
                If that email is registered, a reset link is on the way.
              </p>
            ) : null}
            <PrimaryButton isLoading={isLoading} disabled={disableForm && !isLoading}>
              Send reset link
            </PrimaryButton>
          </form>
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
