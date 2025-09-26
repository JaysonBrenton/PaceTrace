export function AuthFooter() {
  return (
    <footer className="mt-12 flex flex-col items-center gap-3 py-10 text-sm text-muted">
      <div className="flex items-center gap-3">
        <span>© PaceTrace</span>
        <span aria-hidden>•</span>
        <a href="/legal/privacy" className="underline-offset-4 hover:text-accent hover:underline">
          Privacy
        </a>
        <span aria-hidden>•</span>
        <a href="/legal/terms" className="underline-offset-4 hover:text-accent hover:underline">
          Terms
        </a>
      </div>
      <p className="text-center text-muted">See the data. Find the pace.</p>
    </footer>
  );
}
