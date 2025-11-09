/**
 * 🧩 Everwish Video Index Generator - VERSIÓN FINAL CORREGIDA
 * Usa los nombres EXACTOS de la UI
 * Soporta MÚLTIPLES CATEGORÍAS por video
 */

import fs from "fs";
import path from "path";

const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

// 📚 MAPEO COMPLETO con los nombres EXACTOS de la UI
// NOTA: Algunas palabras pueden estar en MÚLTIPLES categorías (array)
const CATEGORY_MAP = {
  // Holidays (era "Seasonal & Global Celebrations")
  halloween: ["Holidays"],
  christmas: ["Holidays"],
  xmas: ["Holidays"],
  navidad: ["Holidays"],
  thanksgiving: ["Holidays"],
  easter: ["Holidays"],
  holidays: ["Holidays"],
  july4: ["Holidays"],
  independenceday: ["Holidays"],
  independence: ["Holidays"],
  eagle: ["Holidays"],
  newyear: ["Holidays"],
  
  // Love & Romance (era "Love, Weddings & Anniversaries")
  love: ["Love & Romance"],
  valentine: ["Love & Romance"],
  valentines: ["Love & Romance"],
  wedding: ["Love & Romance"],
  anniversary: ["Love & Romance"],
  hugs: ["Love & Romance"],
  
  // Celebrations (era "Birthdays & Celebrations")
  birthday: ["Celebrations"],
  bday: ["Celebrations"],
  celebration: ["Celebrations"],
  celebrations: ["Celebrations"],
  celebr: ["Celebrations"],
  
  // 🎃 ZOMBIE: Está en Halloween (Holidays) Y en Celebrations
  zombie: ["Holidays", "Celebrations"],
  
  // Family & Friendship
  mother: ["Family & Friendship"],
  mothers: ["Family & Friendship"],
  mothersday: ["Family & Friendship"],
  father: ["Family & Friendship"],
  fathers: ["Family & Friendship"],
  fathersday: ["Family & Friendship"],
  family: ["Family & Friendship"],
  
  // Babies & Parenting
  baby: ["Babies & Parenting"],
  
  // Animal Lovers (era "Pets & Animal Lovers")
  pet: ["Animal Lovers"],
  pets: ["Animal Lovers"],
  dog: ["Animal Lovers"],
  dogcat: ["Animal Lovers"],
  cat: ["Animal Lovers"],
  turtle: ["Animal Lovers"],
  animals: ["Animal Lovers"],
  animalsandnature: ["Animal Lovers"],
  
  // Otros
  general: ["Everyday & Appreciation"],
  thank: ["Everyday & Appreciation"],
  thanks: ["Everyday & Appreciation"],
  congrats: ["Everyday & Appreciation"],
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
      : entry.name.endsWith(".mp4")
      ? [fullPath]
      : [];
  });
}

function extractInfoFromFilename(filename) {
  const basename = path.basename(filename, ".mp4");
  const parts = basename.split("_");
  
  const object = parts[0] || "Unknown";
  const lastPart = parts[parts.length - 1] || "";
  const versionMatch = lastPart.match(/^(\d+)([A-Z]?)$/);
  const version = versionMatch ? versionMatch[0] : "1A";
  
  const middleParts = parts.slice(1, -1);
  
  return { object, middleParts, version, basename };
}

function classifyVideo(info) {
  const { object, middleParts, basename } = info;
  const allParts = [object, ...middleParts].map(p => p.toLowerCase());
  
  const categoriesSet = new Set();
  let subcategory = "General";
  
  // Clasificar por cada palabra del nombre
  allParts.forEach(part => {
    // Buscar categoría (ahora puede retornar un array)
    if (CATEGORY_MAP[part]) {
      const cats = CATEGORY_MAP[part];
      if (Array.isArray(cats)) {
        cats.forEach(cat => categoriesSet.add(cat));
      } else {
        categoriesSet.add(cats);
      }
    }
    
    // Buscar subcategoría (la primera que encuentre)
    if (SUBCATEGORY_MAP[part] && subcategory === "General") {
      subcategory = SUBCATEGORY_MAP[part];
    }
  });
  
  // Si no encontró categorías, asignar por defecto
  if (categoriesSet.size === 0) {
    categoriesSet.add("Everyday & Appreciation");
  }
  
  return {
    categories: Array.from(categoriesSet),
    category: Array.from(categoriesSet)[0], // Primera categoría como principal
    subcategory,
  };
}

function generateTags(info) {
  const { object, middleParts, basename } = info;
  const tags = [object.toLowerCase()];
  
  middleParts.forEach(part => {
    if (part.toLowerCase() !== object.toLowerCase()) {
      tags.push(part.toLowerCase());
    }
  });
  
  // Agregar las categorías como tags
  const classification = classifyVideo(info);
  classification.categories.forEach(cat => {
    const tagVersion = cat.toLowerCase().replace(/\s+/g, " ");
    if (!tags.includes(tagVersion)) {
      tags.push(tagVersion);
    }
  });
  
  // Agregar subcategoría
  if (classification.subcategory !== "General") {
    const subTag = classification.subcategory.toLowerCase().replace(/\s+/g, " ");
    if (!tags.includes(subTag)) {
      tags.push(subTag);
    }
  }
  
  return [...new Set(tags)];
}

function capitalizeWords(str) {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generateIndex() {
  console.log("🎬 Generando index.json con nombres de UI y múltiples categorías...\n");
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📁 Archivos encontrados: ${mp4Files.length}\n`);
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replace(/\\/g, "/");
    
    const info = extractInfoFromFilename(filePath);
    const classification = classifyVideo(info);
    const tags = generateTags(info);
    
    const videoData = {
      name: info.basename,
      file: urlPath,
      object: capitalizeWords(info.object),
      category: classification.category,
      categories: classification.categories,
      subcategory: classification.subcategory,
      tags: tags,
      version: info.version,
    };
    
    // Log detallado
    console.log(`✅ ${videoData.name}`);
    console.log(`   📂 Categories: ${classification.categories.join(", ")}`);
    console.log(`   🏷️  Subcategory: ${classification.subcategory}`);
    console.log(`   🎯 Object: ${videoData.object}\n`);
    
    return videoData;
  });
  
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`✅ Index generado: ${indexFile}`);
  console.log(`📊 Total de videos: ${videos.length}\n`);
  
  // Resumen de categorías
  const categoryCount = {};
  videos.forEach(v => {
    v.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  
  console.log("📊 Resumen por categoría:");
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} videos`);
  });
}

// Ejecutar
try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
  }
