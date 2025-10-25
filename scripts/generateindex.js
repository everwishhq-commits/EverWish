/**
 * 📁 Everwish – Video Index Generator (Vercel Permanent Fix)
 * ------------------------------------------------------------
 * ✅ Lee todos los .mp4 de /public/videos/
 * ✅ Genera /public/videos/index.json y /public/index.json
 * ✅ Compatible con nombres con "+" o "_"
 * ✅ 100% compatible con "type": "module" o sin él
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");
const outputFile = path.join(videosDir, "index.json");
const backupFile = path.join(__dirname, "../public/index.json");

function clean(str) {
  return str ? str.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9+._-]/g, "") : "";
}

function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split(/[+_]/).filter(Boolean);
  const object = parts[0] || "unknown";
  const categories = parts.slice(1, -1);
  const variant = parts[parts.length - 1] || "";
  return { object, categories, variant };
}

function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    console.error("❌ No se encontró la carpeta /public/videos/");
    return;
  }

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => /\.(mp4|webm|mov)$/i.test(f));

  if (files.length === 0) {
    console.warn("⚠️ No hay videos en /public/videos/");
  }

  const videos = files.map((file) => {
    const { object, categories, variant } = parseFilename(file);
    return {
      title: `${object} ${categories.join(" ")}`.trim(),
      src: `/videos/${file}`,
      slug: file.replace(/\.[^/.]+$/, ""),
      category:
        categories.length > 0
          ? categories.join(" ").replace(/\+/g, " ")
          : "General",
      variant,
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  fs.writeFileSync(backupFile, JSON.stringify(videos, null, 2));

  console.log(`✅ index.json generado correctamente con ${videos.length} archivos.`);
  console.log(`📂 Ruta: ${outputFile}`);
}

generateIndex();
