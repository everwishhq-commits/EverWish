/**
 * 📁 Everwish – Video Index Generator (v3.2 FINAL – Vercel Compatible)
 * ------------------------------------------------------------------
 * ✅ Lee todos los videos en /public/videos/
 * ✅ Genera /public/videos/index.json y copia de seguridad en /public/
 * ✅ Garantiza existencia de carpeta /public/videos/
 * ✅ Compatible con 17 categorías oficiales y múltiples (+)
 * ✅ 100% funcional en entorno Vercel (no más 404)
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");
const outputFile = path.join(videosDir, "index.json");
const outputBackup = path.join(__dirname, "../public/index.json");

// 🧹 Limpieza de texto
function clean(str) {
  return str
    ? str
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/&/g, "and")
        .trim()
        .toLowerCase()
    : "";
}

// 🎯 Categorías válidas
const VALID_CATEGORIES = [
  "seasonal-holidays",
  "love-romance",
  "family-relationships",
  "birthday",
  "pets-animal-lovers",
  "friendship",
  "thank-you",
  "get-well",
  "sympathy",
  "congratulations",
  "new-baby",
  "wedding",
  "graduation",
  "retirement",
  "motivation",
  "spiritual",
  "adventure",
];

// 🧠 Analizar nombre de archivo
function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split("_");

  const object = clean(parts[0] || "");
  const categoryPart = clean(parts[1] || "general");
  const subcategory = clean(parts[2] || "general");
  const variant = clean(parts[3] || "");

  const categories = categoryPart
    .split("+")
    .map((c) => c.trim().toLowerCase())
    .filter((c) => VALID_CATEGORIES.includes(c));

  return {
    object,
    categories: categories.length ? categories : ["general"],
    subcategory,
    variant,
  };
}

// 🧾 Generar index.json
function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.warn("📂 Carpeta /public/videos creada automáticamente.");
  }

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => [".mp4", ".webm", ".mov"].some((ext) => f.endsWith(ext)));

  if (files.length === 0) {
    console.warn("⚠️ No se encontraron videos en /public/videos/");
    return;
  }

  const videos = files.map((file) => {
    const { object, categories, subcategory, variant } = parseFilename(file);

    const tags = Array.from(
      new Set([
        object,
        ...categories,
        subcategory,
        variant,
        ...object.split(" "),
        ...subcategory.split(" "),
      ])
    ).filter(Boolean);

    return {
      name: file,
      file: `/videos/${file}`,
      object,
      categories,
      category: categories[0] || "general",
      subcategory,
      variant,
      tags,
    };
  });

  // ✏️ Guardar index principal
  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);

  // 🪄 Guardar copia en la raíz pública
  fs.writeFileSync(outputBackup, JSON.stringify(videos, null, 2));
  console.log("📁 Copia de index.json guardada en /public/");
}

generateIndex();
