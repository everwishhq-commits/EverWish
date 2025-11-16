#!/usr/bin/env node
/**
 * 🚀 GENERADOR V15.0 - COMPLETO Y FUNCIONAL
 * Incluye TODAS las subcategorías
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📋 MAPA COMPLETO DE CATEGORÍAS Y SUBCATEGORÍAS
const CATEGORY_MAP = {
  // HOLIDAYS
  'halloween': { cat: 'seasonal-global-celebrations', sub: 'Halloween' },
  'thanksgiving': { cat: 'seasonal-global-celebrations', sub: 'Thanksgiving' },
  'christmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'xmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'easter': { cat: 'seasonal-global-celebrations', sub: 'Easter' },
  'newyear': { cat: 'seasonal-global-celebrations', sub: 'New Year' },
  'stpatrick': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day" },
  'stpatricks': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day" },
  'stpatricksday': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day" },
  'cincodemayo': { cat: 'seasonal-global-celebrations', sub: 'Cinco de Mayo' },
  'valentinesday': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'valentine': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'valentines': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'july4': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
  'independenceday': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
  'mothersday': { cat: 'seasonal-global-celebrations', sub: "Mother's Day" },
  'fathersday': { cat: 'seasonal-global-celebrations', sub: "Father's Day" },
  'hanukkah': { cat: 'seasonal-global-celebrations', sub: 'Hanukkah' },
  'diwali': { cat: 'seasonal-global-celebrations', sub: 'Diwali' },
  'ramadan': { cat: 'seasonal-global-celebrations', sub: 'Ramadan' },
  'eid': { cat: 'seasonal-global-celebrations', sub: 'Eid' },
  'passover': { cat: 'seasonal-global-celebrations', sub: 'Passover' },
  'dayofthedead': { cat: 'seasonal-global-celebrations', sub: 'Day of the Dead' },
  'kwanzaa': { cat: 'seasonal-global-celebrations', sub: 'Kwanzaa' },
  'oktoberfest': { cat: 'seasonal-global-celebrations', sub: 'Oktoberfest' },
  'veteransday': { cat: 'seasonal-global-celebrations', sub: 'Veterans Day' },
  'memorialday': { cat: 'seasonal-global-celebrations', sub: 'Memorial Day' },
  'mlkday': { cat: 'seasonal-global-celebrations', sub: 'MLK Day' },
  'presidentsday': { cat: 'seasonal-global-celebrations', sub: "Presidents' Day" },
  'laborday': { cat: 'seasonal-global-celebrations', sub: 'Labor Day' },
  'blackfriday': { cat: 'seasonal-global-celebrations', sub: 'Black Friday' },
  'cybermonday': { cat: 'seasonal-global-celebrations', sub: 'Cyber Monday' },
  'spring': { cat: 'seasonal-global-celebrations', sub: 'Spring' },
  'summer': { cat: 'seasonal-global-celebrations', sub: 'Summer' },
  'fall': { cat: 'seasonal-global-celebrations', sub: 'Fall' },
  'autumn': { cat: 'seasonal-global-celebrations', sub: 'Fall' },
  'winter': { cat: 'seasonal-global-celebrations', sub: 'Winter' },

  // BIRTHDAYS & CELEBRATIONS
  'birthday': { cat: 'birthdays-celebrations', sub: 'Birthday Celebration' },
  'party': { cat: 'birthdays-celebrations', sub: 'Party Celebration' },
  'babyshower': { cat: 'birthdays-celebrations', sub: 'Baby Shower' },
  'bridalshower': { cat: 'birthdays-celebrations', sub: 'Bridal Shower Celebration' },
  'genderreveal': { cat: 'birthdays-celebrations', sub: 'Gender Reveal' },

  // LOVE & ROMANCE
  'love': { cat: 'love-weddings-anniversaries', sub: 'Love & Affection' },
  'hugs': { cat: 'love-weddings-anniversaries', sub: 'Warm Hugs' },
  'romance': { cat: 'love-weddings-anniversaries', sub: 'Romantic Moments' },
  'wedding': { cat: 'love-weddings-anniversaries', sub: 'Wedding Celebration' },
  'engagement': { cat: 'love-weddings-anniversaries', sub: 'Engagement Moment' },
  'anniversary': { cat: 'love-weddings-anniversaries', sub: 'Anniversary Celebration' },

  // FAMILY & FRIENDSHIP
  'family': { cat: 'family-friendship', sub: 'Family Time Together' },
  'friends': { cat: 'family-friendship', sub: 'Friends Forever' },
  'bestfriends': { cat: 'family-friendship', sub: 'Best Friends Bond' },
  'bff': { cat: 'family-friendship', sub: 'BFF Connection' },

  // WORK
  'newjob': { cat: 'work', sub: 'New Job Celebration' },
  'promotion': { cat: 'work', sub: 'Promotion Celebration' },
  'retirement': { cat: 'work', sub: 'Retirement Celebration' },
  'graduation': { cat: 'work', sub: 'Graduation Celebration' },

  // BABIES & PARENTING
  'baby': { cat: 'babies-parenting', sub: 'New Baby Celebration' },
  'newborn': { cat: 'babies-parenting', sub: 'Newborn Arrival' },
  'pregnancy': { cat: 'babies-parenting', sub: 'Pregnancy Announcement' },

  // PETS & ANIMALS
  'pets': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'dogs': { cat: 'pets-animal-lovers', sub: 'Household Friends' },
  'cats': { cat: 'pets-animal-lovers', sub: 'Loyal Sidekicks' },
  'farmanimals': { cat: 'pets-animal-lovers', sub: 'Barnyard Companions' },
  'seaanimals': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'flyinganimals': { cat: 'pets-animal-lovers', sub: 'Wings in Motion' },
  'wildanimals': { cat: 'pets-animal-lovers', sub: 'Amazing Life' },

  // SUPPORT
  'getwell': { cat: 'support-healing-care', sub: 'Get Well Wishes' },
  'thinkingofyou': { cat: 'support-healing-care', sub: 'Thinking of You Message' },
  'condolences': { cat: 'support-healing-care', sub: 'Condolence Message' },
  'sympathy': { cat: 'support-healing-care', sub: 'Loss & Healing' },

  // CONNECTION
  'diversity': { cat: 'hear-every-heart', sub: 'Inclusivity & Belonging' },
  'pride': { cat: 'hear-every-heart', sub: 'Pride Celebration' },
  'sorry': { cat: 'hear-every-heart', sub: "I'm Sorry Message" },
  'missingyou': { cat: 'hear-every-heart', sub: 'Missing You Moment' },

  // SPORTS
  'sports': { cat: 'sports', sub: 'Team Sports Energy' },
  'gym': { cat: 'sports', sub: 'Healthy Movement Habit' },
  'yoga': { cat: 'sports', sub: 'Yoga & Balance Flow' },

  // WELLNESS
  'wellness': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'selfcare': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'meditation': { cat: 'wellness-mindful-living', sub: 'Meditation Practice' },

  // LIFE JOURNEYS
  'newhome': { cat: 'life-journeys-transitions', sub: 'New Home Celebration' },
  'moving': { cat: 'life-journeys-transitions', sub: 'Moving to a New Place' },
  'newbeginning': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'thankyou': { cat: 'life-journeys-transitions', sub: 'Thank You Message' },
  'justbecause': { cat: 'life-journeys-transitions', sub: 'Just Because Moment' },
  'nature': { cat: 'life-journeys-transitions', sub: 'Beautiful Landscape Scene' },
};

const OBJECT_KEYWORDS = new Set([
  'zombie', 'zombies', 'ghost', 'ghosts', 'pumpkin', 'pumpkins',
  'turkey', 'turkeys', 'santa', 'reindeer', 'snowman', 'snowmen',
  'bunny', 'bunnies', 'egg', 'eggs', 'heart', 'hearts', 'rose', 'roses',
  'cake', 'cakes', 'balloon', 'balloons', 'gift', 'gifts',
  'turtle', 'turtles', 'fish', 'shark', 'cow', 'horse', 'pig',
  'bird', 'eagle', 'parrot', 'lion', 'tiger', 'bear',
  'leprechaun', 'shamrock', 'clover',
]);

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

function normalize(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\da-z]/g, "");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function classifyFromFilename(filename) {
  const basename = filename.replace(/\.mp4$/i, "");
  const parts = basename.split("_");
  
  const lastPart = parts[parts.length - 1];
  const isVariant = /^[0-9]+[A-Z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  const nameParts = isVariant ? parts.slice(0, -1) : parts;
  
  let object = capitalize(nameParts[0] || "Unknown");
  for (const part of nameParts) {
    const normalized = normalize(part);
    if (OBJECT_KEYWORDS.has(normalized)) {
      object = capitalize(part);
      break;
    }
    if (!CATEGORY_MAP[normalized]) {
      object = capitalize(part);
      break;
    }
  }
  
  const foundCategories = new Set();
  const foundSubcategories = new Set();
  const searchTerms = new Set();
  
  for (let i = 0; i < nameParts.length; i++) {
    const part = nameParts[i];
    const normalized = normalize(part);
    searchTerms.add(normalized);
    
    if (OBJECT_KEYWORDS.has(normalized)) continue;
    
    if (CATEGORY_MAP[normalized]) {
      foundCategories.add(CATEGORY_MAP[normalized].cat);
      foundSubcategories.add(CATEGORY_MAP[normalized].sub);
    }
    
    if (i < nameParts.length - 1) {
      const combined = normalize(part + nameParts[i + 1]);
      searchTerms.add(combined);
      
      if (CATEGORY_MAP[combined]) {
        foundCategories.add(CATEGORY_MAP[combined].cat);
        foundSubcategories.add(CATEGORY_MAP[combined].sub);
      }
      
      if (i < nameParts.length - 2) {
        const combined3 = normalize(part + nameParts[i + 1] + nameParts[i + 2]);
        searchTerms.add(combined3);
        
        if (CATEGORY_MAP[combined3]) {
          foundCategories.add(CATEGORY_MAP[combined3].cat);
          foundSubcategories.add(CATEGORY_MAP[combined3].sub);
        }
      }
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
    variant,
    searchTerms: [...searchTerms],
  };
}

function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🚀 Generador V15.0 - FIXED\n");
  console.log(`📁 Carpeta: ${videosRoot}\n`);
  
  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: ${videosRoot} no existe`);
    process.exit(1);
  }
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📹 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️  No se encontraron archivos .mp4");
    const emptyIndex = {
      videos: [],
      generated: new Date().toISOString(),
      total: 0,
    };
    fs.writeFileSync(indexFile, JSON.stringify(emptyIndex, null, 2), "utf8");
    return;
  }
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replaceAll("\\", "/");
    const basename = path.basename(filePath);
    const nameWithoutExt = basename.replace(/\.mp4$/i, "");
    
    const classification = classifyFromFilename(basename);
    
    return {
      name: nameWithoutExt,
      file: urlPath,
      object: classification.object,
      categories: classification.categories,
      subcategories: classification.subcategories,
      variant: classification.variant,
      slug: nameWithoutExt.toLowerCase(),
      searchTerms: classification.searchTerms,
    };
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
