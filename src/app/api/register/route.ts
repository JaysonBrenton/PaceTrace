import { NextResponse } from "next/server";
import argon2 from "argon2";
import crypto from "node:crypto";
import { z } from "zod";

import { prisma } from "@/server/prisma";
import { sendAdminApprovalRequest } from "@/server/mailer";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

function resolveTokenTtlMs() {
  const raw = process.env.APPROVAL_TOKEN_TTL_HOURS;
  const fallback = 48;

  if (!raw) {
    return fallback * 60 * 60 * 1000;
  }

  const hours = Number(raw);

  if (!Number.isFinite(hours) || hours <= 0) {
    return fallback * 60 * 60 * 1000;
  }

  return hours * 60 * 60 * 1000;
}

function buildDecisionUrl(requestUrl: string, token: string) {
  const url = new URL(requestUrl);
  url.pathname = `/api/approvals/${token}`;
  url.search = "";

  return url.toString();
}

interface PrismaKnownError {
  code?: string;
  meta?: Record<string, unknown>;
}

function isUniqueConstraintError(error: unknown): error is PrismaKnownError {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as PrismaKnownError;

  return candidate.code === "P2002";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ ok: false, error: "invalidJson" }, { status: 400 });
  }

  const parseResult = registerSchema.safeParse(payload);

  if (!parseResult.success) {
    return NextResponse.json({ ok: false, error: "invalidInput" }, { status: 400 });
  }

  const { email, name, password } = parseResult.data;

  try {
    const { user, approveToken, denyToken } = await prisma.$transaction(async (tx) => {
      const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

      const createdUser = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          status: "PENDING",
        },
      });

      await tx.approvalRequest.create({
        data: {
          userId: createdUser.id,
        },
      });

      const expiresAt = new Date(Date.now() + resolveTokenTtlMs());

      const approveTokenValue = crypto.randomBytes(32).toString("hex");
      const denyTokenValue = crypto.randomBytes(32).toString("hex");

      const [approveTokenRecord, denyTokenRecord] = await Promise.all([
        tx.approvalToken.create({
          data: {
            userId: createdUser.id,
            token: approveTokenValue,
            action: "APPROVE",
            expiresAt,
          },
        }),
        tx.approvalToken.create({
          data: {
            userId: createdUser.id,
            token: denyTokenValue,
            action: "DENY",
            expiresAt,
          },
        }),
      ]);

      return {
        user: createdUser,
        approveToken: approveTokenRecord.token,
        denyToken: denyTokenRecord.token,
      };
    });

    const approveUrl = buildDecisionUrl(request.url, approveToken);
    const denyUrl = buildDecisionUrl(request.url, denyToken);

    try {
      await sendAdminApprovalRequest(user, approveUrl, denyUrl);
    } catch (error) {
      console.error("[register] Failed to send approval email", error);
      console.info("[register] Approve URL", approveUrl);
      console.info("[register] Deny URL", denyUrl);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: false, error: "emailInUse" }, { status: 409 });
    }

    console.error("[register] Failed to register user", error);

    return NextResponse.json({ ok: false, error: "serverError" }, { status: 500 });
  }
}
