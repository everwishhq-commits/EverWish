import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📍Ruta absoluta del JSON
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // 📂 Validar existencia
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ videos: [], error: "index.json not found" });
    }

    // 📖 Leer archivo
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // 📦 Aceptar ambos formatos: {videos: [...]} o [...]
    const videos = Array.isArray(data) ? data : data.videos || [];

    // ✅ Respuesta segura
    return NextResponse.json({ videos });
  } catch (err) {
    console.error("❌ Error en /api/videos:", err);
    return NextResponse.json(
      {
        error: "Error loading videos",
        details: String(err),
        videos: [],
      },
      { status: 200 }
    );
  }
}
