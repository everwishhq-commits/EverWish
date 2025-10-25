/**
 * 📁 Everwish – Video Index Generator (v3.4 FINAL – 404 FIXED)
 * ------------------------------------------------------------
 * ✅ Lee todos los videos en /public/videos/
 * ✅ Genera /public/videos/index.json
 * ✅ Copia el archivo también a /.next/static/videos/ para Vercel
 * ✅ 100% visible desde /_next/static/videos/index.json
 * ✅ Compatible con múltiples categorías (+)
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const videosDir = path.join(publicDir, "videos");
const nextStaticDir = path.join(__dirname, "../.next/static/videos");

// 🧹 Limpieza
function clean(str) {
  return str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9+]+/g, "-")
        .replace(/--+/g, "-")
        .trim()
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
      new Set([object, ...categories, subcategory, variant].filter(Boolean))
    );

    return {
      name: file,
      file: `/videos/${file}`,
      object,
      category: categories[0],
      subcategory,
      variant,
      tags,
    };
  });

  // 📦 Guardar en /public/videos/index.json
  const output = path.join(videosDir, "index.json");
  fs.writeFileSync(output, JSON.stringify(videos, null, 2));

  // 🪄 Copiar también a /.next/static/videos/
  fs.mkdirSync(nextStaticDir, { recursive: true });
  fs.writeFileSync(path.join(nextStaticDir, "index.json"), JSON.stringify(videos, null, 2));

  console.log(`✅ index.json generado y copiado (${videos.length} archivos).`);
  console.log("📂 Disponible en /videos/index.json y /_next/static/videos/index.json");
}

generateIndex();
