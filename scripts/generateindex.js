#!/usr/bin/env node
/**
 * 🚀 GENERADOR FLEXIBLE
 * Soporta: zombie_halloween_1A.mp4 o zombie_halloween_birthday_1A.mp4
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAP = {
  'halloween': { cat: 'seasonal-global-celebrations', sub: 'Halloween' },
  'christmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'xmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'thanksgiving': { cat: 'seasonal-global-celebrations', sub: 'Thanksgiving' },
  'easter': { cat: 'seasonal-global-celebrations', sub: 'Easter' },
  'valentine': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'valentines': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'july4': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
  'independenceday': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
  'mothersday': { cat: 'seasonal-global-celebrations', sub: "Mother's Day" },
  'fathersday': { cat: 'seasonal-global-celebrations', sub: "Father's Day" },
  'birthday': { cat: 'birthdays-celebrations', sub: 'Birthday' },
  'party': { cat: 'birthdays-celebrations', sub: 'Party' },
  'love': { cat: 'love-weddings-anniversaries', sub: 'Love' },
  'romance': { cat: 'love-weddings-anniversaries', sub: 'Romance' },
  'wedding': { cat: 'love-weddings-anniversaries', sub: 'Wedding' },
  'anniversary': { cat: 'love-weddings-anniversaries', sub: 'Anniversary' },
  'hugs': { cat: 'love-weddings-anniversaries', sub: 'Hugs' },
  'seaanimals': { cat: 'pets-animal-lovers', sub: 'Sea Animals' },
  'farmanimals': { cat: 'pets-animal-lovers', sub: 'Farm Animals' },
  'flyinganimals': { cat: 'pets-animal-lovers', sub: 'Flying Animals' },
  'wildanimals': { cat: 'pets-animal-lovers', sub: 'Wild Animals' },
  'pets': { cat: 'pets-animal-lovers', sub: 'Companion Animals' },
  'furryfriends': { cat: 'pets-animal-lovers', sub: 'Companion Animals' },
  'dogs': { cat: 'pets-animal-lovers', sub: 'Dogs' },
  'cats': { cat: 'pets-animal-lovers', sub: 'Cats' },
  'family': { cat: 'family-friendship', sub: 'Family' },
  'general': { cat: 'life-journeys-transitions', sub: 'Just Because' },
  'newbeginning': { cat: 'life-journeys-transitions', sub: 'New Home' },
  'newbeginnings': { cat: 'life-journeys-transitions', sub: 'New Home' },
  'newhome': { cat: 'life-journeys-transitions', sub: 'New Home' },
  'moving': { cat: 'life-journeys-transitions', sub: 'Moving' },
  'thankyou': { cat: 'life-journeys-transitions', sub: 'Thank You' },
  'graduation': { cat: 'work', sub: 'Graduation' },
  'work': { cat: 'work', sub: 'New Job' },
  'sports': { cat: 'sports', sub: 'Soccer' },
  'gym': { cat: 'sports', sub: 'Gym' },
  'yoga': { cat: 'sports', sub: 'Yoga' },
};

function getAllMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMp4Files(fullPath));
    } else if (entry.name.endsWith(".mp4") || entry.name.endsWith(".MP4")) {
      results.push(fullPath);
    }
  }
  
  return results;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function classifyFromFilename(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.split("_");
  
  const lastPart = parts[parts.length - 1];
  const isValue = /^[0-9]+[A-Z]$/i.test(lastPart);
  
  const value = isValue ? lastPart.toUpperCase() : "1A";
  const nameParts = isValue ? parts.slice(0, -1) : parts;
  
  const object = capitalize(nameParts[0] || "Unknown");
  
  const foundCategories = new Set();
  const foundSubcategories = new Set();
  
  for (const part of nameParts) {
    const normalized = part.toLowerCase();
    if (CATEGORY_MAP[normalized]) {
      foundCategories.add(CATEGORY_MAP[normalized].cat);
      foundSubcategories.add(CATEGORY_MAP[normalized].sub);
    }
  }
  
  if (foundCategories.size === 0) {
    foundCategories.add('life-journeys-transitions');
    foundSubcategories.add('Just Because');
  }
  
  return {
    object,
    categories: [...foundCategories],
    subcategories: [...foundSubcategories],
    value,
    searchTerms: nameParts.map(p => p.toLowerCase()),
  };
}

function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🚀 Generador FLEXIBLE\n");
  console.log(`📁 Carpeta: ${videosRoot}\n`);
  
  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
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
    const urlPath = "/" + relativePath.replaceAll("\\", "/");
    const basename = path.basename(filePath);
    const nameWithoutExt = basename.replace(/\.(mp4|MP4)$/, "");
    
    const classification = classifyFromFilename(basename);
    
    const videoData = {
      name: nameWithoutExt,
      file: urlPath,
      object: classification.object,
      categories: classification.categories,
      subcategories: classification.subcategories,
      value: classification.value,
      slug: nameWithoutExt.toLowerCase(),
      searchTerms: classification.searchTerms,
    };
    
    console.log(`✅ ${videoData.name}`);
    console.log(`   🎨 Object: ${videoData.object}`);
    console.log(`   📂 Categories: ${videoData.categories.join(", ")}`);
    console.log(`   🏷️  Subcategories: ${videoData.subcategories.join(", ")}`);
    console.log(`   🔍 Search: ${videoData.searchTerms.join(", ")}`);
    console.log("");
    
    return videoData;
  });
  
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos\n`);
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
