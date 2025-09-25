Act as a senior front-end engineer. Implement the “PaceTrace — Auth Mid-fi (Desktop)” spec and wire Storybook + Chromatic. Do not paste secrets or credentials. Use small, reviewable diffs and keep code modular. No hardcoded hex colours in components—use CSS variables (design tokens).

# Context
- App name: **PaceTrace** (use this everywhere).
- Scope: **Desktop-only** auth views (Login, Register, Forgot Password) promoted from low-fi to **mid-fi**.
- Remove: Phone provider, “Handle (slug)” field, Terms & Privacy checkbox, Password strength meter.
- Keep copy:
  - Header: **“PaceTrace — the one-stop lap logic shop.”**
  - Register subtitle: **“Start your PaceTrace workspace.”**
  - Footer value prop: **“See the data. Find the pace.”** with links to **/legal/terms** and **/legal/privacy**.
- Social providers: **Google, Apple, Facebook**, stacked vertically, order as listed.
- Look & feel: **Blue & Mint** palette (from Hostinger’s “Blue and mint” scheme). Token values:
  - `--color-accent` = `#106EBE` (blue)
  - `--color-accent-2` = `#0FFCBE` (mint)
  - `--color-danger` = `#D92D20` (error)
  - Neutrals: `--color-bg`, `--color-fg`, `--color-muted`, `--color-border`
- Tech: Next.js, Tailwind, Storybook, Chromatic. Use accessible patterns (labels, aria, keyboard order).

## Workspace map

| Concern | Production path | Reference workspace path | Notes |
| --- | --- | --- | --- |
| Pages & layouts | `src/app/login/**` (and future `src/app/(auth)/**` folders) | `web/src/app/(auth)/**` | Stories in `web/` drive the UX; production mirrors approved changes. |
| Shared components | `src/app/login/components/**` (or `src/app/(auth)/components/**` when promoted) | `web/src/components/auth/**` | Move code from `web/` into root once Chromatic and review sign-off land. |
| Design tokens | `src/app/globals.css` | `web/src/styles/tokens.css` | Tokens originate in `web/` and are consumed globally in both workspaces. |
| Stories | — | `web/src/stories/auth/**` | Chromatic snapshots enforce visual parity. |

The quick-reference tables below replace the scattered reminders that previously repeated these paths in each section.

# Goals (do all)
1) **Design tokens & Tailwind wiring**
   - Create a global tokens file (e.g., `web/src/styles/tokens.css`) defining the CSS variables above.
   - Ensure Tailwind can reference tokens (map in `tailwind.config` or use `bg-[var(--color-…)]`, etc.).
   - Add a simple “Theme” reference story in Storybook that renders swatches for all tokens.
   - Rule: ban raw hex in components—only tokens.

2) **Auth components (desktop)**
   Build and maintain the components in `web/src/components/auth/` first, then promote to `src/app/login` (or the eventual `src/app/(auth)` slice) when stable:
   - `AuthHeader` (title + helper): uses header copy; links logo/title to `/`.
   - `AuthCard` (container: title, helper, content slot).
   - `TextInput` (label, input, inline error slot, proper `autocomplete`).
   - `PrimaryButton` (supports loading state).
   - `ProviderButton` (variants: google|apple|facebook; accessible names, stacked full-width).
   - `Divider` (“— or continue with —”).
   - `ErrorBanner` (global/network/unknown).
   - `AuthFooter` (© PaceTrace • Privacy • Terms • “See the data. Find the pace.”).
   Notes:
   - Card: max-width ~500px; centred; 32px padding; subtle 1px border + soft shadow.
   - Type scale: H1 ≈ 30px; helper 16px; label 13px; input/button 16px.
   - Spacing: base 16px; 24px between form groups; 12px inline.

3) **Mid-fi screen compositions (for Storybook)**
   Compose desktop screens (no routing changes needed for this task) under `web/src/stories/auth/` and mirror production in `src/app/login` (or `src/app/(auth)` once introduced):
   - **Login**: Email, Password, Remember me, Sign in, Divider, Providers (G/A/F), Create account link.
   - **Register**: Email, Display name, Password (rules hint only), Create account, Divider, Providers.
   - **Forgot Password**: Email + Send reset link; generic success state (no enumeration).

4) **States (stories must mirror these names)**
   Category: `Auth/`
   - `Auth/Login/Default`
   - `Auth/Login/Loading`
   - `Auth/Login/Error` (field-level password error)
   - `Auth/Login/ProviderInProgress` (args: provider = google|apple|facebook)
   - `Auth/Login/SuccessRedirect` (brief success note)
   - `Auth/Register/Default`
   - `Auth/Register/Loading`
   - `Auth/Register/Error`
   - `Auth/Register/ProviderInProgress`
   - `Auth/Register/Success`
   - `Auth/Forgot/Default`
   - `Auth/Forgot/Loading`
   - `Auth/Forgot/Sent`
   Add Storybook args/controls: `errorMessage?: string`, `isLoading?: boolean`, `provider?: 'google'|'apple'|'facebook'`.

   | Story ID | File | Production reference |
   | --- | --- | --- |
   | `Auth/Login/*` | `web/src/stories/auth/Login.stories.tsx` | `src/app/login/page.tsx` & `src/app/login/sign-in-form.tsx` |
   | `Auth/Register/*` | `web/src/stories/auth/Register.stories.tsx` | Mirrors upcoming `src/app/(auth)/register` promotion (spec in this doc). |
   | `Auth/Forgot/*` | `web/src/stories/auth/Forgot.stories.tsx` | Mirrors upcoming `src/app/(auth)/forgot-password` promotion (spec in this doc). |

