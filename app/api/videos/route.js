// ✅ app/api/videos/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "videos_index.json");

    if (!fs.existsSync(filePath)) {
      console.error("❌ No se encontró videos_index.json");
      return new NextResponse(
        JSON.stringify({ error: "Archivo no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Leer y parsear JSON
    const data = fs.readFileSync(filePath, "utf-8");
    const videos = JSON.parse(data);

    // Responder como JSON estándar
    return new NextResponse(JSON.stringify(videos), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error cargando videos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al cargar videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
