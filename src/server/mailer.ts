import nodemailer from "nodemailer";

import { prisma } from "@/server/prisma";

interface MailerUser {
  email: string;
  name?: string | null;
}

function resolveEmailFrom() {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }

  return from;
}

const DEFAULT_APPROVER_EMAIL = "jaysoncareybrenton@gmail.com";

function normalizeEmailKey(email: string) {
  return email.trim().toLowerCase();
}

async function resolveAdminRecipients(): Promise<string[]> {
  const unique = new Map<string, string>();

  const register = (email: string | null | undefined) => {
    if (!email) {
      return;
    }

    const trimmed = email.trim();

    if (!trimmed) {
      return;
    }

    const key = normalizeEmailKey(trimmed);

    if (!unique.has(key)) {
      unique.set(key, trimmed);
    }
  };

  const dbRecipients = await prisma.approvalRecipient.findMany({
    select: { email: true },
  });

  for (const recipient of dbRecipients) {
    register(recipient.email);
  }

  const envRecipients = (process.env.APPROVAL_ADMIN_EMAILS ?? "").split(",");

  for (const recipient of envRecipients) {
    register(recipient);
  }

  if (unique.size === 0) {
    console.warn(
      `[mailer] No admin recipients configured for approval workflow; falling back to ${DEFAULT_APPROVER_EMAIL}`,
    );
    register(DEFAULT_APPROVER_EMAIL);
  }

  return Array.from(unique.values());
}

function isConsoleFallback() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;

  return host === "127.0.0.1" && !user;
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host) {
    throw new Error("SMTP_HOST is not configured");
  }

  if (!port) {
    throw new Error("SMTP_PORT is not configured");
  }

  if (!user || !password) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
}

async function deliverMail(message: nodemailer.SendMailOptions) {
  const finalMessage = {
    ...message,
    from: resolveEmailFrom(),
  } satisfies nodemailer.SendMailOptions;

  if (isConsoleFallback()) {
    console.log("[mailer:fallback]", finalMessage);
    return;
  }

  const transporter = createTransport();

  await transporter.sendMail(finalMessage);
}

export async function sendAdminApprovalRequest(user: MailerUser, approveUrl: string, denyUrl: string) {
  const recipients = await resolveAdminRecipients();

  const name = user.name ? `${user.name} <${user.email}>` : user.email;
  const subject = `New PaceTrace account request: ${name}`;

  const html = `
    <p>${name} requested access to PaceTrace.</p>
    <p>
      <a href="${approveUrl}" style="display:inline-block;padding:8px 16px;margin-right:8px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Approve</a>
      <a href="${denyUrl}" style="display:inline-block;padding:8px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Deny</a>
    </p>
    <p>If the buttons do not work, copy and paste these URLs:</p>
    <p>Approve: <a href="${approveUrl}">${approveUrl}</a></p>
    <p>Deny: <a href="${denyUrl}">${denyUrl}</a></p>
  `;

  await deliverMail({
    to: recipients,
    subject,
    html,
  });
}

export async function sendUserApproved(user: MailerUser) {
  const baseUrl = process.env.APP_BASE_URL ?? "";
  const loginUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/login` : "https://pacetrace.app/login";

  const html = `
    <p>You're cleared for the grid.</p>
    <p>Your PaceTrace account has been approved. You can sign in at <a href="${loginUrl}">${loginUrl}</a>.</p>
  `;

  await deliverMail({
    to: user.email,
    subject: "PaceTrace access approved",
    html,
  });
}

export async function sendUserDenied(user: MailerUser) {
  const html = `
    <p>Thanks for your interest in PaceTrace.</p>
    <p>We weren't able to approve your account request at this time.</p>
  `;

  await deliverMail({
    to: user.email,
    subject: "PaceTrace access request",
    html,
  });
}
