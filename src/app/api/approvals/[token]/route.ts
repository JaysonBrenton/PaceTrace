import { NextResponse } from "next/server";

import { prisma } from "@/server/prisma";
import { sendUserApproved, sendUserDenied } from "@/server/mailer";

function htmlResponse(body: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>PaceTrace Approvals</title></head><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;padding:32px;max-width:480px;margin:0 auto;line-height:1.6;">${body}</body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function resolveDecisionIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return (request as unknown as { ip?: string | null }).ip ?? "unknown";
}

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const { token } = params;

  if (!token) {
    return htmlResponse("<h1>Invalid request</h1><p>Missing approval token.</p>", 400);
  }

  const approvalToken = await prisma.approvalToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!approvalToken) {
    return htmlResponse("<h1>Invalid token</h1><p>This approval link is no longer valid.</p>", 404);
  }

  if (approvalToken.expiresAt.getTime() < Date.now()) {
    return htmlResponse("<h1>Expired link</h1><p>This approval link has expired.</p>", 410);
  }

  const approvalRequest = await prisma.approvalRequest.findUnique({
    where: { userId: approvalToken.userId },
  });

  if (!approvalRequest) {
    return htmlResponse("<h1>Missing request</h1><p>The approval request could not be found.</p>", 404);
  }

  if (approvalRequest.decision) {
    const label = approvalRequest.decision === "APPROVE" ? "approved" : "denied";
    return htmlResponse(`<h1>Already ${label}</h1><p>This request was already ${label}.</p>`);
  }

  const decisionIp = resolveDecisionIp(request);

  try {
    if (approvalToken.action === "APPROVE") {
      const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: approvalToken.userId },
          data: { status: "ACTIVE" },
        });

        await tx.approvalRequest.update({
          where: { userId: approvalToken.userId },
          data: {
            decision: "APPROVE",
            decidedAt: new Date(),
            decidedBy: decisionIp,
          },
        });

        await tx.approvalToken.deleteMany({ where: { userId: approvalToken.userId } });

        return updatedUser;
      });

      try {
        await sendUserApproved(result);
      } catch (error) {
        console.error("[approvals] Failed to notify approved user", error);
      }

      return htmlResponse("<h1>Approved</h1><p>The requester has been notified they can sign in.</p>");
    }

    if (approvalToken.action === "DENY") {
      const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: approvalToken.userId },
          data: { status: "REJECTED" },
        });

        await tx.approvalRequest.update({
          where: { userId: approvalToken.userId },
          data: {
            decision: "DENY",
            decidedAt: new Date(),
            decidedBy: decisionIp,
          },
        });

        await tx.approvalToken.deleteMany({ where: { userId: approvalToken.userId } });

        return updatedUser;
      });

      try {
        await sendUserDenied(result);
      } catch (error) {
        console.error("[approvals] Failed to notify denied user", error);
      }

      return htmlResponse("<h1>Denied</h1><p>The requester has been notified of the decision.</p>");
    }

    return htmlResponse("<h1>Unknown action</h1><p>This token could not be processed.</p>", 400);
  } catch (error) {
    console.error("[approvals] Failed to process token", error);
    return htmlResponse("<h1>Server error</h1><p>We couldn't record this decision. Try again.</p>", 500);
  }
}
