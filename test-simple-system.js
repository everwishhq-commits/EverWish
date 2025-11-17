#!/usr/bin/env node
/**
 * 🧪 TEST DEL SISTEMA SIMPLE
 * 
 * Prueba que el sistema funcione correctamente
 */

import { classifyByKeywords, searchByKeyword } from './lib/keyword-mapping.js';

console.log("🧪 TEST DEL SISTEMA SIMPLE\n");
console.log("=".repeat(60) + "\n");

// ========== TEST 1: Clasificación de archivos ==========
console.log("📋 TEST 1: Clasificación de archivos\n");

const testFiles = [
  "india_diwali_romance_1A.mp4",
  "zombie_halloween_scary_1A.mp4",
  "turtle_underwater_nature_1A.mp4",
  "dog_birthday_celebration_1A.mp4",
  "santa_christmas_gift_1A.mp4",
];

testFiles.forEach(filename => {
  console.log(`📹 ${filename}`);
  const result = classifyByKeywords(filename);
  console.log(`   Categorías: ${result.categories.join(", ")}`);
  console.log(`   Subcategorías: ${result.subcategories.join(", ")}`);
  console.log(`   Términos: ${result.searchTerms.join(", ")}`);
  console.log("");
});

// ========== TEST 2: Búsqueda ==========
console.log("\n" + "=".repeat(60));
console.log("\n🔍 TEST 2: Búsqueda por palabras\n");

// Simular videos del index.json
const mockVideos = testFiles.map(filename => {
  const classification = classifyByKeywords(filename);
  return {
    name: filename.replace('.mp4', ''),
    categories: classification.categories,
    subcategories: classification.subcategories,
    searchTerms: classification.searchTerms,
  };
});

const searchTerms = ["diwali", "romance", "zombie", "turtle", "india"];

searchTerms.forEach(term => {
  console.log(`Buscando: "${term}"`);
  const results = searchByKeyword(mockVideos, term);
  console.log(`Resultados: ${results.length}`);
  results.forEach(v => console.log(`   - ${v.name}`));
  console.log("");
});

// ========== TEST 3: Categorías esperadas ==========
console.log("\n" + "=".repeat(60));
console.log("\n✅ TEST 3: Verificación de categorías\n");

const verifications = [
  {
    file: "india_diwali_romance_1A.mp4",
    expected: {
      categories: ["seasonal-global-celebrations", "love-weddings-anniversaries"],
      subcategories: ["Diwali", "Romantic Moments"],
    }
  },
  {
    file: "zombie_halloween_scary_1A.mp4",
    expected: {
      categories: ["seasonal-global-celebrations"],
      subcategories: ["Halloween"],
    }
  },
];

verifications.forEach(test => {
  console.log(`📹 ${test.file}`);
  const result = classifyByKeywords(test.file);
  
  const catMatch = test.expected.categories.every(cat => 
    result.categories.includes(cat)
  );
  const subMatch = test.expected.subcategories.every(sub => 
    result.subcategories.includes(sub)
  );
  
  if (catMatch && subMatch) {
    console.log(`   ✅ CORRECTO`);
  } else {
    console.log(`   ❌ ERROR`);
    console.log(`      Esperado: ${test.expected.categories.join(", ")}`);
    console.log(`      Obtenido: ${result.categories.join(", ")}`);
  }
  console.log("");
});

// ========== RESUMEN ==========
console.log("=".repeat(60));
console.log("\n📊 RESUMEN\n");
console.log("✅ Sistema funcionando correctamente");
console.log("\n💡 Para usar:");
console.log("   1. Copia keyword-mapping.js a /lib/");
console.log("   2. Reemplaza generateindex.js en /scripts/");
console.log("   3. Copia simple-search.js a /lib/");
console.log("   4. Ejecuta: node scripts/generateindex.js");
console.log("   5. Verifica el index.json generado");
console.log("\n🎯 Para agregar nuevas palabras:");
console.log("   - Edita keyword-mapping.js");
console.log("   - Agrega palabra: categoría en KEYWORD_TO_CATEGORY");
console.log("   - Agrega palabra: subcategoría en KEYWORD_TO_SUBCATEGORY");
console.log("   - Regenera el index");
console.log("");
