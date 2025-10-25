/**
 * 📁 Everwish – Video Index Generator (ESM Adaptado)
 * ------------------------------------------------------------
 * ✅ Soporta nombres con "+" y "_"
 * ✅ Compatible con Vercel y Next.js 13+
 * ✅ Genera /public/videos/index.json y /public/index.json
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const videosDir = path.join(publicDir, "videos");
const outputFile = path.join(videosDir, "index.json");
const backupFile = path.join(publicDir, "index.json");

// 🧹 Limpieza
function clean(str) {
  return str
    ? str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-+]/g, "")
    : "";
}

// 🧠 Interpretar nombres tipo "dog+pets-animal-lovers_thanksgiving_general_1A.mp4"
function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const [objectAndCategory, subcategoryPart, variantPart] = name.split("_");

  // Ejemplo: "dog+pets-animal-lovers"
  const [objectPart, categoryPart] = (objectAndCategory || "").split("+");
  const object = clean(objectPart || "unknown");
  const rawCategory = clean(categoryPart || "general");
  const subcategory = clean(subcategoryPart || "general");
  const variant = clean(variantPart || "");

  // Categoría legible
  const readableCategory =
    rawCategory.includes("family")
      ? "Family & Relationships"
      : rawCategory.includes("pets") || rawCategory.includes("animal")
      ? "Pets & Animal Lovers"
      : rawCategory.includes("seasonal") ||
        subcategory.includes("halloween") ||
        subcategory.includes("christmas") ||
        subcategory.includes("thanksgiving")
      ? "Seasonal & Holidays"
      : "Everyday";

  const slug = name;
  const tags = [object, rawCategory, subcategory, variant].filter(Boolean);

  return {
    object: object.charAt(0).toUpperCase() + object.slice(1),
    file: `/videos/${filename}`,
    slug,
    category: readableCategory,
    subcategory: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    variant,
    tags,
  };
}

// 🏗️ Generar el index.json
function generateIndex() {
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => [".mp4", ".webm", ".mov"].some((ext) => f.endsWith(ext)));

  const videos = files.map(parseFilename);

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  fs.writeFileSync(backupFile, JSON.stringify(videos, null, 2));

  console.log(`✅ index.json generado con ${videos.length} archivos.`);
  console.log(`📦 Guardado en /public/videos/index.json y /public/index.json`);
  console.log(videos.map((v) => `🎬 ${v.file} (${v.category})`).join("\n"));
}

generateIndex();
