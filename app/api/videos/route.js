// app/api/videos/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "videos_index.json");

    if (!fs.existsSync(filePath)) {
      console.error("❌ No se encontró videos_index.json");
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    // Leer y parsear el JSON
    const data = fs.readFileSync(filePath, "utf-8");
    const videos = JSON.parse(data);

    return NextResponse.json(videos);
  } catch (error) {
    console.error("❌ Error cargando videos:", error);
    return NextResponse.json({ error: "Error al cargar videos" }, { status: 500 });
  }
}
