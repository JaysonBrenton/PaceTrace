## Shared Layout
- Centered card on neutral background
- Card max width ≈500px with 32px padding
- Base spacing 16px, group spacing 24px, inline spacing 12px
- Providers stack vertically (Google, Apple, Facebook)

## Login Layout
```
[Header]
[Card Title]
[Email Input]
[Password Input]
[Remember Me + Forgot]
[Primary Button]
[Divider]
[Google]
[Apple]
[Facebook]
[Create Account Link]
[Footer]
```
States: Default, Loading, Error (password), ProviderInProgress, SuccessRedirect

## Register Layout
```
[Header]
[Card Title]
[Email Input]
[Display Name Input]
[Password Input + Hint]
[Primary Button]
[Divider]
[Google]
[Apple]
[Facebook]
[Sign In Link]
[Footer]
```
States: Default, Loading, Error, ProviderInProgress, Success

## Forgot Password Layout
```
[Header]
[Card Title]
[Email Input]
[Primary Button]
[Footer]
```
States: Default, Loading, Sent

## Palette Tokens
- --color-accent
- --color-accent-2
- --color-danger
- --color-bg
- --color-fg
- --color-muted
- --color-border

## Copy
- Header: "PaceTrace — the one-stop lap logic shop."
- Register subtitle: "Start your PaceTrace workspace."
- Footer value prop: "See the data. Find the pace."
