import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    return NextResponse.json({
      ok: true,
      total: json.videos?.length || 0,
      videos: json.videos || [],
    });
  } catch (error) {
    console.error("❌ Error interno en /api/cardsdata:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
