# PaceTrace

PaceTrace is a multi-tenant telemetry and coaching platform for RC racing teams. This repository currently contains two cooperating Next.js workspaces:

1. **Production app (repo root)** – ships the marketing shell and `/login` experience that systemd deploys today.
2. **`web/` workspace** – houses the design system, Storybook, Chromatic automation, and mid-fi authentication flows that backstop the production implementation.

## Getting started

Install dependencies (already installed in this workspace) and run the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the marketing shell and navigate to `/login` for the authentication experience.

The `web/` workspace can be developed independently for Storybook and Chromatic snapshots:

```bash
cd web
npm install
npm run dev    # Storybook and Next dev scripts are defined locally
```

### Resolving 500 errors from `/api/register`

If the registration form responds with a 500 status and the UI shows "We couldn't process that request," Prisma is failing to connect to the database. Populate the environment variables before retrying:

1. Copy `.env.example` to `.env.local` (or the environment file used in your deployment) and provide a valid Postgres connection string for `DATABASE_URL`.
2. Make sure the referenced database exists and is reachable from the app container or host.
3. Apply the migrations so Prisma can create the required tables:

   ```bash
   npx prisma migrate deploy --schema web/prisma/schema.prisma
   ```

4. Restart the Next.js server so the updated environment variables are loaded.

Prisma reads `DATABASE_URL` from the environment when instantiating `PrismaClient`, so missing or incorrect values prevent the `/api/register` transaction from reaching Postgres.

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

The `web/` workspace mirrors these commands and also exposes `npm run storybook` and `npm run chromatic` for visual regression testing.

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

```text
web/
  src/app/(auth)/...      # Mid-fi auth implementations kept in sync with Storybook
  src/components/auth/    # Token-driven building blocks (buttons, inputs, providers)
  src/styles/tokens.css   # Source of truth for shared CSS variables
  src/stories/auth/       # Storybook states exercised by Chromatic
```

> The root app consumes the same token palette via `src/app/globals.css` and currently implements the login surface in `src/app/login`. Keep the directories in sync with the Storybook workspace when promoting changes.

## Observability hooks

Structured logging and telemetry helpers live in `src/lib/logging.ts` and `src/lib/telemetry.ts`. The authentication flow, protected layouts, and dashboard surfaces publish events so backend services can ingest them as the platform matures.

## Visual workflow

- **Design tokens** – maintained in `web/src/styles/tokens.css` and surfaced locally through Tailwind utility classes.
- **Storybook** – run `npm run storybook` inside `web/` to review the `Auth/*` stories, including loading, error, provider, and success states.
- **Chromatic** – CI blocks merges on unexpected visual diffs for the auth surfaces; link the review in pull requests per the template.
