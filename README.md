# PaceTrace

PaceTrace is a multi-tenant telemetry and coaching platform for RC racing teams. This repository currently contains the front-end scaffolding for the Next.js application, including a marketing landing page and a focused sign-in experience.

## Getting started

Install dependencies (already installed in this workspace) and run the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the marketing shell and navigate to `/login` for the authentication experience.

## Available scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Starts the local dev server with hot reloading. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Runs the production build. |
| `npm run lint` | Lints the project with Next.js/ESLint defaults. |

## Project structure

```
src/
  app/
    layout.tsx      # Global font loading and metadata
    page.tsx        # Landing page scaffold
    login/page.tsx  # Sign-in screen
  app/globals.css   # Tailwind + design tokens
```

Tailwind is configured with semantic tokens (background, card, accent, etc.) to make it easy to extend the design system as authenticated surfaces come online. The login form includes analytics-friendly attributes so future telemetry hooks can be wired without redesigning the UI.

## Next steps

- Wire the sign-in form to your auth provider (Clerk, NextAuth, etc.).
- Build the authenticated dashboard routes under `src/app/(app)`.
- Layer in telemetry + logging plumbing as the backend stabilizes.
