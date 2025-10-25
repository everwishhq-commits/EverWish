/**
 * 📁 Everwish – Video Index Generator (v3.3 Vercel Persistent)
 * ------------------------------------------------------------
 * ✅ Lee todos los videos en /public/videos/
 * ✅ Genera y copia el index.json dentro de .next/static/videos/
 * ✅ Compatible con 17 categorías oficiales y múltiples (+)
 * ✅ 100% visible en producción (no más 404 en Vercel)
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const videosDir = path.join(publicDir, "videos");
const localOutput = path.join(videosDir, "index.json");
const staticDir = path.join(__dirname, "../.next/static/videos");
const staticOutput = path.join(staticDir, "index.json");

// 🧹 Limpieza
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

// 🧠 Interpretar nombres
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

  // Guardar index en /public/videos (local)
  fs.writeFileSync(localOutput, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);

  // Crear .next/static/videos/ y copiar allí (Vercel build persistente)
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(staticOutput, JSON.stringify(videos, null, 2));
  console.log("📦 index.json copiado dentro de .next/static/videos/ (persistente)");
}

generateIndex();
