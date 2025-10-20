// scripts/generate_videos_index.js
import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const outputFile = path.join(process.cwd(), "public/videos_index.json");

function generateIndex() {
  try {
    // ✅ Leer todos los archivos .mp4
    const files = fs
      .readdirSync(videosDir)
      .filter((f) => f.toLowerCase().endsWith(".mp4"))
      .sort((a, b) => a.localeCompare(b));

    // ✅ Generar datos completos por archivo
    const videos = files.map((file) => {
      const base = path.basename(file, ".mp4");
      const parts = base.split("_"); // ej: pumpkin_halloween_general_1A

      // Construir título legible
      const title = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

      return {
        title,
        src: `/videos/${file}`,
        slug: base,
        categories: parts.slice(1).map((p) => p.toLowerCase()),
      };
    });

    // ✅ Guardar archivo JSON con formato
    fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
    console.log(`✅ videos_index.json actualizado con ${videos.length} archivos.`);
  } catch (err) {
    console.error("❌ Error generando videos_index.json:", err);
  }
}

generateIndex();