5) **A11y**
   - Logical focus order: title → inputs → primary CTA → providers → links.
   - Provider buttons include accessible names (e.g., “Continue with Google”).
   - Inputs wired to labels; errors announced under their fields. Global errors use a landmark/banner.
   - Ensure colour contrast passes basic checks.

6) **Chromatic & visual baselines**
   - Add Chromatic to snapshot all Auth stories above.
   - Configure PR check so visual diffs must pass; intentional changes require review.
   - Threshold: strict for layout/visibility; allow minor anti-aliasing text differences.

7) **Governance**
   - Update `.github/pull_request_template.md`: When touching `src/app/login/**`, `src/app/(auth)/**`, **or** `web/src/app/(auth)/**`, link to the relevant Storybook stories and confirm “conforms” or “intentional deviation”.
   - Add `CODEOWNERS` so auth changes require review by the design/UX owner and the auth code owner across both workspaces.
   - Add a note in README or `docs/authentication.md` pointing to the shared token rules, Theme story, and Chromatic contract (see Quick Reference in that doc).

# Acceptance Criteria (must all pass)
- All tokens exist and components use tokens (no raw hex in component code).
- Providers stacked vertically: **Google, Apple, Facebook** only.
- Login/Register/Forgot have the states above, each with a Storybook story.
- Register subtitle: **“Start your PaceTrace workspace.”**
- Header and footer copy are exactly as specified; footer links to `/legal/terms` and `/legal/privacy`.
- Inline field errors appear under the field; network/unknown uses a global error banner.
- Chromatic runs on PRs and blocks merges on unexpected visual diffs.
- PR template + CODEOWNERS rules in place for auth changes.
- Basic a11y checks pass in Storybook (labels, names, focus order).

# Definition of Done
- Storybook starts cleanly and shows the Auth screens for all states.
- Chromatic baseline created; subsequent PR shows a passing Chromatic check.
- Tokens documented in a Theme story; no component contains raw hex.
- Changes are limited to the auth area, Storybook config, tokens, and governance files (template/CODEOWNERS).
- Commit messages are conventional and scoped (e.g., `feat(auth): add provider buttons (google/apple/facebook)`; `chore(storybook): add theme and chromatic`).

Proceed with these tasks now. If a minor detail is ambiguous, choose a sensible default that preserves the spec and desktop-only scope.

# Appendix — Wireframe Docs (Desktop-Only)

Create a repo artifact for quick reference:
- Path: docs/wireframes/auth/README.md
- Purpose: static “wireframe” spec in markdown that mirrors the Storybook states and mid-fi visuals.

Contents to include (match exactly):

## Shared Layout
- Centered card, max-width ~500px, 32px padding, subtle 1px border + soft shadow.
- Type: H1 ≈ 30px; helper 16px; label 13px; input/button 16px.
- Spacing: base 16px; 24px between form groups; 12px inline.
- Providers: stacked, full-width; order: Google, Apple, Facebook.
- Header: “PaceTrace — the one-stop lap logic shop.”
- Footer: © PaceTrace • Privacy • Terms • “See the data. Find the pace.”
- Palette (tokens): --color-accent #106EBE, --color-accent-2 #0FFCBE, --color-danger #D92D20; neutrals: --color-bg, --color-fg, --color-muted, --color-border.

## Login (Desktop) — ASCII layout
[ PaceTrace — the one-stop lap logic shop. ]

┌──────────────────────────────────────────────┐
│ Sign in │
│ Access your PaceTrace data. │
│ Email │
│ [ you@example.com
 ] │
│ Password (Forgot?) │
│ [ ••••••••••••••••••••••••••••••••••• ] │
│ [☐] Remember me │
│ [ Sign in ] │
│ ——— or continue with ——— │
│ [ Continue with Google ] │
│ [ Continue with Apple ] │
│ [ Continue with Facebook ] │
│ Need an account? Create one │
└──────────────────────────────────────────────┘

© PaceTrace • Privacy • Terms • See the data. Find the pace.


### States
- Default / Loading (button spinner; form & providers disabled)
- Error (field-level under the field; global banner for network/unknown)
- ProviderInProgress ("Connecting to Google/Apple/Facebook…")
- SuccessRedirect (brief success before navigating)

## Register (Desktop) — ASCII layout


[ PaceTrace — the one-stop lap logic shop. ]

┌──────────────────────────────────────────────┐
│ Create account │
│ Start your PaceTrace workspace. │
│ Email │
│ [ you@example.com
 ] │
│ Display name │
│ [  ] │
│ Password (Use at least 12 characters) │
│ [ ••••••••••••••••••••••••••••••••••• ] │
│ [ Create account ] │
│ ——— or ——— │
│ [ Continue with Google ] │
│ [ Continue with Apple ] │
│ [ Continue with Facebook ] │
│ Already have an account? Sign in │
└──────────────────────────────────────────────┘


### States
- Default / Loading / Error / ProviderInProgress / Success

## Forgot Password (Desktop) — ASCII layout


[ PaceTrace — the one-stop lap logic shop. ]

┌──────────────────────────────────────────────┐
│ Reset your password │
│ Enter your email and we’ll send a reset link│
│ Email │
│ [ you@example.com
 ] │
│ [ Send reset link ] │
│ Back to Sign in │
└──────────────────────────────────────────────┘


### States
- Default / Loading / Sent (generic “If an account exists…”; no enumeration)

## Acceptance Criteria (Docs ↔ Storybook parity)
- ASCII layouts match Storybook compositions.
- All listed states have corresponding stories in `Auth/*`.
- Copy is exact (header, helper, footer value prop).
- Providers: Google, Apple, Facebook only; stacked vertically.
- Errors: inline under field; global banner for network/unknown.
