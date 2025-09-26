export function Divider() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span>— or continue with —</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
