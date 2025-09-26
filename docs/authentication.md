# Authentication UI Contract

PaceTrace now ships a single production implementation while keeping the wireframes and reference stories in documentation for future Storybook reintroduction:

- **Production** – `src/app/login` (and related components under `src/app/(auth)` when introduced). This is the systemd-served experience at `/login`.
- **Reference spec** – `docs/wireframes/auth` and the archived Storybook notes in `PaceTrace — Auth Wireframes → Mid-fi + Storybook Chromatic.md` capture the approved states.

## Quick reference

| Requirement | Source of truth | How to verify |
| --- | --- | --- |
| Token palette must drive all colors. | `src/styles/tokens.css`, imported by `src/app/globals.css`. | Inspect the token definitions and ensure components consume Tailwind semantic utilities or `var(--color-*)` references. |
| Auth components stay in sync with approved flows. | `src/components/auth/*` and `src/app/(auth)` routes. | Compare against `docs/wireframes/auth` screens and the mid-fi spec PDF. |
| UI states (default, loading, error, provider, success) remain visually reviewed. | Documented states in `PaceTrace — Auth Wireframes → Mid-fi + Storybook Chromatic.md`. | Manual QA or future Storybook stories must cover each state before release. |
| Copy and footer links remain canonical. | `docs/wireframes/auth/README.md`. | Verify page content against the wireframe before promoting updates. |

## Tokens

- The palette lives in `src/styles/tokens.css` and is consumed through Tailwind utility classes or CSS variables (`var(--color-*)`).
- Root-level global styles (`src/app/globals.css`) re-export these variables so production pages stay consistent.
- Component code must reference tokens (raw hex values are linted against) to preserve consistency across login, register, and password reset flows.

## Theme reference

- When Storybook returns, reintroduce a **Theme/Reference → Tokens** story that renders each token alongside descriptive copy to give reviewers immediate context.

## Auth story surfaces

- Auth flows should be documented with stories under `Auth/` (Login, Register, Forgot) when Storybook is reintroduced. Each must cover default, loading, error, provider in progress, and success states.
- Chromatic (or an equivalent visual regression suite) must gate merges once Storybook returns. Until then, reference the wireframes and capture manual QA evidence in review notes.

## Account approvals

- Registration creates a `User` record in a **pending** state and stores the Argon2id hash of the password.
- Every registration opens an `ApprovalRequest` and issues paired approval and denial tokens that expire after `APPROVAL_TOKEN_TTL_HOURS` (default 48h).
- Administrators receive an email with Approve and Deny buttons (`/api/approvals/[token]`). Approver recipients can be managed through the `ApprovalRecipient` table (or via `APPROVAL_ADMIN_EMAILS`), and default to `jaysoncareybrenton@gmail.com` if no configuration exists. Links also log to the server when SMTP delivery fails.
- Approving the request sets the user to **ACTIVE**, records the admin IP address and timestamp, cleans up outstanding tokens, and emails the requester.
- Denying the request marks the user **REJECTED**, records metadata, removes tokens, and notifies the requester.
- NextAuth blocks sign-in for any account whose status is not **ACTIVE**, returning an `Account pending approval` error.

### Approval workflow status

- The `/api/register` endpoint persists new users as **PENDING**, opens an `ApprovalRequest`, and issues paired approve/deny tokens stored in `ApprovalToken`. Email delivery falls back to console logging if SMTP is unavailable. The approval endpoint (`/api/approvals/[token]`) updates the user status, records the decision, and informs the requester.
- Audit data currently covers timestamps, decision outcomes, and the approver IP (captured inside the approval endpoint). Supporting document capture and richer approver notes are not yet implemented.

### Next steps for operational readiness

- Build an administrative surface (UI or CLI) to manage entries in `ApprovalRecipient`, ensuring business owners can align routing rules with policy changes without direct database access. This aligns with Salesforce's approval-process guidance around “Identify Approvers” and “Define Steps and Actions.”
- Extend logging to include structured audit events (e.g., who initiated the decision, attached documents) so the full approval trail is queryable, mirroring the audit recommendations from Salesforce's approval framework.
- Add SLA tracking/notifications (e.g., reminders when requests remain pending beyond the TTL) to maintain timely processing and security posture.
- Reference: [Salesforce — What are approvals?](https://help.salesforce.com/s/articleView?id=platform.what_are_approvals.htm&type=5)
