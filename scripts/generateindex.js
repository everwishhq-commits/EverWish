/**
 * 🔮 Everwish Smart Index Generator (v2)
 * Lee todos los .mp4 desde /public/videos/** (recursivo)
 * Cruza con /public/data/subcategories.json
 * Crea /public/videos/index.json automáticamente.
 */

import fs from "fs";
import path from "path";

// 🔹 Rutas
const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");
const subcategoryMapPath = path.join(process.cwd(), "public/data/subcategories.json");

// 🔹 Cargar subcategorías base
let subcategoryMap = {};
try {
  subcategoryMap = JSON.parse(fs.readFileSync(subcategoryMapPath, "utf-8"));
} catch (err) {
  console.error("⚠️ No se pudo cargar subcategories.json:", err);
}

// 🔹 Buscar archivos recursivamente
function getAllMp4Files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllMp4Files(fullPath)
      : entry.name.toLowerCase().endsWith(".mp4") ? [fullPath] : [];
  });
}

// 🔹 Formatear texto bonito
function formatWord(word) {
  if (!word) return "";
  return word.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// 🔹 Detectar categoría según palabras
function detectCategory(words) {
  const lower = words.map(w => w.toLowerCase());
  for (const [mainCat, subs] of Object.entries(subcategoryMap)) {
    for (const sub of subs) {
      const allTerms = [
        sub.name_en.toLowerCase(),
        sub.name_es.toLowerCase(),
        mainCat.replace(/-/g, " ")
      ];
      if (allTerms.some(term => lower.some(w => w.includes(term.split(" ")[0])))) {
        return [mainCat, sub.name_en];
      }
    }
  }
  return ["Just Because & Everyday", "General"];
}

// 🔹 Generar índice
function generateIndex() {
  const files = getAllMp4Files(videosRoot);
  const index = files.map(filePath => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const name = path.basename(filePath, ".mp4");
    const parts = name.split("_");

    const object = formatWord(parts[0] || "Unknown");
    const [category, subcategory] = detectCategory(parts);
    const variant = parts[parts.length - 1]?.toUpperCase() || "";

    const tags = Array.from(new Set([
      object, category, subcategory, variant, ...parts
    ].filter(Boolean).map(t => t.toLowerCase())));

    return {
      name,
      file: `/videos/${relative}`,
      object,
      category,
      subcategory,
      variant,
      categories: [category],
      tags
    };
  });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");
  console.log(`✅ Index actualizado con ${index.length} archivos.`);
}

generateIndex();
