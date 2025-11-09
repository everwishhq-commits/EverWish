/**
 * 🧩 Everwish Video Index Generator - VERSIÓN FINAL
 * Se ejecuta automáticamente en build y dev
 * Clasificación múltiple basada en nombre de archivo
 */

import fs from "fs";
import path from "path";

const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

// 📚 MAPEO COMPLETO: palabra → categoría principal
const CATEGORY_MAP = {
  // Seasonal & Holidays - TODAS LAS VARIANTES
  halloween: "Seasonal & Global Celebrations",
  christmas: "Seasonal & Global Celebrations",
  xmas: "Seasonal & Global Celebrations",
  navidad: "Seasonal & Global Celebrations",
  thanksgiving: "Seasonal & Global Celebrations",
  easter: "Seasonal & Global Celebrations",
  holidays: "Seasonal & Global Celebrations",
  july4: "Seasonal & Global Celebrations",
  independenceday: "Seasonal & Global Celebrations",
  independence: "Seasonal & Global Celebrations",
  eagle: "Seasonal & Global Celebrations",
  newyear: "Seasonal & Global Celebrations",
  
  // Love & Romance
  love: "Love, Weddings & Anniversaries",
  valentine: "Love, Weddings & Anniversaries",
  valentines: "Love, Weddings & Anniversaries",
  wedding: "Love, Weddings & Anniversaries",
  anniversary: "Love, Weddings & Anniversaries",
  hugs: "Love, Weddings & Anniversaries",
  
  // Birthdays & Celebrations
  birthday: "Birthdays & Celebrations",
  bday: "Birthdays & Celebrations",
  celebration: "Birthdays & Celebrations",
  celebrations: "Birthdays & Celebrations",
  celebr: "Birthdays & Celebrations",
  zombie: "Birthdays & Celebrations",
  
  // Family & Friendship
  mother: "Family & Friendship",
  mothers: "Family & Friendship",
  mothersday: "Family & Friendship",
  father: "Family & Friendship",
  fathers: "Family & Friendship",
  fathersday: "Family & Friendship",
  family: "Family & Friendship",
  
  // Babies & Parenting
  baby: "Babies & Parenting",
  
  // Pets & Animal Lovers - IMPORTANTE
  pet: "Pets & Animal Lovers",
  pets: "Pets & Animal Lovers",
  dog: "Pets & Animal Lovers",
  dogcat: "Pets & Animal Lovers",
  cat: "Pets & Animal Lovers",
  turtle: "Pets & Animal Lovers", // ← AÑADIDO
  animals: "Pets & Animal Lovers",
  animalsandnature: "Pets & Animal Lovers",
  
  // Everyday
  general: "Everyday & Appreciation",
  thank: "Everyday & Appreciation",
  thanks: "Everyday & Appreciation",
  congrats: "Everyday & Appreciation",
};

// 🎯 SUBCATEGORÍAS
const SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  july4: "Independence Day",
  independenceday: "Independence Day",
  independence: "Independence Day",
  eagle: "Independence Day",
  newyear: "New Year",
  valentine: "Valentine's Day",
  birthday: "Birthday",
  wedding: "Wedding",
  love: "Love",
  hugs: "Hugs",
  mother: "Mother's Day",
  mothers: "Mother's Day",
  father: "Father's Day",
  pet: "Pets",
  turtle: "Turtle",
  general: "General",
  scary: "Scary",
  cute: "Cute",
  zombie: "Zombie",
};

function getAllMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
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

function detectCategories(parts) {
  const categories = new Set();
  
  // Revisar TODAS las partes del nombre
  for (const part of parts) {
    const normalized = part.toLowerCase().trim();
    if (CATEGORY_MAP[normalized]) {
      categories.add(CATEGORY_MAP[normalized]);
    }
  }
  
  if (categories.size === 0) {
    categories.add("Everyday & Appreciation");
  }
  
  return Array.from(categories);
}

function detectSubcategory(parts) {
  // Buscar en orden de prioridad
  for (let i = 1; i < parts.length; i++) {
    const normalized = parts[i].toLowerCase().trim();
    if (SUBCATEGORY_MAP[normalized]) {
      return SUBCATEGORY_MAP[normalized];
    }
  }
  return "General";
}

function normalize(str) {
  return str
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "";
}

function generateIndex() {
  console.log("\n🎬 EVERWISH INDEX GENERATOR");
  console.log("=" .repeat(50));

  if (!fs.existsSync(videosRoot)) {
    console.error("❌ Carpeta public/videos/ no existe");
    return;
  }

  const files = getAllMp4Files(videosRoot);
  console.log(`📹 Archivos encontrados: ${files.length}\n`);

  const videos = files.map((filePath) => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    const parts = basename.split("_");
    
    const object = normalize(parts[0] || "Unknown");
    const categories = detectCategories(parts);
    const subcategory = detectSubcategory(parts);
    const variant = parts[parts.length - 1]?.match(/\d+[A-Z]+/i)?.[0] || "1A";
    
    const tags = Array.from(new Set([
      ...parts.map(p => p.toLowerCase()),
      object.toLowerCase(),
      ...categories.map(c => c.toLowerCase()),
      subcategory.toLowerCase(),
    ]));

    console.log(`✅ ${basename}`);
    console.log(`   📂 Categories: ${categories.join(", ")}`);
    console.log(`   🏷️  Subcategory: ${subcategory}`);
    console.log(`   🎨 Variant: ${variant}\n`);

    return {
      name: basename,
      file: `/videos/${relative}`,
      object,
      category: categories[0],
      categories,
      subcategory,
      variant,
      slug: basename.toLowerCase(),
      tags,
    };
  });

  fs.writeFileSync(indexFile, JSON.stringify({ videos }, null, 2), "utf-8");
  
  console.log("=" .repeat(50));
  console.log(`✅ Index generado: ${videos.length} videos`);
  console.log(`📂 Ubicación: ${indexFile}\n`);
  
  // Resumen
  const categoryCount = {};
  videos.forEach(v => {
    v.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  
  console.log("📊 RESUMEN POR CATEGORÍA:");
  console.log("-".repeat(50));
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
  console.log("=" .repeat(50) + "\n");
}

generateIndex();
