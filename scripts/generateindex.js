#!/usr/bin/env node
/**
 * 🎬 GENERADOR DE INDEX.JSON - OPTIMIZADO PARA VERCEL
 * 
 * - Evita doble ejecución en builds
 * - No genera warnings en análisis estático
 * - Mantiene TODA tu lógica original
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyByKeywords } from "../lib/keyword-mapping.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 Evita doble ejecución en Vercel
if (process.env.GENERATE_INDEX_RAN === "1") {
  process.exit(0);
}
process.env.GENERATE_INDEX_RAN = "1";

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
    } else if (entry.name.toLowerCase().endsWith(".mp4")) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Extrae el objeto principal (primer chunk del nombre)
 */
function extractObject(filename) {
  const nameWithoutExt = filename.replace(/\.mp4$/i, "");
  const parts = nameWithoutExt.split("_");
  const object = parts[0] || "Unknown";
  return object.charAt(0).toUpperCase() + object.slice(1).toLowerCase();
}

/**
 * Extrae variant (1A, 2A...)
 */
function extractVariant(filename) {
  const match = filename.match(/_(\d+[A-Z])\.mp4$/i);
  return match ? match[1].toUpperCase() : "1A";
}

/**
 * FUNCIÓN PRINCIPAL
 */
function generateIndex() {
  console.log("🎬 Generando index.json...");

  const root = process.cwd();
  const videosRoot = path.join(root, "public/videos");
  const indexFile = path.join(videosRoot, "index.json");

  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
    process.exit(1);
  }

  // Buscar .mp4
  const mp4Files = getAllMp4Files(videosRoot);

  if (mp4Files.length === 0) {
    fs.writeFileSync(
      indexFile,
      JSON.stringify(
        { videos: [], generated: new Date().toISOString(), total: 0 },
        null,
        2
      )
    );
    console.warn("⚠️ No se encontraron archivos .mp4");
    return;
  }

  console.log(`📹 Archivos encontrados: ${mp4Files.length}`);

  // Procesar videos
  const videos = mp4Files.map((filePath) => {
    const relative = path.relative(path.join(root, "public"), filePath);
    const urlPath = "/" + relative.replace(/\\/g, "/");
    const basename = path.basename(filePath);
    const nameWithoutExt = basename.replace(/\.mp4$/i, "");
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

  // Crear JSON
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };

  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");

  console.log(`✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos`);

  // Contar por categoría (solo para logs del developer)
  const categoryCounts = {};
  videos.forEach((v) => {
    v.categories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  console.log("📊 Videos por categoría:");
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

  console.log("✅ ¡Listo!");
}

// Ejecutar
try {
  generateIndex();
  process.exit(0);
} catch (err) {
  console.error("❌ Error:", err);
  process.exit(1);
                                             }
