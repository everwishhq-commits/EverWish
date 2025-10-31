export const dynamic = "force-dynamic"; // 🚫 Evita prerendering en Vercel

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Ruta al archivo público
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // ⚠️ Verificar existencia
    if (!fs.existsSync(filePath)) {
      console.error("⚠️ Archivo no encontrado:", filePath);
      return NextResponse.json(
        { videos: [], error: "index.json not found" },
        { status: 200 }
      );
    }

    // 📖 Leer y parsear contenido
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    // 🎞️ Normalizar formato
    const videos = Array.isArray(data) ? data : data.videos || [];

    console.log("✅ /api/videos cargó correctamente:", videos.length, "videos");

    // 📤 Respuesta correcta
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    // ❌ Captura de error sin romper build
    console.error("❌ Error en /api/videos:", error);
    return NextResponse.json(
      {
        videos: [],
        error: "Error reading JSON file",
        details: error.message,
      },
      { status: 200 }
    );
  }
}
