/**
 * 📁 Everwish – Video Index Generator (Vercel ESM Final)
 * ------------------------------------------------------------
 * ✅ Funciona con "type": "module"
 * ✅ Compatible con Vercel, sin warnings
 * ✅ Genera /public/videos/index.json y /public/index.json
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");
const outputFile = path.join(videosDir, "index.json");
const backupFile = path.join(__dirname, "../public/index.json");

function clean(str) {
  return str
    ? str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : "";
}

function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split("_");
  const object = clean(parts[0] || "");
  const categoryPart = clean(parts[1] || "general");
  const subcategory = clean(parts[2] || "general");
  const variant = clean(parts[3] || "");
  const categories = categoryPart.split("+").filter(Boolean);
  return { object, categories, subcategory, variant };
}

function generateIndex() {
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => [".mp4", ".webm", ".mov"].some((ext) => f.endsWith(ext)));

  const videos = files.map((file) => {
    const { object, categories, subcategory, variant } = parseFilename(file);
    const tags = [object, ...categories, subcategory, variant].filter(Boolean);
    return {
      name: file,
      file: `/videos/${file}`,
      object,
      categories,
      subcategory,
      variant,
      tags,
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  fs.writeFileSync(backupFile, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);
}

generateIndex();
