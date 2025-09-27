# ADR-20250927 — Design tokens and theme system

## Status
Accepted

## Context
PaceTrace's marketing and authentication surfaces relied on ad-hoc Tailwind color names, arbitrary class values, and duplicated auth primitives. That made contrast hard to guarantee and created regressions such as washed-out register copy. We also need to support Chromatic audits and future light/dark theming without rewriting components.

## Decision
- Introduced a `tokens.css` file that defines semantic CSS variables (color, spacing, radius, elevation) for the initial `data-theme="midnight"` palette based on Radix Slate/Violet/Green/Amber/Red scales. All variables use RGB triplets so Tailwind can compose opacity.
- Updated `tailwind.config.ts` to map token variables to semantic color names (e.g., `bg`, `surface`, `fg-muted`), spacing, radii, shadows, and letter-spacing utilities. Backwards-compatible aliases remain for existing components, while new primitives use the semantic names exclusively.
- Added a set of locked UI primitives in `src/components/ui/` (`Page`, `PageHeader`, `Card`, `FormField`, `Button`, `Input`, `Select`, `Label`, `Muted`, `ThemeAudit`) that consume only token-driven classes.
- Refactored the `/login` and `/register` flows to use the primitives so both screens share layout, typography, and contrast.
- Added lint guardrails: ESLint now blocks literal hex/rgb/hsl values and arbitrary Tailwind color classes, while Stylelint requires tokens for color-related declarations.
- Created a Storybook `ThemeAudit` story and a `/styleguide` route to snapshot the theme and validate WCAG contrast.

## Consequences
- All new UI work must be built on top of the primitives and semantic Tailwind tokens; hard-coded colors fail linting.
- Existing screens continue to function via compatibility aliases, but migrations should replace legacy classes over time to remove the overrides in the Tailwind eslint rule.
- Adding a future theme is now limited to supplying another `[data-theme="…"]` block in `tokens.css`; component code remains unchanged.
- Lint-staged now runs ESLint and Stylelint on staged files, ensuring violations are caught before merge.
