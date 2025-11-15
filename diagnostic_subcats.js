#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO: Verificar Subcategorías en Index.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 VERIFICACIÓN DE SUBCATEGORÍAS EN INDEX.JSON\n");
console.log("=".repeat(70) + "\n");

// Cargar index.json
const indexPath = path.join(process.cwd(), "public/videos/index.json");

if (!fs.existsSync(indexPath)) {
  console.log("❌ ERROR: index.json no existe");
  console.log("   Ejecuta: node scripts/generateindex.js\n");
  process.exit(1);
}

const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
console.log(`✅ Index cargado: ${indexData.videos?.length || 0} videos\n`);

// Agrupar videos por categoría
const byCategory = {};
indexData.videos.forEach(v => {
  if (!v.categories) return;
  v.categories.forEach(cat => {
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(v);
  });
});

// Mostrar subcategorías únicas por categoría
console.log("📊 SUBCATEGORÍAS POR CATEGORÍA\n");
console.log("-".repeat(70) + "\n");

Object.entries(byCategory).forEach(([category, videos]) => {
  console.log(`\n📂 ${category.toUpperCase()}`);
  console.log("   Videos: " + videos.length);
  
  // Extraer subcategorías únicas
  const subcats = new Set();
  videos.forEach(v => {
    if (v.subcategories && Array.isArray(v.subcategories)) {
      v.subcategories.forEach(sub => subcats.add(sub));
    }
  });
  
  if (subcats.size === 0) {
    console.log("   ⚠️  No hay subcategorías definidas");
  } else {
    console.log("   Subcategorías encontradas:");
    [...subcats].sort().forEach(sub => {
      const count = videos.filter(v => 
        v.subcategories && v.subcategories.includes(sub)
      ).length;
      console.log(`      • ${sub} (${count} videos)`);
    });
  }
});

// Verificar ejemplos específicos
console.log("\n" + "=".repeat(70));
console.log("\n🎯 EJEMPLOS ESPECÍFICOS\n");
console.log("-".repeat(70) + "\n");

// 1. Halloween
const halloweenVideos = indexData.videos.filter(v => 
  v.name.toLowerCase().includes("halloween") ||
  v.subcategories?.includes("Halloween")
);

console.log("🎃 HALLOWEEN:");
if (halloweenVideos.length === 0) {
  console.log("   ❌ No se encontraron videos");
} else {
  console.log(`   ✅ ${halloweenVideos.length} videos encontrados`);
  halloweenVideos.slice(0, 3).forEach(v => {
    console.log(`\n   📹 ${v.name}`);
    console.log(`      Subcategorías: ${v.subcategories?.join(", ") || "ninguna"}`);
  });
}

// 2. Pets / Animal Lovers
const petsVideos = indexData.videos.filter(v => 
  v.categories?.includes("pets-animal-lovers")
);

console.log("\n\n🐾 PETS & ANIMAL LOVERS:");
if (petsVideos.length === 0) {
  console.log("   ❌ No se encontraron videos");
} else {
  console.log(`   ✅ ${petsVideos.length} videos encontrados`);
  
  // Agrupar por subcategoría
  const petSubcats = {};
  petsVideos.forEach(v => {
    if (v.subcategories) {
      v.subcategories.forEach(sub => {
        if (!petSubcats[sub]) petSubcats[sub] = [];
        petSubcats[sub].push(v.name);
      });
    }
  });
  
  console.log("\n   Subcategorías:");
  Object.entries(petSubcats).forEach(([sub, names]) => {
    console.log(`      • ${sub}: ${names.length} videos`);
  });
}

// 3. New Beginning / Life Journeys
const lifeJourneyVideos = indexData.videos.filter(v => 
  v.name.toLowerCase().includes("newbeginning") ||
  v.name.toLowerCase().includes("newhome") ||
  v.subcategories?.includes("New Chapter Beginning") ||
  v.subcategories?.includes("New Home Celebration")
);

console.log("\n\n🏠 LIFE JOURNEYS (New Beginning):");
if (lifeJourneyVideos.length === 0) {
  console.log("   ❌ No se encontraron videos");
} else {
  console.log(`   ✅ ${lifeJourneyVideos.length} videos encontrados`);
  lifeJourneyVideos.slice(0, 3).forEach(v => {
    console.log(`\n   📹 ${v.name}`);
    console.log(`      Categorías: ${v.categories?.join(", ") || "ninguna"}`);
    console.log(`      Subcategorías: ${v.subcategories?.join(", ") || "ninguna"}`);
  });
}

// RESUMEN FINAL
console.log("\n" + "=".repeat(70));
console.log("\n📋 RESUMEN\n");

const totalSubcats = new Set();
indexData.videos.forEach(v => {
  if (v.subcategories) {
    v.subcategories.forEach(sub => totalSubcats.add(sub));
  }
});

console.log(`✅ Total de subcategorías únicas: ${totalSubcats.size}`);
console.log(`✅ Total de categorías: ${Object.keys(byCategory).length}`);
console.log(`✅ Total de videos: ${indexData.videos.length}`);

// Verificar si hay nombres descriptivos nuevos
const descriptiveNames = [
  "Furry Companions",
  "Household Friends", 
  "Barnyard Companions",
  "Underwater Universe",
  "Wings in Motion",
  "Amazing Life",
  "New Home Celebration",
  "New Chapter Beginning",
  "Outdoor Adventure Moment",
];

const foundDescriptive = descriptiveNames.filter(name => totalSubcats.has(name));

console.log("\n🎯 Nombres descriptivos encontrados:");
if (foundDescriptive.length === 0) {
  console.log("   ❌ No se encontraron nombres descriptivos nuevos");
  console.log("   ⚠️  PROBLEMA: El index.json no tiene las subcategorías actualizadas");
  console.log("\n   Solución:");
  console.log("   1. Ejecuta: node scripts/generateindex.js");
  console.log("   2. Verifica que se haya generado correctamente");
  console.log("   3. Ejecuta este diagnóstico nuevamente");
} else {
  console.log(`   ✅ ${foundDescriptive.length}/${descriptiveNames.length} nombres encontrados:`);
  foundDescriptive.forEach(name => console.log(`      • ${name}`));
}

console.log("\n" + "=".repeat(70) + "\n");
