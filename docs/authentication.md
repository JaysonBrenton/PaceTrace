# Authentication UI Contract

PaceTrace desktop authentication experiences are modeled in the `web` workspace. The surfaces are governed by design tokens, Storybook documentation, and Chromatic baselines.

## Tokens
- The palette lives in `web/src/styles/tokens.css` and is consumed through Tailwind utility classes or CSS variables (`var(--color-*)`).
- Component code must reference the tokens (raw hex values are linted against) to preserve consistency across login, register, and password reset flows.

## Theme Reference
- Storybook ships with **Theme/Reference → Tokens**, a live swatch catalog that renders each token alongside copy describing its intent.
- Visual or accessibility updates to the palette should be demonstrated in this story to provide reviewers immediate context.

## Auth Story Surfaces
- Auth flows are captured as dedicated stories under `Auth/` (Login, Register, Forgot) with state coverage for default, loading, error, provider in progress, and success.
- These stories are the visual contract for Chromatic. Any UI adjustment must update the appropriate story and pass the Chromatic check before merge.
- Chromatic is configured to block pull requests on unexpected layout or visibility diffs. Approvals require both design and auth-owner sign-off per CODEOWNERS.
