/**
 * 🎯 SISTEMA AUTOMÁTICO DE CLASIFICACIÓN
 * Lee los nombres de archivo y clasifica AUTOMÁTICAMENTE
 * Formato: objeto_categoria1_categoria2_subcategoria_variante
 * Ejemplo: zombie_halloween_birthday_1a
 */

import fs from "fs";
import path from "path";

const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

// 🎯 CATEGORÍAS PRINCIPALES (nombres exactos de la UI)
const MAIN_CATEGORIES = {
  "holidays": "Holidays",
  "seasonal": "Holidays",
  "celebrations": "Celebrations",
  "birthday": "Celebrations",
  "love": "Love & Romance",
  "romance": "Love & Romance",
  "wedding": "Love & Romance",
  "anniversary": "Love & Romance",
  "family": "Family & Friendship",
  "friendship": "Family & Friendship",
  "work": "Work & Professional Life",
  "professional": "Work & Professional Life",
  "babies": "Babies & Parenting",
  "baby": "Babies & Parenting",
  "parenting": "Babies & Parenting",
  "pets": "Animal Lovers",
  "animals": "Animal Lovers",
  "dog": "Animal Lovers",
  "cat": "Animal Lovers",
  "turtle": "Animal Lovers",
  "support": "Support, Healing & Care",
  "healing": "Support, Healing & Care",
  "care": "Support, Healing & Care",
  "diversity": "Connection",
  "connection": "Connection",
  "sports": "Sports",
  "wellness": "Wellness & Mindful Living",
  "mindful": "Wellness & Mindful Living",
  "nature": "Nature & Life Journeys",
  "life": "Nature & Life Journeys",
  "journeys": "Nature & Life Journeys",
};

// 🎯 SUBCATEGORÍAS (detectadas automáticamente)
const SUBCATEGORIES = {
  // Holidays
  "halloween": "Halloween",
  "christmas": "Christmas",
  "xmas": "Christmas",
  "thanksgiving": "Thanksgiving",
  "easter": "Easter",
  "newyear": "New Year",
  "independenceday": "Independence Day",
  "july4": "Independence Day",
  
  // Love & Romance
  "valentine": "Valentine's Day",
  "valentines": "Valentine's Day",
  "hugs": "Hugs",
  
  // Celebrations
  "birthday": "Birthday",
  
  // Family
  "mother": "Mother's Day",
  "mothers": "Mother's Day",
  "father": "Father's Day",
  "fathers": "Father's Day",
  
  // Animals
  "turtle": "Turtle",
  "dogcat": "Dogs & Cats",
  
  // General
  "general": "General",
  "scary": "Scary",
  "cute": "Cute",
  "funny": "Funny",
};

// 🔍 Buscar todos los .mp4 recursivamente
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

// 📝 Capitalizar palabras
function capitalize(str) {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// 🧠 CLASIFICACIÓN AUTOMÁTICA
function classifyVideo(filename) {
  const basename = path.basename(filename, ".mp4");
  const parts = basename.toLowerCase().split("_");
  
  // Extraer objeto (primera palabra)
  const object = parts[0] || "unknown";
  
  // Extraer variante (última parte: 1a, 2b, etc)
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]?$/i.test(lastPart);
  const variant = isVariant ? lastPart : "1a";
  
  // Partes del medio (categorías y subcategorías)
  const middleParts = isVariant ? parts.slice -1) : parts.slice(1);
  
  // 🎯 Detectar TODAS las categorías que aplican
  const categoriesSet = new Set();
  const subcategoriesFound = [];
  const allTags = new Set();
  
  // Analizar cada parte del nombre
  [object, ...middleParts].forEach(part => {
    const normalized = part.toLowerCase();
    allTags.add(normalized);
    
    // Buscar en categorías principales
    if (MAIN_CATEGORIES[normalized]) {
      categoriesSet.add(MAIN_CATEGORIES[normalized]);
    }
    
    // Buscar en subcategorías
    if (SUBCATEGORIES[normalized]) {
      subcategoriesFound.push(SUBCATEGORIES[normalized]);
    }
    
    // Casos especiales multi-categoría
    if (normalized === "zombie") {
      categoriesSet.add("Holidays");
      categoriesSet.add("Celebrations");
      subcategoriesFound.push("Halloween");
      subcategoriesFound.push("Birthday");
    }
    
    if (normalized === "halloween") {
      categoriesSet.add("Holidays");
      subcategoriesFound.push("Halloween");
    }
    
    if (normalized === "birthday") {
      categoriesSet.add("Celebrations");
      subcategoriesFound.push("Birthday");
    }
  });
  
  // Si no se detectaron categorías, usar "Everyday & Appreciation"
  const categories = categoriesSet.size > 0 
    ? Array.from(categoriesSet) 
    : ["Everyday & Appreciation"];
  
  // 🎯 ELEGIR CATEGORÍA PRINCIPAL según prioridad de subcategoría
  let mainCategory = categories[0];
  
  // Si hay Birthday en subcategorías → Celebrations es principal
  if (subcategoriesFound.includes("Birthday")) {
    mainCategory = "Celebrations";
  }
  // Si hay Halloween en subcategorías → Holidays es principal
  else if (subcategoriesFound.includes("Halloween")) {
    mainCategory = "Holidays";
  }
  // Si hay Christmas en subcategorías → Holidays es principal
  else if (subcategoriesFound.includes("Christmas")) {
    mainCategory = "Holidays";
  }
  // Si hay Valentine en subcategorías → Love & Romance es principal
  else if (subcategoriesFound.includes("Valentine's Day")) {
    mainCategory = "Love & Romance";
  }
  // Si hay Mother's/Father's Day → Family & Friendship
  else if (subcategoriesFound.includes("Mother's Day") || subcategoriesFound.includes("Father's Day")) {
    mainCategory = "Family & Friendship";
  }
  
  // Primera subcategoría encontrada o "General"
  const subcategory = subcategoriesFound[0] || "General";
  
  return {
    name: basename,
    object: capitalize(object),
    categories: categories,
    category: mainCategory, // Categoría principal según subcategoría
    subcategory: subcategory,
    tags: Array.from(allTags),
    variant: variant,
  };
}

// 📊 GENERAR INDEX
function generateIndex() {
  console.log("🚀 Generando index.json automáticamente...\n");
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📁 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replace(/\\/g, "/");
    
    const classified = classifyVideo(filePath);
    
    const videoData = {
      name: classified.name,
      file: urlPath,
      object: classified.object,
      category: classified.category,
      categories: classified.categories,
      subcategory: classified.subcategory,
      tags: classified.tags,
      value: classified.variant,
      slug: classified.name.toLowerCase(),
    };
    
    // Log detallado
    console.log(`✅ ${videoData.name}`);
    console.log(`   🎯 Object: ${videoData.object}`);
    console.log(`   📂 Categories: ${videoData.categories.join(", ")}`);
    console.log(`   🏷️  Subcategory: ${videoData.subcategory}`);
    console.log(`   🎨 Variant: ${videoData.value}\n`);
    
    return videoData;
  });
  
  // Guardar index
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total de videos: ${videos.length}\n`);
  
  // Resumen de categorías
  const categoryCount = {};
  videos.forEach(v => {
    v.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  
  console.log("📊 Resumen por categoría:");
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
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
