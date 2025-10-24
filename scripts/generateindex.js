/**
 * 📁 Everwish – Video Index Generator (v2.1)
 * ------------------------------------------------------------
 * ✅ Lee todos los videos en /public/videos/
 * ✅ Soporta múltiples categorías con "+"
 * ✅ Nombres como: objeto_categoria(+cat2)_subcategoria_variante.mp4
 * ✅ Genera /public/videos/index.json automáticamente
 * ✅ Compatible con categorías y subcategorías del sistema actualizado (con “and”)
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
 * 🧠 Interpreta nombre del archivo
 * Formato esperado: objeto_categoria(+categoria2)_subcategoria_variante.mp4
 */
function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split("_");

  let object = "";
  let categoryPart = "";
  let subcategory = "general";
  let variant = "";

  if (parts.length >= 2) {
    object = clean(parts[0]);
    categoryPart = clean(parts[1]);
  }
  if (parts.length >= 3) subcategory = clean(parts[2]);
  if (parts.length >= 4) variant = clean(parts[3]);

  // Múltiples categorías (separadas con "+")
  const categories = categoryPart
    .split("+")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  return { object, categories, subcategory, variant };
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

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);
}

/**
 * 🚀 Ejecutar
 */
generateIndex();
