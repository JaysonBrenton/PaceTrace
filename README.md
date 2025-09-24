# PaceTrace

PaceTrace is a multi-tenant telemetry and coaching platform for RC racing teams. This repository currently contains the front-end scaffolding for the Next.js application, including a marketing landing page and a focused sign-in experience.

## Getting started

Install dependencies (already installed in this workspace) and run the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the marketing shell and navigate to `/login` for the authentication experience.

### Authentication

PaceTrace now ships with demo credentials wired through a NextAuth credentials provider. Sign in at `/login` with:

```
Email: driver@pacetrace.app
Password: pitlane
```

Override the defaults by setting `AUTH_DEMO_EMAIL` and `AUTH_DEMO_PASSWORD` in your environment. Provide a `NEXTAUTH_SECRET` when deploying to production.

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
    (app)/          # Authenticated routes and layout
    api/auth/       # NextAuth handler
    layout.tsx      # Global font loading and metadata
    login/          # Sign-in screen + client form logic
    page.tsx        # Landing page scaffold
  app/globals.css   # Tailwind + design tokens
```

Tailwind is configured with semantic tokens (background, card, accent, etc.) to make it easy to extend the design system as authenticated surfaces come online. The login form includes analytics-friendly attributes so future telemetry hooks can be wired without redesigning the UI.

## Observability hooks

Structured logging and telemetry helpers live in `src/lib/logging.ts` and `src/lib/telemetry.ts`. The authentication flow, protected layouts, and dashboard surfaces publish events so backend services can ingest them as the platform matures.
