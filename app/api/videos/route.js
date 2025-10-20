// ✅ Usa Node.js runtime (no edge)
export const runtime = "nodejs";

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📁 Ruta absoluta a la carpeta de videos
    const videosDir = path.join(process.cwd(), "public", "videos");

    // Verifica que la carpeta existe
    if (!fs.existsSync(videosDir)) {
      return new Response(
        JSON.stringify({ error: "Videos directory not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 📂 Leer todos los archivos .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 🧩 Crear objetos de video
    const videos = files.map((file) => {
      const name = file.replace(".mp4", "");
      const parts = name.split("_");
      const title = parts.map(
        (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
      ).join(" ");
      const categories = parts.slice(1, -1).map((p) => p.toLowerCase());

      return {
        title,
        src: `/videos/${file}`,
        slug: name,
        categories,
      };
    });

    // ✅ Respuesta exitosa
    return new Response(JSON.stringify({ all: videos }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error loading videos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load videos." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
      }
