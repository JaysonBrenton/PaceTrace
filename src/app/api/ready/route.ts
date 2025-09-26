import { NextResponse } from "next/server";
import path from "node:path";
import { readdir } from "node:fs/promises";

import { prisma } from "@/server/prisma";

const REQUIRED_ENVS = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET", "EMAIL_FROM"] as const;

type ReadyResult =
  | { ok: true }
  | { ok: false; status: number; cause: Record<string, unknown> };

async function ensureRequiredEnv(): Promise<ReadyResult> {
  const missing = REQUIRED_ENVS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return {
      ok: false,
      status: 503,
      cause: {
        missingEnvs: missing,
      },
    };
  }

  return { ok: true };
}

async function ensureDatabaseReachable(): Promise<ReadyResult> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      cause: {
        database: "unreachable",
        detail: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

async function listMigrationFolders() {
  try {
    const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
    const entries = await readdir(migrationsDir, { withFileTypes: true });

    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    console.error("[ready] Failed to read migrations directory", error);
    return [] as string[];
  }
}

async function findPendingMigrations(): Promise<string[]> {
  const migrationFolders = await listMigrationFolders();

  if (migrationFolders.length === 0) {
    return [];
  }

  try {
    const applied = await prisma.$queryRaw<Array<{ migration_name: string | null }>>`
      SELECT "migration_name" FROM "_prisma_migrations"
    `;

    const appliedNames = new Set(
      applied
        .map((row) => row.migration_name)
        .filter((name): name is string => Boolean(name)),
    );

    return migrationFolders.filter((name) => !appliedNames.has(name));
  } catch (error) {
    console.error("[ready] Failed to inspect migrations table", error);
    return migrationFolders;
  }
}

export async function GET() {
  const envResult = await ensureRequiredEnv();

  if (!envResult.ok) {
    return NextResponse.json(envResult, { status: envResult.status });
  }

  const dbResult = await ensureDatabaseReachable();

  if (!dbResult.ok) {
    return NextResponse.json(dbResult, { status: dbResult.status });
  }

  const pendingMigrations = await findPendingMigrations();

  if (pendingMigrations.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        cause: {
          pendingMigrations,
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
