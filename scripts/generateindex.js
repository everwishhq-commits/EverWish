/**
 * 🧠 GENERADOR CON PROTECCIÓN CONTRA CONTAMINACIÓN V4
 * - Evita que "zombie" contamine "New Beginning"
 * - Detecta contextos correctos
 * - Limpia clasificaciones erróneas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== COPIAR SISTEMA DE CLASIFICACIÓN COMPLETO =====
// (El mismo código del archivo anterior, por brevedad lo omito aquí)
// ... [incluir todo el código de classification-system.js] ...

// ===== GENERACIÓN CON LIMPIEZA =====

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
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🧠 Generando index.json con protección anti-contaminación...\n");
  console.log(`📁 Buscando en: ${videosRoot}\n`);
  
  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: La carpeta ${videosRoot} no existe`);
    process.exit(1);
  }
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📹 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    
    const classifications = classifyVideo(basename);
    
    // ⚠️ LIMPIEZA: Si es "newbeginning" y tiene "pets-animal-lovers", eliminar pets
    const cleanedClassifications = classifications.filter(c => {
      const isNewBeginning = basename.toLowerCase().includes("newbeginning") || 
                             basename.toLowerCase().includes("newhome") ||
                             basename.toLowerCase().includes("moving");
      
      if (isNewBeginning && c.categorySlug === "pets-animal-lovers") {
        console.log(`   🧹 LIMPIEZA: Removiendo "pets-animal-lovers" de "${basename}"`);
        return false;
      }
      
      return true;
    });
    
    const mainClassification = cleanedClassifications[0] || classifications[0];
    const allCategorySlugs = cleanedClassifications.map(c => c.categorySlug);
    const allCategoryNames = cleanedClassifications.map(c => c.categoryName);
    
    const allSubcategories = [];
    cleanedClassifications.forEach(c => {
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
      subcategory: allSubcategories[0],
      subcategories: allSubcategories,
      value: mainClassification.variant,
      slug: basename.toLowerCase(),
      tags: [...new Set(tags)],
    };
    
    console.log(`✅ ${videoData.name}`);
    console.log(`   🎨 Object: ${videoData.object}`);
    console.log(`   📂 Categories: [${allCategoryNames.join(", ")}]`);
    console.log(`   🏷️  Subcategories: [${allSubcategories.join(", ")}]`);
    
    if (allSubcategories.length === 0) {
      console.log(`   ⚠️  WARNING: No subcategories detected!`);
    } else if (allSubcategories.length > 1) {
      console.log(`   ✨ Multiple subcategories: ${allSubcategories.join(", ")}`);
    }
    console.log("");
    
    return videoData;
  });
  
  // ⚠️ LIMPIEZA DEL GLOSARIO: No incluir objetos que causan contaminación
  const glossary = {};
  Object.entries(LEARNED_GLOSSARY).forEach(([k, v]) => {
    // Skip objetos problemáticos
    if (isObjectKeyword(v.object)) {
      console.log(`   🧹 SKIP glosario: "${v.object}" (objeto específico)`);
      return;
    }
    
    glossary[k] = {
      object: v.object,
      categories: [...v.categories],
      subcategories: [...v.subcategories],
      appearances: v.appearances,
    };
  });
  
  const indexData = {
    videos,
    glossary,
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total de videos: ${videos.length}`);
  console.log(`📚 Objetos en glosario: ${Object.keys(glossary).length}\n`);
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
