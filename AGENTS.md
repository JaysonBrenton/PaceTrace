# PaceTrace Agent Instructions

## Scope
These instructions apply to the entire repository unless a subdirectory defines its own `AGENTS.md` (none exist yet).

## Up-front context you must read
- Skim `README.md` to understand the single-root Next.js runtime and consolidated deployment flow.
- Review the guardrail documents in `docs/`, especially:
  - `docs/ENV_OPS_GUARDRAILS.md` for deployment, systemd, and environment constraints.
  - `docs/react-antipatterns.md` for component structure guidance and acceptable exceptions.
  - `docs/authentication.md` and `PaceTrace — Auth Wireframes → Mid-fi + Storybook Chromatic.md` for authentication flows, token sources, and story mappings.

## Implementation guardrails
- Treat the root project as the only production build target. Do **not** move it into `web/` or alter the systemd/service expectations unless a task explicitly titled “Monorepo move to web/” instructs you to do so.
- Preserve the deployment script (`scripts/deploy.sh`) and the systemd command shape documented in `docs/ENV_OPS_GUARDRAILS.md`.
- Styling changes must stay within Tailwind and the shared semantic token palette. Do not introduce alternative styling runtimes (e.g., Emotion) or bypass the tokens maintained in `src/styles/tokens.css`.
- Keep the root `src/app/(auth)` implementation aligned with the flows documented in `docs/authentication.md` and the wireframes. Storybook can return later, but production remains authoritative.
- Follow the grouped recommendations in `docs/react-antipatterns.md` for component patterns, state management, and async flows. If you must violate a rule, document the rationale in-code and in the pull request.

## Testing expectations
- When you modify the root Next.js app or shared utilities, run `npm run lint` from the repository root.
- The production smoke-test sequence listed at the bottom of `docs/ENV_OPS_GUARDRAILS.md` depends on the target server tooling. Only execute those commands when the task grants access; otherwise, note the limitation.

## Documentation updates
- When code changes invalidate the quick-reference tables or guardrails, update the corresponding Markdown files in `docs/` so the automation guidance stays accurate.

