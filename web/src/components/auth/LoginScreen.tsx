import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";
import { AuthHeader } from "./AuthHeader";
import { Divider } from "./Divider";
import { PrimaryButton } from "./PrimaryButton";
import { ProviderButton, type AuthProvider } from "./ProviderButton";
import { TextInput } from "./TextInput";

interface LoginScreenProps {
  isLoading?: boolean;
  errorMessage?: string;
  provider?: AuthProvider;
  success?: boolean;
}

export function LoginScreen({ isLoading, errorMessage, provider, success }: LoginScreenProps) {
  const providerInProgress = Boolean(provider);
  const disableForm = Boolean(isLoading || success || providerInProgress);
  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col items-center px-4">
        <AuthCard
          title="Sign in"
          helper="Access your PaceTrace data."
          footerSlot={
            <span>
              Need an account? <a className="text-accent" href="/register">Create one</a>
            </span>
          }
        >
          <form className="space-y-6" aria-label="Sign in form">
            <TextInput
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="driver@pacetrace.app"
              required
              disabled={disableForm}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              disabled={disableForm}
              error={!success ? errorMessage : undefined}
            />
            <div className="flex items-center justify-between text-sm text-muted">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="remember" defaultChecked disabled={disableForm} />
                <span>Remember me</span>
              </label>
              <a className="text-accent" href="/forgot-password">
                Forgot password?
              </a>
            </div>
            {success ? (
              <p role="status" className="text-sm text-accent">
                Success! Redirecting to your workspace…
              </p>
            ) : null}
            <PrimaryButton isLoading={isLoading} disabled={disableForm && !isLoading}>
              Sign in
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
