import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";
import { AuthHeader } from "./AuthHeader";
import { Divider } from "./Divider";
import { ErrorBanner } from "./ErrorBanner";
import { PrimaryButton } from "./PrimaryButton";
import { ProviderButton, type AuthProvider } from "./ProviderButton";
import { TextInput } from "./TextInput";

interface RegisterScreenProps {
  isLoading?: boolean;
  errorMessage?: string;
  provider?: AuthProvider;
  success?: boolean;
}

export function RegisterScreen({ isLoading, errorMessage, provider, success }: RegisterScreenProps) {
  const disableForm = Boolean(isLoading || provider || success);
  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col items-center px-4">
        <AuthCard
          title="Create account"
          helper="Start your PaceTrace workspace."
          footerSlot={
            <span>
              Already a member? <a className="text-accent" href="/login">Sign in</a>
            </span>
          }
        >
          <form className="space-y-6" aria-label="Create account form">
            {errorMessage && !success ? <ErrorBanner message={errorMessage} /> : null}
            {success ? (
              <p role="status" className="rounded-lg border border-accent/30 bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-4 py-3 text-sm text-accent">
                Account created. Welcome to PaceTrace!
              </p>
            ) : null}
            <TextInput
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="team@pacetrace.app"
              required
              disabled={disableForm}
            />
            <TextInput
              label="Display name"
              name="displayName"
              autoComplete="name"
              placeholder="Your team handle"
              required
              disabled={disableForm}
            />
            <div className="space-y-2">
              <TextInput
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                required
                disabled={disableForm}
              />
              <p className="text-sm text-muted">Use at least 8 characters with a mix of numbers and symbols.</p>
            </div>
            <PrimaryButton isLoading={isLoading} disabled={disableForm && !isLoading}>
              Create account
            </PrimaryButton>
            <Divider />
            <div className="space-y-3">
              <ProviderButton
                provider="google"
                isLoading={provider === "google"}
                disabled={disableForm && provider !== "google"}
              />
              <ProviderButton
                provider="apple"
                isLoading={provider === "apple"}
                disabled={disableForm && provider !== "apple"}
              />
              <ProviderButton
                provider="facebook"
                isLoading={provider === "facebook"}
                disabled={disableForm && provider !== "facebook"}
              />
            </div>
          </form>
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
