export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    return NextResponse.json({
      ok: true,
      total: data.videos?.length || 0,
      videos: data.videos || [],
    });
  } catch (error) {
    console.error("❌ Error interno en /api/cardsdata:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
