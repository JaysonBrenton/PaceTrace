# ADR-20240719: Account approvals

## Status
Accepted

## Context
Stakeholder feedback highlighted the need to gate new workspaces until an administrator reviews each request. The existing register form only validated inputs and immediately redirected users without persistence or notifications.

## Decision
We introduced a Prisma/Postgres data model that records users, approval requests, and approval tokens. Registrations create pending users, approval requests, and paired approve/deny tokens whose URLs are emailed to administrators. Approving activates the account and informs the requester; denying marks it rejected and sends a denial email. NextAuth now blocks sign-in until a user is active.

## Consequences
- Administrators manage approver recipients via the `ApprovalRecipient` table (or by setting `APPROVAL_ADMIN_EMAILS`) alongside SMTP credentials in the environment.
- The approval email contains fallback logging when SMTP delivery fails, providing manual URLs.
- Pending users will see “Account pending approval” if they attempt to sign in prematurely.
