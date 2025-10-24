/**
 * 🔮 Everwish Smart Index Generator (v3)
 * Lee todos los archivos .mp4 dentro de /public/videos/** recursivamente.
 * Interpreta nombres en formato:
 *   objeto_categoria_subcategoria_variante.mp4
 * Genera /public/videos/index.json con datos limpios y consistentes.
 */

import fs from "fs";
import path from "path";

// 📂 Rutas principales
const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

/* -------------------------------------------------------------------------- */
/* 🧠 UTILIDADES                                                              */
/* -------------------------------------------------------------------------- */

// 🔹 Recorre todas las carpetas y devuelve paths de .mp4
function getAllMp4Files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory()
      ? getAllMp4Files(fullPath)
      : entry.name.toLowerCase().endsWith(".mp4")
      ? [fullPath]
      : [];
  });
}

// 🔹 Convierte texto en formato legible (“familyandrelationships” → “Family And Relationships”)
function formatWord(str = "") {
  return str
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/* -------------------------------------------------------------------------- */
/* 🧭 DETECCIÓN DIRECTA SEGÚN NOMBRE                                          */
/* -------------------------------------------------------------------------- */

/**
 * parts = ["dog", "petsandanimals", "birthday", "1A"]
 * Devuelve [categoria, subcategoria]
 */
function detectCategory(parts) {
  const object = parts[0] || "Unknown";
  const categoryRaw = parts[1] || "general";
  const subcategoryRaw = parts[2] || "General";

  const category = formatWord(categoryRaw);
  const subcategory = formatWord(subcategoryRaw);

  return [category, subcategory];
}

/* -------------------------------------------------------------------------- */
/* ⚙️ GENERADOR PRINCIPAL                                                     */
/* -------------------------------------------------------------------------- */

function generateIndex() {
  console.log("🪄 Generando index.json...");
  const files = getAllMp4Files(videosRoot);

  const index = files.map((filePath) => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const name = path.basename(filePath, ".mp4");

    const parts = name.split("_");
    const [category, subcategory] = detectCategory(parts);
    const object = formatWord(parts[0]);
    const variant = parts[parts.length - 1]?.toUpperCase() || "";

    // 🔖 Etiquetas únicas
    const tags = Array.from(
      new Set(
        [object, category, subcategory, variant, ...parts]
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      )
    );

    return {
      name,
      file: `/videos/${relative}`,
      object,
      category,
      subcategory,
      variant,
      categories: [category],
      tags,
    };
  });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");
  console.log(`✅ Index actualizado con ${index.length} archivos.`);
}

/* -------------------------------------------------------------------------- */
/* 🚀 EJECUCIÓN                                                               */
/* -------------------------------------------------------------------------- */

generateIndex();
