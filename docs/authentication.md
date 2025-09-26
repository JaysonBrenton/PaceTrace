# Authentication UI Contract

PaceTrace ships two authentication implementations that stay in lockstep:

- **Production** – `src/app/login` (and related components under `src/app/(auth)` when introduced). This is the systemd-served experience at `/login`.
- **Reference workspace** – `web/src/app/(auth)` and its Storybook stories. This workspace provides the mid-fi spec, Chromatic baselines, and design token source of truth.

## Quick reference

| Requirement | Source of truth | How to verify |
| --- | --- | --- |
| Token palette must drive all colors. | `web/src/styles/tokens.css`, imported by both workspaces. | Run Storybook (`npm run storybook` in `web/`) and inspect **Theme/Reference → Tokens**; root app consumes tokens via `src/app/globals.css`. |
| Auth components stay synced between workspaces. | Components live in `web/src/components/auth/` and are mirrored in `src/app/login` (or future `src/app/(auth)` modules) as they graduate to production. | Storybook stories under `Auth/*` exercise each state; Chromatic diffs flag mismatches. |
| UI states (default, loading, error, provider, success) remain visually reviewed. | `web/src/stories/auth/**/*.stories.tsx`. | Chromatic status must be linked in the PR template and approved by `@pacetrace-design` and `@pacetrace-auth`. |
| Copy and footer links remain canonical. | `docs/wireframes/auth/README.md`. | Verify page content against the wireframe before promoting updates. |

## Tokens

- The palette lives in `web/src/styles/tokens.css` and is consumed through Tailwind utility classes or CSS variables (`var(--color-*)`).
- Root-level global styles (`src/app/globals.css`) re-export these variables so production pages stay consistent.
- Component code must reference tokens (raw hex values are linted against) to preserve consistency across login, register, and password reset flows.

## Theme reference

- Storybook ships with **Theme/Reference → Tokens**, a live swatch catalog that renders each token alongside copy describing its intent.
- Visual or accessibility updates to the palette should be demonstrated in this story to provide reviewers immediate context.

## Auth story surfaces

- Auth flows are captured as dedicated stories under `Auth/` (Login, Register, Forgot) with state coverage for default, loading, error, provider in progress, and success.
- These stories are the visual contract for Chromatic. Any UI adjustment must update the appropriate story and pass the Chromatic check before merge.
- Chromatic is configured to block pull requests on unexpected layout or visibility diffs. Approvals require both design and auth-owner sign-off per CODEOWNERS.

## Account approvals

- Registration creates a `User` record in a **pending** state and stores the Argon2id hash of the password.
- Every registration opens an `ApprovalRequest` and issues paired approval and denial tokens that expire after `APPROVAL_TOKEN_TTL_HOURS` (default 48h).
- Administrators receive an email with Approve and Deny buttons (`/api/approvals/[token]`). Links also log to the server when SMTP delivery fails.
- Approving the request sets the user to **ACTIVE**, records the admin IP address and timestamp, cleans up outstanding tokens, and emails the requester.
- Denying the request marks the user **REJECTED**, records metadata, removes tokens, and notifies the requester.
- NextAuth blocks sign-in for any account whose status is not **ACTIVE**, returning an `Account pending approval` error.
