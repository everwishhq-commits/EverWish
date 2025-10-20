// scripts/generate_videos_index.js
import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const outputFile = path.join(process.cwd(), "public/videos_index.json");

function generateIndex() {
  try {
    // Buscar todos los archivos MP4 en /public/videos
    const files = fs
      .readdirSync(videosDir)
      .filter((f) => f.toLowerCase().endsWith(".mp4"))
      .sort((a, b) => a.localeCompare(b)); // orden alfabético

    // Guardar lista como JSON
    fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

    console.log(`✅ videos_index.json actualizado con ${files.length} archivos.`);
  } catch (err) {
    console.error("❌ Error generando videos_index.json:", err);
  }
}

generateIndex();
