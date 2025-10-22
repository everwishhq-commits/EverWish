import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const outputFile = path.join(videosDir, "index.json");

// 📂 Diccionario: categoría → categorías Everwish
const keywordCategories = {
  christmas: ["Holidays", "Seasonal & Holidays", "Celebrations"],
  halloween: ["Holidays", "Seasonal & Holidays", "Celebrations"],
  easter: ["Seasonal & Holidays", "Celebrations"],
  thanksgiving: ["Seasonal & Holidays", "Celebrations"],
  mothersday: ["Family & Relationships", "Celebrations"],
  fathersday: ["Family & Relationships", "Celebrations"],
  love: ["Love & Romance", "Celebrations"],
  birthday: ["Birthday", "Celebrations"],
  wedding: ["Weddings & Anniversaries", "Love & Romance"],
  anniversary: ["Weddings & Anniversaries", "Love & Romance"],
  baby: ["Babies & Parenting", "Family & Relationships"],
  family: ["Family & Relationships"],
  congrats: ["Congratulations & Milestones"],
  work: ["Work & Professional"],
  school: ["School & Graduation"],
  graduation: ["School & Graduation"],
  sympathy: ["Sympathy & Remembrance"],
  health: ["Health & Support"],
  ai: ["Custom & AI Creations"],
  pet: ["Pets & Animal Lovers"],
  cat: ["Pets & Animal Lovers"],
  dog: ["Pets & Animal Lovers"],
  spiritual: ["Spiritual & Mindfulness"],
  general: ["Just Because & Everyday"],
  love1a: ["Love & Romance", "Birthday"],
};

// 🧠 Función para detectar categorías desde palabras
function detectCategories(keywordList) {
  const found = new Set();

  for (const keyword of keywordList) {
    const lower = keyword.toLowerCase();
    if (keywordCategories[lower]) {
      keywordCategories[lower].forEach((c) => found.add(c));
    }
  }

  // Si no detecta nada, lo mete en una categoría general
  if (found.size === 0) found.add("Just Because & Everyday");

  return Array.from(found);
}

// 🧩 Analiza el nombre del archivo: objeto_categoria_subcategoria_variant
function parseFileName(filename) {
  const clean = filename.replace(".mp4", "");
  const parts = clean.split("_");

  // Asignación flexible
  const [object, category, subcategory, variant] = parts;
  const tags = parts.filter(Boolean);

  return {
    name: clean,
    object: object || "unknown",
    category: category || "general",
    subcategory: subcategory || null,
    variant: variant || null,
    tags,
    categories: detectCategories(parts),
    file: `${filename}`,
    url: `/videos/${filename}`,
  };
}

// 🧾 Generar el index.json
function generateIndex() {
  const files = fs
    .readdirSync(videosDir)
    .filter((f) => f.endsWith(".mp4"))
    .sort();

  const index = files.map((f) => parseFileName(f));

  fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
  console.log(`✅ Generado index.json con ${index.length} archivos.`);
}

generateIndex();
