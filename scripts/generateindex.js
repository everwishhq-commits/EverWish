/**
 * 📁 Everwish – Video Index Generator (lowercase + multi-category support)
 * ----------------------------------------------------------------------
 * ✅ Lee /public/videos/
 * ✅ Soporta nombres como:
 *    objeto_categoria(+categoria2)_subcategoria_variante.mp4
 * ✅ Crea /public/videos/index.json
 * ✅ Todo en minúsculas
 */

import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const outputFile = path.join(videosDir, "index.json");

/**
 * 🔤 Limpia y convierte todo a minúsculas
 */
function clean(str) {
  return str
    ? str
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
    : "";
}

/**
 * 🧠 Interpreta nombre de archivo
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

  // Soporte para múltiples categorías con "+"
  const categories = categoryPart
    .split("+")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  return { object, categories, subcategory, variant };
}

/**
 * 🧾 Genera index.json
 */
function generateIndex() {
  const allFiles = fs.readdirSync(videosDir);
  const videoFiles = allFiles.filter(
    (file) =>
      file.endsWith(".mp4") ||
      file.endsWith(".webm") ||
      file.endsWith(".mov")
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

generateIndex();
