export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">PaceTrace UI Sandbox</h1>
        <p className="text-lg text-muted">
          Auth surfaces are modeled in Storybook for desktop review. Launch Storybook to explore the Mid-Fi concepts.
        </p>
      </div>
    </main>
  );
}
