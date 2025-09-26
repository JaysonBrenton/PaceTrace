import { NextResponse } from "next/server";

import packageJson from "../../../../package.json" assert { type: "json" };

export async function GET() {
  const version = packageJson.version ?? "0.0.0";

  return NextResponse.json({ version });
}
