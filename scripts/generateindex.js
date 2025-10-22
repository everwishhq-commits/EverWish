/**
 * 🔮 Everwish Smart Index Generator
 * Este script analiza todos los archivos MP4 en /public/videos
 * y genera automáticamente un index.json con:
 *  - nombre del archivo
 *  - objeto (primera palabra)
 *  - categoría (palabra intermedia)
 *  - subcategoría (palabra siguiente)
 *  - variante (última parte, ej. 1A)
 *  - categorías Everwish (mapeadas automáticamente)
 *  - tags autogenerados (nombre completo + partes)
 */

import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosDir, "index.json");

// 🔹 Mapa de palabras clave → categorías de Everwish
const categoryMap = {
  halloween: ["Seasonal & Holidays", "Celebrations"],
  christmas: ["Holidays", "Seasonal & Holidays", "Celebrations"],
  easter: ["Seasonal & Holidays", "Celebrations"],
  thanksgiving: ["Seasonal & Holidays"],
  birthday: ["Birthday"],
  love: ["Love & Romance"],
  wedding: ["Weddings & Anniversaries"],
  anniversary: ["Weddings & Anniversaries"],
  baby: ["Babies & Parenting"],
  graduation: ["School & Graduation"],
  work: ["Work & Professional"],
  mother: ["Family & Relationships"],
  father: ["Family & Relationships"],
  pet: ["Pets & Animal Lovers"],
  sympathy: ["Sympathy & Remembrance"],
  encouragement: ["Encouragement & Motivation"],
  spiritual: ["Spiritual & Mindfulness"],
  art: ["Art & Cultural"],
  friendship: ["Friendship"],
  general: ["Just Because & Everyday"],
  funny: ["Humor & Memes"]
};

// 🔹 Convertir texto a formato legible
function formatWord(word) {
  if (!word) return "";
  return word.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function detectCategory(words) {
  for (const w of words) {
    const key = w.toLowerCase();
    if (categoryMap[key]) return categoryMap[key];
  }
  return ["Just Because & Everyday"];
}

function generateIndex() {
  const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

  const index = files.map((file) => {
    const base = path.basename(file, ".mp4");
    const parts = base.split("_").map((p) => p.toLowerCase());

    const object = parts[0] || "unknown";
    const category = parts[1] || "general";
    const subcategory = parts[2] || "misc";
    const variant = parts[3] || "";

    const categories = detectCategory(parts);
    const tags = Array.from(new Set([...parts, object, category, subcategory, variant].filter(Boolean)));

    return {
      name: base,
      file: `/videos/${file}`,
      object: formatWord(object),
      category: formatWord(category),
      subcategory: formatWord(subcategory),
      variant: variant.toUpperCase(),
      categories,
      tags
    };
  });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");
  console.log(`✅ Index generado con ${index.length} archivos.`);
}

generateIndex();
