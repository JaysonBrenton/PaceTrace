import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";
import { AuthHeader } from "./AuthHeader";
import { LoginForm } from "./LoginForm";

interface LoginScreenProps {
  isLoading?: boolean;
  errorMessage?: string;
  success?: boolean;
}

export function LoginScreen({ isLoading, errorMessage, success }: LoginScreenProps) {
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
          <LoginForm isLoading={isLoading} errorMessage={errorMessage} success={success} />
        </AuthCard>
        <AuthFooter />
      </main>
    </div>
  );
}
