#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO V13 - Verificador de Correcciones
 * Verifica que los problemas de clasificación estén resueltos
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 DIAGNÓSTICO V13 - Verificación de Correcciones\n");
console.log("=".repeat(60) + "\n");

// ===== TEST 1: Verificar Index.json =====
console.log("📊 TEST 1: Verificación de index.json");
console.log("-".repeat(60));

const indexPath = path.join(process.cwd(), "public/videos/index.json");

if (!fs.existsSync(indexPath)) {
  console.log("❌ ERROR: index.json no existe");
  console.log("   → Ejecuta: node scripts/generateindex.js\n");
  process.exit(1);
}

const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
console.log(`✅ Index cargado: ${indexData.videos?.length || 0} videos\n`);

// ===== TEST 2: Buscar "zombies" =====
console.log("🧟 TEST 2: Búsqueda de 'zombies'");
console.log("-".repeat(60));

const zombieVideos = indexData.videos.filter(v => {
  const searchable = [
    v.name,
    v.object,
    v.subcategory,
    ...(v.tags || []),
  ].join(" ").toLowerCase();
  
  return searchable.includes("zombie") || searchable.includes("zombies");
});

console.log(`📹 Videos encontrados: ${zombieVideos.length}`);

if (zombieVideos.length === 0) {
  console.log("❌ PROBLEMA: No se encontraron videos de zombies");
} else {
  console.log("✅ Videos encontrados:");
  zombieVideos.forEach(v => {
    console.log(`   - ${v.name}`);
    console.log(`     Categorías: ${v.categories.join(", ")}`);
    console.log(`     Subcategorías: ${v.subcategories.join(", ")}`);
  });
  
  // Verificar que estén en Halloween
  const inHalloween = zombieVideos.every(v => 
    v.categories.includes("seasonal-global-celebrations") &&
    v.subcategories.includes("Halloween")
  );
  
  if (inHalloween) {
    console.log("\n✅ CORRECTO: Todos los zombies están en Halloween");
  } else {
    console.log("\n⚠️  WARNING: Algunos zombies NO están en Halloween");
  }
}

console.log("");

// ===== TEST 3: Verificar "New Beginning" =====
console.log("🏠 TEST 3: Verificación de 'New Beginning'");
console.log("-".repeat(60));

const newBeginningVideos = indexData.videos.filter(v => {
  const name = v.name.toLowerCase();
  return name.includes("newbeginning") || 
         name.includes("newhome") || 
         name.includes("moving");
});

console.log(`📹 Videos de 'New Beginning': ${newBeginningVideos.length}`);

if (newBeginningVideos.length === 0) {
  console.log("⚠️  No se encontraron videos de New Beginning");
} else {
  let hasContamination = false;
  
  newBeginningVideos.forEach(v => {
    console.log(`\n   📹 ${v.name}`);
    console.log(`      Categorías: ${v.categories.join(", ")}`);
    console.log(`      Subcategorías: ${v.subcategories.join(", ")}`);
    
    // Verificar contaminación
    const hasPets = v.categories.includes("pets-animal-lovers");
    const hasSeaAnimals = v.subcategories.includes("Sea Animals");
    const hasWildAnimals = v.subcategories.includes("Wild Animals");
    const hasFarmAnimals = v.subcategories.includes("Farm Animals");
    
    if (hasPets || hasSeaAnimals || hasWildAnimals || hasFarmAnimals) {
      console.log("      ❌ CONTAMINACIÓN DETECTADA: Tiene categorías de animales");
      hasContamination = true;
    } else {
      console.log("      ✅ Limpio: Sin categorías de animales");
    }
  });
  
  if (!hasContamination) {
    console.log("\n✅ CORRECTO: New Beginning sin contaminación");
  } else {
    console.log("\n❌ PROBLEMA: New Beginning tiene contaminación de animales");
  }
}

console.log("");

// ===== TEST 4: Verificar Glosario =====
console.log("📚 TEST 4: Verificación del Glosario");
console.log("-".repeat(60));

const glossary = indexData.glossary || {};
const glossaryKeys = Object.keys(glossary);

console.log(`📖 Objetos en glosario: ${glossaryKeys.length}`);

// Objetos problemáticos que NO deberían estar
const problematicObjects = [
  'zombie', 'zombies', 'ghost', 'ghosts', 'turtle', 'turtles',
  'pumpkin', 'pumpkins', 'turkey', 'turkeys', 'santa',
];

const foundProblematic = [];
problematicObjects.forEach(obj => {
  if (glossaryKeys.some(k => k === obj || k.includes(obj))) {
    foundProblematic.push(obj);
  }
});

if (foundProblematic.length > 0) {
  console.log("\n❌ PROBLEMA: Objetos específicos en el glosario:");
  foundProblematic.forEach(obj => {
    console.log(`   - ${obj} (debería estar en OBJECT_KEYWORDS)`);
  });
} else {
  console.log("\n✅ CORRECTO: Glosario sin objetos específicos");
}

// Mostrar algunos objetos del glosario (debugging)
console.log("\n📝 Primeros 5 objetos del glosario:");
glossaryKeys.slice(0, 5).forEach(key => {
  const entry = glossary[key];
  console.log(`   - ${entry.object}`);
  console.log(`     Categorías: ${entry.categories.join(", ")}`);
  console.log(`     Subcategorías: ${entry.subcategories.join(", ")}`);
});

console.log("");

// ===== TEST 5: Conteo por Categoría =====
console.log("📊 TEST 5: Distribución por Categoría");
console.log("-".repeat(60));

const categoryCounts = {};
indexData.videos.forEach(v => {
  v.categories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
});

Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} videos`);
  });

console.log("");

// ===== RESUMEN FINAL =====
console.log("=".repeat(60));
console.log("📋 RESUMEN DE VERIFICACIÓN\n");

const allTestsPassed = 
  zombieVideos.length > 0 &&
  zombieVideos.every(v => 
    v.categories.includes("seasonal-global-celebrations") &&
    v.subcategories.includes("Halloween")
  ) &&
  !newBeginningVideos.some(v => 
    v.categories.includes("pets-animal-lovers")
  ) &&
  foundProblematic.length === 0;

if (allTestsPassed) {
  console.log("✅ TODOS LOS TESTS PASARON");
  console.log("\n🎉 El sistema de clasificación está funcionando correctamente!");
  console.log("\nPróximos pasos:");
  console.log("   1. Hacer commit de los cambios");
  console.log("   2. Push a GitHub");
  console.log("   3. Verificar en producción");
} else {
  console.log("❌ ALGUNOS TESTS FALLARON");
  console.log("\n⚠️  Revisa los problemas arriba");
  console.log("\nAcciones recomendadas:");
  console.log("   1. Verificar que copiaste los archivos correctos");
  console.log("   2. Regenerar index: node scripts/generateindex.js");
  console.log("   3. Ejecutar este diagnóstico nuevamente");
  process.exit(1);
}

console.log("\n" + "=".repeat(60));
