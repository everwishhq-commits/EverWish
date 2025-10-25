/**
 * 📁 Everwish – Video Index Generator (v3.0 Final)
 * ------------------------------------------------------------
 * ✅ Lee todos los videos desde /public/videos/
 * ✅ Soporta múltiples categorías con "+"
 * ✅ Nombres como: objeto_categoria(+cat2)_subcategoria_variante.mp4
 * ✅ Genera /public/videos/index.json automáticamente
 * ✅ Compatible con categorías y subcategorías del sistema actualizado (con “and”)
 * ✅ Compatible con las 17 categorías aprobadas
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");
const outputFile = path.join(videosDir, "index.json");

/**
 * 🔤 Limpia texto (minúsculas, sin guiones ni dobles espacios)
 * También reemplaza "&" por "and" para coincidir con los slugs actuales.
 */
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

/**
 * 🎯 Categorías oficiales aprobadas
 */
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
  "adventure"
];

/**
 * 🧠 Interpreta nombre del archivo
 * Formato esperado: objeto_categoria(+categoria2)_subcategoria_variante.mp4
 */
function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split("_");

  const object = clean(parts[0] || "");
  const categoryPart = clean(parts[1] || "general");
  const subcategory = clean(parts[2] || "general");
  const variant = clean(parts[3] || "");

  // Permitir múltiples categorías separadas por "+"
  const categories = categoryPart
    .split("+")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean)
    .filter((c) => VALID_CATEGORIES.includes(c)); // Solo las aprobadas

  // Si ninguna categoría válida, marcar como "general"
  const finalCategories = categories.length > 0 ? categories : ["general"];

  return { object, categories: finalCategories, subcategory, variant };
}

/**
 * 🧾 Genera el archivo index.json
 */
function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    console.error("❌ La carpeta /public/videos no existe.");
    process.exit(1);
  }

  const allFiles = fs.readdirSync(videosDir);
  const videoFiles = allFiles.filter((file) =>
    [".mp4", ".webm", ".mov"].some((ext) => file.endsWith(ext))
  );

  const videos = videoFiles.map((file) => {
    const { object, categories, subcategory, variant } = parseFilename(file);

    const tags = Array.from(
      new Set([
        object,
        ...categories,
        subcategory,
        variant,
        ...object.split(" "),
        ...subcategory.split(" ")
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
      tags
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);
}

/**
 * 🚀 Ejecutar
 */
generateIndex();
