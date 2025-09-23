Act as lead developer. Implement an email-based account approval flow in the **web/** Next.js app (web/src/app/*), using Prisma + Postgres + Nodemailer. Keep diffs small and modular.

Requirements
- Data model (web/prisma/schema.prisma):
  - enum UserStatus { PENDING, ACTIVE, REJECTED }
  - model User { id String @id @default(cuid()); email String @unique; name String?; passwordHash String?; status UserStatus @default(PENDING); createdAt DateTime @default(now()); updatedAt DateTime @updatedAt }
  - enum ApprovalAction { APPROVE, DENY }
  - model ApprovalRequest { id String @id @default(cuid()); userId String @unique; reason String?; createdAt DateTime @default(now()); decidedAt DateTime?; decision ApprovalAction?; decidedBy String?; user User @relation(fields: [userId], references: [id]) }
  - model ApprovalToken { id String @id @default(cuid()); userId String; token String @unique; action ApprovalAction; expiresAt DateTime; createdAt DateTime @default(now()); user User @relation(fields: [userId], references: [id]) }

- Packages & wiring (inside web/):
  - Add Prisma deps and generate the client in web/.
  - NextAuth in web/: add signIn callback (block non-ACTIVE with “Account pending approval”).
  - Put Prisma files under web/prisma and use the default location there.

- Registration API (web/src/app/api/register/route.ts): POST JSON { email, name, password }
  - Validate with zod
  - Create User(status=PENDING, Argon2id password hash)
  - Create ApprovalRequest + two ApprovalTokens (APPROVE/DENY), TTL = now() + APPROVAL_TOKEN_TTL_HOURS (default 48h from env)
  - Email admins (APPROVAL_ADMIN_EMAILS, CSV) with 2 buttons:
      Approve → GET /api/approvals/[token]   (APPROVE token)
      Deny    → GET /api/approvals/[token]   (DENY token)
    On SMTP failure, log full Approve/Deny URLs to server logs.
  - Return 200 { ok: true } and show “Thanks — pending approval.” (do not auto-login)

- Approvals API (web/src/app/api/approvals/[token]/route.ts): GET
  - Validate token/expiry
  - APPROVE → user.status=ACTIVE; ApprovalRequest.decision=APPROVE; decidedBy=req.ip; decidedAt=now(); delete all tokens; email requester “Approved — you can sign in now.”
  - DENY    → user.status=REJECTED; ApprovalRequest.decision=DENY; delete tokens; email requester “Sorry — request denied.”
  - Return tiny HTML page (“Approved” or “Denied”)

- Mailer util (web/src/server/mailer.ts):
  - Nodemailer using SMTP_* and EMAIL_FROM; console/log fallback when SMTP_HOST=127.0.0.1 and unauthenticated.
  - export sendAdminApprovalRequest(user, approveUrl, denyUrl), sendUserApproved(user), sendUserDenied(user)

- Registration UI (web/src/app/register/page.tsx):
  - POST to /api/register; on success show “pending approval” message.

- Docs:
  - Update docs/authentication.md with the approval flow (+ update .env.example)
  - ADR: docs/adr/ADR-<YYYYMMDD>-account-approvals.md (brief)

Deliverables
- web/prisma/schema.prisma + web/prisma/migrations/*
- Endpoints under web/src/app/api/register/route.ts and web/src/app/api/approvals/[token]/route.ts
- web/src/server/mailer.ts, NextAuth update, minimal UI tweak
- Updated docs and .env.example
