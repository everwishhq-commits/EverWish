#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { classifyVideo } from '../lib/classification-system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");

  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
    process.exit(1);
  }

  const mp4Files = getAllMp4Files(videosRoot);
  if (mp4Files.length === 0) {
    fs.writeFileSync(indexFile, JSON.stringify({ videos: [], generated: new Date().toISOString(), total: 0 }, null, 2));
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }

  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replaceAll("\\", "/");
    const basename = path.basename(filePath);
    const nameWithoutExt = basename.replace(/\.mp4$/i, "");

    // 🔥 Usar clasificación modular
    const classifications = classifyVideo(basename);
    const primaryClass = classifications[0];

    const allCategories = [...new Set(classifications.map(c => c.categorySlug))];
    const allSubcategories = [...new Set(classifications.flatMap(c => c.subcategories))];

    const searchTerms = nameWithoutExt.toLowerCase().split(/[_\s-]+/).filter(Boolean);

    return {
      name: nameWithoutExt,
      file: urlPath,
      object: capitalize(primaryClass.object),
      categories: allCategories,
      subcategories: allSubcategories,
      variant: primaryClass.variant,
      slug: nameWithoutExt.toLowerCase(),
      searchTerms,
    };
  });

  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };

  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");

  console.log(`✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos`);

  const categoryCounts = {};
  videos.forEach(v => v.categories.forEach(cat => categoryCounts[cat] = (categoryCounts[cat] || 0) + 1));
  console.log("📊 Videos por categoría:");
  Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
