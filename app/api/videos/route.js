// app/api/videos/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📁 Ruta absoluta al archivo generado automáticamente
    const filePath = path.join(process.cwd(), "public", "videos_index.json");

    // 🧩 Validación
    if (!fs.existsSync(filePath)) {
      console.error("❌ No se encontró videos_index.json");
      return new NextResponse(
        JSON.stringify({ error: "Archivo no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 📖 Leer y parsear el JSON
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const videoFiles = JSON.parse(fileContent);

    // 🪄 Transformar nombres → estructura estándar
    const videos = videoFiles.map((fileName) => {
      const cleanName = fileName.replace(".mp4", "");
      const parts = cleanName.split("_");

      // Formato: nombre_categoria_subcategoria_1A.mp4
      const title = parts.join(" ").replace(/\b\w/g, (c) => c.toUpperCase());
      const slug = cleanName;
      const categories = parts.slice(1, -1); // ejemplo: ["halloween", "love"]

      return {
        title,
        slug,
        src: `/videos/${fileName}`,
        categories,
      };
    });

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
