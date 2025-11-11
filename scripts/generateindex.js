/**
 * 🧠 GENERADOR CON AUTO-APRENDIZAJE V2
 * - Construye el glosario automáticamente
 * - ✨ Detecta TODAS las subcategorías por video
 * - Lo guarda en index.json para usarlo en la app
 */

import fs from "fs";
import path from "path";
import { 
  classifyVideo, 
  getLearnedGlossary,
  BASE_CATEGORIES 
} from "../lib/classification-system.js";

const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

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

function capitalize(str) {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generateIndex() {
  console.log("🧠 Generando index.json con detección de múltiples subcategorías...\n");
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📁 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    
    // 🧠 Clasificar (aprende automáticamente y detecta todas las subcategorías)
    const classifications = classifyVideo(basename);
    
    const mainClassification = classifications[0];
    const allCategorySlugs = classifications.map(c => c.categorySlug);
    const allCategoryNames = classifications.map(c => c.categoryName);
    
    // 🆕 Recoger TODAS las subcategorías de todas las clasificaciones
    const allSubcategories = [];
    classifications.forEach(c => {
      if (c.subcategories && c.subcategories.length > 0) {
        c.subcategories.forEach(sub => {
          if (!allSubcategories.includes(sub)) {
            allSubcategories.push(sub);
          }
        });
      }
    });
    
    const tags = [
      basename.toLowerCase(),
      mainClassification.object.toLowerCase(),
      ...allCategorySlugs,
      ...allSubcategories.map(s => s.toLowerCase()),
    ];
    
    const videoData = {
      name: basename,
      file: urlPath,
      object: capitalize(mainClassification.object),
      category: mainClassification.categoryName,
      categories: allCategorySlugs,
      subcategory: allSubcategories[0], // Primera subcategoría como principal
      subcategories: allSubcategories,   // 🆕 Todas las subcategorías
      value: mainClassification.variant,
      slug: basename.toLowerCase(),
      tags: [...new Set(tags)],
    };
    
    console.log(`✅ ${videoData.name}`);
    console.log(`   🎨 Object: ${videoData.object}`);
    console.log(`   📂 Categories: [${allCategoryNames.join(", ")}]`);
    console.log(`   🏷️  Subcategories: [${allSubcategories.join(", ")}]`);
    
    // Mostrar advertencia si no se detectó ninguna subcategoría
    if (allSubcategories.length === 0) {
      console.log(`   ⚠️  WARNING: No subcategories detected!`);
    } else if (allSubcategories.length > 1) {
      console.log(`   ✨ MULTIPLE SUBCATEGORIES DETECTED!`);
    }
    console.log("");
    
    return videoData;
  });
  
  // 🧠 OBTENER GLOSARIO APRENDIDO
  const glossary = getLearnedGlossary();
  
  console.log("\n📚 GLOSARIO AUTO-GENERADO:");
  console.log("═══════════════════════════════════");
  Object.entries(glossary).forEach(([key, value]) => {
    console.log(`\n🔹 ${value.object}`);
    console.log(`   Categorías: ${[...value.categories].join(", ")}`);
    console.log(`   Subcategorías: ${[...value.subcategories].join(", ")}`);
    console.log(`   Apariciones: ${value.appearances}`);
  });
  console.log("\n═══════════════════════════════════\n");
  
  // Guardar index con glosario
  const indexData = {
    videos,
    glossary, // 🧠 GLOSARIO INCLUIDO
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`✅ Index generado: ${indexFile}`);
  console.log(`📊 Total de videos: ${videos.length}`);
  console.log(`📚 Objetos en glosario: ${Object.keys(glossary).length}\n`);
  
  // Resumen de categorías
  const categoryCount = {};
  videos.forEach(v => {
    v.categories.forEach(catSlug => {
      const catObj = BASE_CATEGORIES.find(c => c.slug === catSlug);
      const catName = catObj?.name || catSlug;
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });
  });
  
  console.log("📊 Resumen por categoría:");
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} videos`);
    });
  
  // 🆕 Resumen de subcategorías múltiples
  const multiSubVideos = videos.filter(v => v.subcategories && v.subcategories.length > 1);
  if (multiSubVideos.length > 0) {
    console.log(`\n✨ Videos con MÚLTIPLES subcategorías: ${multiSubVideos.length}`);
    multiSubVideos.forEach(v => {
      console.log(`   ${v.name}: [${v.subcategories.join(", ")}]`);
    });
  }
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
