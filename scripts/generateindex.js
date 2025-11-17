#!/usr/bin/env node
/**
 * 🎬 GENERADOR DE INDEX.JSON - VERSIÓN SIMPLE
 * 
 * Lee archivos .mp4 y usa keyword-mapping.js para clasificar
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { classifyByKeywords } from '../lib/keyword-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Busca todos los .mp4 recursivamente
 */
function getAllMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMp4Files(fullPath));
    } else if (entry.name.match(/\.mp4$/i)) {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Extrae el objeto principal del nombre
 * Ejemplo: "india_diwali_romance_1A.mp4" → "India"
 */
function extractObject(filename) {
  const nameWithoutExt = filename.replace(/\.mp4$/i, '');
  const parts = nameWithoutExt.split('_');
  
  // El primer elemento es el objeto
  const object = parts[0] || "Unknown";
  
  // Capitalizar primera letra
  return object.charAt(0).toUpperCase() + object.slice(1).toLowerCase();
}

/**
 * Extrae el variant (1A, 2A, etc.)
 */
function extractVariant(filename) {
  const match = filename.match(/_(\d+[A-Z])\.mp4$/i);
  return match ? match[1].toUpperCase() : "1A";
}

/**
 * FUNCIÓN PRINCIPAL
 */
function generateIndex() {
  console.log("🎬 Generando index.json...\n");
  
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");

  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
    process.exit(1);
  }

  // 1. Buscar todos los .mp4
  const mp4Files = getAllMp4Files(videosRoot);
  
  if (mp4Files.length === 0) {
    const emptyIndex = {
      videos: [],
      generated: new Date().toISOString(),
      total: 0
    };
    fs.writeFileSync(indexFile, JSON.stringify(emptyIndex, null, 2));
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }

  console.log(`📹 Archivos encontrados: ${mp4Files.length}\n`);

  // 2. Procesar cada video
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replaceAll("\\", "/");
    const basename = path.basename(filePath);
    const nameWithoutExt = basename.replace(/\.mp4$/i, "");

    // 🔥 Clasificación simple por palabras clave
    const classification = classifyByKeywords(basename);

    return {
      name: nameWithoutExt,
      file: urlPath,
      object: extractObject(basename),
      categories: classification.categories,
      subcategories: classification.subcategories,
      variant: extractVariant(basename),
      slug: nameWithoutExt.toLowerCase(),
      searchTerms: classification.searchTerms,
    };
  });

  // 3. Crear el index.json
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };

  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");

  // 4. Mostrar resumen
  console.log(`✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos\n`);

  // Contar por categoría
  const categoryCounts = {};
  videos.forEach(v => {
    v.categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  console.log("📊 Videos por categoría:");
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

  console.log("\n✅ ¡Listo!\n");
}

// Ejecutar
try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
