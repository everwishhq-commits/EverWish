import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📄 Ruta al archivo index.json
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // 🧠 Leer archivo localmente
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    // ✅ Si tiene videos, devolverlos
    const videos = json.videos || [];

    return NextResponse.json({
      ok: true,
      total: videos.length,
      videos,
    });
  } catch (err) {
    console.error("❌ Error interno en /api/videos:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
