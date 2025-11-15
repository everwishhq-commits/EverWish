#!/usr/bin/env node
/**
 * 🚀 GENERADOR DE INDEX V18.0 - NOMBRES DESCRIPTIVOS COMPLETOS
 * Sincronizado con classification-system.js V18
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 MAPEO DIRECTO CON NOMBRES DESCRIPTIVOS COMPLETOS
const CATEGORY_MAP = {
  // Holidays
  'halloween': { cat: 'seasonal-global-celebrations', sub: 'Halloween Celebration' },
  'christmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas Celebration' },
  'xmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas Celebration' },
  'thanksgiving': { cat: 'seasonal-global-celebrations', sub: 'Thanksgiving Celebration' },
  'easter': { cat: 'seasonal-global-celebrations', sub: 'Easter Celebration' },
  'newyear': { cat: 'seasonal-global-celebrations', sub: 'New Year Celebration' },
  'valentine': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day Celebration" },
  'valentines': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day Celebration" },
  'july4': { cat: 'seasonal-global-celebrations', sub: 'Independence Day Celebration' },
  'mothersday': { cat: 'seasonal-global-celebrations', sub: "Mother's Day Celebration" },
  'fathersday': { cat: 'seasonal-global-celebrations', sub: "Father's Day Celebration" },
  'stpatricks': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day Celebration" },
  'spring': { cat: 'seasonal-global-celebrations', sub: 'Spring Season' },
  'summer': { cat: 'seasonal-global-celebrations', sub: 'Summer Season' },
  'fall': { cat: 'seasonal-global-celebrations', sub: 'Fall Season' },
  'autumn': { cat: 'seasonal-global-celebrations', sub: 'Fall Season' },
  'winter': { cat: 'seasonal-global-celebrations', sub: 'Winter Season' },
  
  // Celebrations
  'birthday': { cat: 'birthdays-celebrations', sub: 'Birthday Celebration' },
  'party': { cat: 'birthdays-celebrations', sub: 'Party Celebration' },
  'surprise': { cat: 'birthdays-celebrations', sub: 'Surprise Party Celebration' },
  'sweet16': { cat: 'birthdays-celebrations', sub: 'Sweet 16 Celebration' },
  
  // Love & Romance
  'love': { cat: 'love-weddings-anniversaries', sub: 'Love & Affection' },
  'hugs': { cat: 'love-weddings-anniversaries', sub: 'Warm Hugs' },
  'romance': { cat: 'love-weddings-anniversaries', sub: 'Romantic Moments' },
  'romantic': { cat: 'love-weddings-anniversaries', sub: 'Romantic Moments' },
  'wedding': { cat: 'love-weddings-anniversaries', sub: 'Wedding Celebration' },
  'anniversary': { cat: 'love-weddings-anniversaries', sub: 'Anniversary Celebration' },
  
  // Family & Friendship
  'family': { cat: 'family-friendship', sub: "Mother's Day Celebration" },
  'mother': { cat: 'family-friendship', sub: "Mother's Day Celebration" },
  'mothers': { cat: 'family-friendship', sub: "Mother's Day Celebration" },
  'father': { cat: 'family-friendship', sub: "Father's Day Celebration" },
  'fathers': { cat: 'family-friendship', sub: "Father's Day Celebration" },
  'parents': { cat: 'family-friendship', sub: 'Parents Appreciation' },
  'friends': { cat: 'family-friendship', sub: 'Friends Forever' },
  'bestfriends': { cat: 'family-friendship', sub: 'Best Friends Bond' },
  
  // Work
  'work': { cat: 'work', sub: 'New Job Celebration' },
  'graduation': { cat: 'work', sub: 'Graduation Celebration' },
  'newjob': { cat: 'work', sub: 'New Job Celebration' },
  'promotion': { cat: 'work', sub: 'Promotion Celebration' },
  'retirement': { cat: 'work', sub: 'Retirement Celebration' },
  'school': { cat: 'work', sub: 'School Achievement' },
  
  // Babies
  'baby': { cat: 'babies-parenting', sub: 'Newborn Arrival' },
  'newborn': { cat: 'babies-parenting', sub: 'Newborn Arrival' },
  'babyshower': { cat: 'babies-parenting', sub: 'Baby Shower Celebration' },
  'pregnancy': { cat: 'babies-parenting', sub: 'Pregnancy Announcement' },
  'momlife': { cat: 'babies-parenting', sub: 'Mom Life Moment' },
  'dadlife': { cat: 'babies-parenting', sub: 'Dad Life Moment' },
  
  // Pets & Animals - NOMBRES DESCRIPTIVOS COMPLETOS
  'pets': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'pet': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'dog': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'dogs': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'cat': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'cats': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'furry': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'companions': { cat: 'pets-animal-lovers', sub: 'Household Friends' },
  'loyal': { cat: 'pets-animal-lovers', sub: 'Loyal Sidekicks' },
  'petcelebration': { cat: 'pets-animal-lovers', sub: 'Pet Celebration Moments' },
  'adopted': { cat: 'pets-animal-lovers', sub: 'Adopted with Love' },
  'farm': { cat: 'pets-animal-lovers', sub: 'Barnyard Companions' },
  'farmanimals': { cat: 'pets-animal-lovers', sub: 'Barnyard Companions' },
  'sea': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'seaanimals': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'ocean': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'marine': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'flying': { cat: 'pets-animal-lovers', sub: 'Wings in Motion' },
  'flyinganimals': { cat: 'pets-animal-lovers', sub: 'Wings in Motion' },
  'birds': { cat: 'pets-animal-lovers', sub: 'Wings in Motion' },
  'wild': { cat: 'pets-animal-lovers', sub: 'Amazing Life' },
  'wildlife': { cat: 'pets-animal-lovers', sub: 'Amazing Life' },
  'wildanimals': { cat: 'pets-animal-lovers', sub: 'Amazing Life' },
  
  // Support
  'getwell': { cat: 'support-healing-care', sub: 'Get Well Wishes' },
  'thinkingofyou': { cat: 'support-healing-care', sub: 'Thinking of You Message' },
  'sympathy': { cat: 'support-healing-care', sub: 'Condolence Message' },
  'condolences': { cat: 'support-healing-care', sub: 'Condolence Message' },
  
  // Diversity
  'diversity': { cat: 'hear-every-heart', sub: 'Inclusivity & Belonging' },
  'inclusivity': { cat: 'hear-every-heart', sub: 'Inclusivity & Belonging' },
  'unity': { cat: 'hear-every-heart', sub: 'Unity & Harmony' },
  'peace': { cat: 'hear-every-heart', sub: 'Peace & Balance' },
  
  // Sports
  'sports': { cat: 'sports', sub: 'Team Sports Energy' },
  'gym': { cat: 'sports', sub: 'Gym & Training' },
  'fitness': { cat: 'sports', sub: 'Gym & Training' },
  'yoga': { cat: 'sports', sub: 'Yoga & Balance' },
  'soccer': { cat: 'sports', sub: 'Team Sports Energy' },
  'basketball': { cat: 'sports', sub: 'Team Sports Energy' },
  'football': { cat: 'sports', sub: 'Team Sports Energy' },
  
  // Wellness
  'wellness': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'selfcare': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'meditation': { cat: 'wellness-mindful-living', sub: 'Meditation Practice' },
  
  // Life Journeys - NOMBRES DESCRIPTIVOS COMPLETOS
  'newhome': { cat: 'life-journeys-transitions', sub: 'New Home Celebration' },
  'moving': { cat: 'life-journeys-transitions', sub: 'Moving to a New Place' },
  'housewarming': { cat: 'life-journeys-transitions', sub: 'Housewarming Moment' },
  'freshstart': { cat: 'life-journeys-transitions', sub: 'Fresh Start Journey' },
  'newchapter': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'newbeginning': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'newbeginnings': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'thankyou': { cat: 'life-journeys-transitions', sub: 'Thank You Message' },
  'justbecause': { cat: 'life-journeys-transitions', sub: 'Just Because Moment' },
  'outdoor': { cat: 'life-journeys-transitions', sub: 'Outdoor Adventure Moment' },
  'nature': { cat: 'life-journeys-transitions', sub: 'Nature Escape Journey' },
  'landscape': { cat: 'life-journeys-transitions', sub: 'Beautiful Landscape Scene' },
  
  // General
  'general': { cat: 'life-journeys-transitions', sub: 'Just Because Moment' },
};

// 🔍 Función para encontrar archivos .mp4
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

// 📝 Capitalizar
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 🎯 Clasificar desde nombre
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
    foundSubcategories.add('Just Because Moment');
  }
  
  return {
    object,
    categories: [...foundCategories],
    subcategories: [...foundSubcategories],
    value,
    searchTerms: nameParts.map(p => p.toLowerCase()),
  };
}

// 🚀 Función principal
function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🚀 Generador de Index V18.0 - NOMBRES DESCRIPTIVOS\n");
  console.log(`📁 Carpeta: ${videosRoot}\n`);
  
  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
    process.exit(1);
  }
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📹 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️ No se encontraron archivos .mp4");
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
    console.log("");
    
    return videoData;
  });
  
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
    version: "18.0",
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos`);
  console.log(`🎯 Versión: 18.0 - NOMBRES DESCRIPTIVOS COMPLETOS\n`);
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
