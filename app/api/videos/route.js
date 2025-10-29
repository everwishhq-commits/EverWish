import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// 📂 Ruta correcta: ahora apunta a /public/videos
const VIDEOS_DIR = path.join(process.cwd(), "public/videos");

// 🧩 Función para generar metadatos básicos desde el nombre del archivo
function parseVideoName(filename) {
  // ejemplo: pumpkin_halloween_general_1A.mp4
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const parts = nameWithoutExt.split("_");

  // Construimos estructura base
  return {
    slug: nameWithoutExt,
    src: `/videos/${filename}`,
    mainName: parts[0] || "video",
    category: parts[1] || "general",
    theme: parts[2] || "",
    version: parts[3] || "",
  };
}

// 🧠 API Handler
export async function GET() {
  try {
    // ✅ lee carpeta
    const files = fs.readdirSync(VIDEOS_DIR);

    // filtra solo archivos .mp4 y similares
    const videos = files
      .filter((file) => file.toLowerCase().endsWith(".mp4"))
      .map((file) => parseVideoName(file));

    // ordena (opcional: por nombre alfabético)
    const sorted = videos.sort((a, b) => a.slug.localeCompare(b.slug));

    // devuelve respuesta
    return NextResponse.json({ videos: sorted });
  } catch (err) {
    console.error("❌ Error leyendo videos:", err);
    return NextResponse.json(
      { error: "Error loading videos", details: err.message },
      { status: 500 }
    );
  }
}
