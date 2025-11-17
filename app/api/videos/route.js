import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  try {
    // Ruta al index ya generado
    const indexFile = path.join(process.cwd(), "public/videos/index.json");

    if (!fs.existsSync(indexFile)) {
      return NextResponse.json(
        { error: "Index file missing", videos: [] },
        { status: 404 }
      );
    }

    // Leer el index.json
    const rawData = fs.readFileSync(indexFile, "utf8");
    const indexData = JSON.parse(rawData);

    // Devolver videos tal como fueron generados
    return NextResponse.json(
      { videos: indexData.videos },
      { headers: { "Cache-Control": "no-store" } }
    );

  } catch (err) {
    console.error("❌ Error in /api/videos:", err);
    return NextResponse.json(
      { error: err.message, videos: [] },
      { status: 500 }
    );
  }
}
