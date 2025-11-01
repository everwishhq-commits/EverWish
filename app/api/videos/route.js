import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // Leer el archivo JSON localmente
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    // Si tiene la propiedad "videos", la retornamos, si no, todo el objeto
    const videos = json.videos || json;

    return NextResponse.json({
      ok: true,
      total: videos.length || 0,
      videos,
    });
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}
