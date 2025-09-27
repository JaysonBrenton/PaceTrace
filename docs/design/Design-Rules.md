# Design Rules

1. **No hard-coded colours.** Use semantic Tailwind classes (e.g., `bg-bg`, `text-fg-muted`, `border-border`) or CSS variables defined in `src/styles/tokens.css`. Literal hex/rgb/hsl values will fail linting.
2. **Use primitives first.** Pages and flows should be composed with the primitives in `src/components/ui/` (`Page`, `PageHeader`, `Card`, `FormField`, `Button`, `Input`, `Select`, `Label`, `Muted`). Extend them via props instead of reimplementing base styles.
3. **Page layout contract.** New top-level routes must render with `<Page>` and include a `<PageHeader>` and a token-backed container (usually `<Card>`) for primary content. This keeps typography, spacing, and elevation consistent across dark/light themes.
