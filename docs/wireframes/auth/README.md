# PaceTrace Auth Wireframes

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
│ Sign in                                      │
│ Access your PaceTrace data.                  │
│ Email                                        │
│ [ you@example.com                           ] │
│ Password (Forgot?)                           │
│ [ ••••••••••••••••••••••••••••••••••••••••• ] │
│ [☐] Remember me                              │
│ [ Sign in ]                                  │
│ ——— or continue with ———                     │
│ [ Continue with Google ]                     │
│ [ Continue with Apple ]                      │
│ [ Continue with Facebook ]                   │
│ Need an account? Create one                  │
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
│ Create account                               │
│ Start your PaceTrace workspace.              │
│ Email                                        │
│ [ you@example.com                           ] │
│ Display name                                 │
│ [                                            ] │
│ Password (Use at least 12 characters)        │
│ [ ••••••••••••••••••••••••••••••••••••••••• ] │
│ [ Create account ]                           │
│ ——— or ———                                   │
│ [ Continue with Google ]                     │
│ [ Continue with Apple ]                      │
│ [ Continue with Facebook ]                   │
│ Already have an account? Sign in             │
└──────────────────────────────────────────────┘

### States
- Default / Loading / Error / ProviderInProgress / Success

## Forgot Password (Desktop) — ASCII layout
[ PaceTrace — the one-stop lap logic shop. ]

┌──────────────────────────────────────────────┐
│ Reset your password                          │
│ Enter your email and we’ll send a reset link │
│ Email                                        │
│ [ you@example.com                           ] │
│ [ Send reset link ]                          │
│ Back to Sign in                              │
└──────────────────────────────────────────────┘

### States
- Default / Loading / Sent (generic “If an account exists…”; no enumeration)

## Acceptance Criteria (Docs ↔ Storybook parity)
- ASCII layouts match Storybook compositions.
- All listed states have corresponding stories in `Auth/*`.
- Copy is exact (header, helper, footer value prop).
- Providers: Google, Apple, Facebook only; stacked vertically.
- Errors: inline under field; global banner for network/unknown.
