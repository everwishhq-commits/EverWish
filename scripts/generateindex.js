#!/usr/bin/env node
/**
 * 🚀 GENERADOR V14 - Sincronizado con Classification System V13.1
 * Actualizado con nombres descriptivos y estructura completa
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📋 MAPA COMPLETO DE CATEGORÍAS Y SUBCATEGORÍAS
const CATEGORY_MAP = {
  // 🎉 HOLIDAYS (seasonal-global-celebrations)
  'halloween': { cat: 'seasonal-global-celebrations', sub: 'Halloween' },
  'thanksgiving': { cat: 'seasonal-global-celebrations', sub: 'Thanksgiving' },
  'christmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'xmas': { cat: 'seasonal-global-celebrations', sub: 'Christmas' },
  'easter': { cat: 'seasonal-global-celebrations', sub: 'Easter' },
  'newyear': { cat: 'seasonal-global-celebrations', sub: 'New Year' },
  'stpatricksday': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day" },
  'stpatrick': { cat: 'seasonal-global-celebrations', sub: "St Patrick's Day" },
  'cincodemayo': { cat: 'seasonal-global-celebrations', sub: 'Cinco de Mayo' },
  'valentinesday': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'valentine': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'valentines': { cat: 'seasonal-global-celebrations', sub: "Valentine's Day" },
  'independenceday': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
  'july4': { cat: 'seasonal-global-celebrations', sub: 'Independence Day' },
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
  'spring': { cat: 'seasonal-global-celebrations', sub: 'Spring' },
  'summer': { cat: 'seasonal-global-celebrations', sub: 'Summer' },
  'fall': { cat: 'seasonal-global-celebrations', sub: 'Fall' },
  'autumn': { cat: 'seasonal-global-celebrations', sub: 'Fall' },
  'winter': { cat: 'seasonal-global-celebrations', sub: 'Winter' },

  // 🎂 CELEBRATIONS (birthdays-celebrations)
  'birthday': { cat: 'birthdays-celebrations', sub: 'Birthday Celebration' },
  'firstbirthday': { cat: 'birthdays-celebrations', sub: 'First Birthday' },
  'quinceanera': { cat: 'birthdays-celebrations', sub: 'Quinceañera' },
  'sweet16': { cat: 'birthdays-celebrations', sub: 'Sweet 16' },
  '18thbirthday': { cat: 'birthdays-celebrations', sub: '18th Birthday' },
  '21stbirthday': { cat: 'birthdays-celebrations', sub: '21st Birthday' },
  '30thbirthday': { cat: 'birthdays-celebrations', sub: '30th Birthday' },
  '40thbirthday': { cat: 'birthdays-celebrations', sub: '40th Birthday' },
  '50thbirthday': { cat: 'birthdays-celebrations', sub: '50th Birthday' },
  'party': { cat: 'birthdays-celebrations', sub: 'Party Celebration' },
  'surprise': { cat: 'birthdays-celebrations', sub: 'Surprise Party' },
  'babyshower': { cat: 'birthdays-celebrations', sub: 'Baby Shower' },
  'bridalshower': { cat: 'birthdays-celebrations', sub: 'Bridal Shower Celebration' },
  'genderreveal': { cat: 'birthdays-celebrations', sub: 'Gender Reveal' },

  // 💝 LOVE & ROMANCE (love-weddings-anniversaries)
  'love': { cat: 'love-weddings-anniversaries', sub: 'Love & Affection' },
  'hugs': { cat: 'love-weddings-anniversaries', sub: 'Warm Hugs' },
  'romance': { cat: 'love-weddings-anniversaries', sub: 'Romantic Moments' },
  'iloveyou': { cat: 'love-weddings-anniversaries', sub: 'I Love You Message' },
  'firstdate': { cat: 'love-weddings-anniversaries', sub: 'First Date Memory' },
  'wedding': { cat: 'love-weddings-anniversaries', sub: 'Wedding Celebration' },
  'engagement': { cat: 'love-weddings-anniversaries', sub: 'Engagement Moment' },
  'proposal': { cat: 'love-weddings-anniversaries', sub: 'Proposal Moment' },
  'bachelorparty': { cat: 'love-weddings-anniversaries', sub: 'Bachelor Party Celebration' },
  'bacheloretteparty': { cat: 'love-weddings-anniversaries', sub: 'Bachelorette Party Celebration' },
  'anniversary': { cat: 'love-weddings-anniversaries', sub: 'Anniversary Celebration' },
  'paperanniversary': { cat: 'love-weddings-anniversaries', sub: 'Paper Anniversary Celebration' },
  'silveranniversary': { cat: 'love-weddings-anniversaries', sub: 'Silver Anniversary Celebration' },
  'goldenanniversary': { cat: 'love-weddings-anniversaries', sub: 'Golden Anniversary Celebration' },

  // 🫶 FAMILY & FRIENDSHIP (family-friendship)
  'family': { cat: 'family-friendship', sub: 'Family Time Together' },
  'mother': { cat: 'family-friendship', sub: "Mother's Day Celebration" },
  'father': { cat: 'family-friendship', sub: "Father's Day Celebration" },
  'parents': { cat: 'family-friendship', sub: 'Parents Appreciation' },
  'grandparents': { cat: 'family-friendship', sub: 'Grandparents Day Celebration' },
  'siblings': { cat: 'family-friendship', sub: 'Siblings Day Celebration' },
  'friends': { cat: 'family-friendship', sub: 'Friends Forever' },
  'bestfriends': { cat: 'family-friendship', sub: 'Best Friends Bond' },
  'friendship': { cat: 'family-friendship', sub: 'Friendship Day Celebration' },
  'bff': { cat: 'family-friendship', sub: 'BFF Connection' },

  // 💼 WORK (work)
  'newjob': { cat: 'work', sub: 'New Job Celebration' },
  'promotion': { cat: 'work', sub: 'Promotion Celebration' },
  'retirement': { cat: 'work', sub: 'Retirement Celebration' },
  'workanniversary': { cat: 'work', sub: 'Work Anniversary Celebration' },
  'career': { cat: 'work', sub: 'Career Success Moment' },
  'appreciation': { cat: 'work', sub: 'Appreciation Day Tribute' },
  'graduation': { cat: 'work', sub: 'Graduation Celebration' },
  'school': { cat: 'work', sub: 'School Achievement' },
  'highschool': { cat: 'work', sub: 'High School Graduation' },
  'college': { cat: 'work', sub: 'College Graduation' },
  'backtoschool': { cat: 'work', sub: 'Back to School Moment' },

  // 🧸 BABIES & PARENTING (babies-parenting)
  'newborn': { cat: 'babies-parenting', sub: 'Newborn Arrival' },
  'baby': { cat: 'babies-parenting', sub: 'New Baby Celebration' },
  'pregnancy': { cat: 'babies-parenting', sub: 'Pregnancy Announcement' },
  'itsaboy': { cat: 'babies-parenting', sub: "It's a Boy Announcement" },
  'itsagirl': { cat: 'babies-parenting', sub: "It's a Girl Announcement" },
  'twins': { cat: 'babies-parenting', sub: 'Twins Announcement' },
  'momlife': { cat: 'babies-parenting', sub: 'Mom Life Moment' },
  'dadlife': { cat: 'babies-parenting', sub: 'Dad Life Moment' },
  'adoption': { cat: 'babies-parenting', sub: 'Adoption Journey' },
  'fostercare': { cat: 'babies-parenting', sub: 'Foster Care Love' },
  'newparents': { cat: 'babies-parenting', sub: 'New Parents Celebration' },

  // 🐾 ANIMAL LOVERS (pets-animal-lovers)
  'pets': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'furryfriends': { cat: 'pets-animal-lovers', sub: 'Furry Companions' },
  'dogs': { cat: 'pets-animal-lovers', sub: 'Household Friends' },
  'cats': { cat: 'pets-animal-lovers', sub: 'Loyal Sidekicks' },
  'petcelebration': { cat: 'pets-animal-lovers', sub: 'Pet Celebration Moments' },
  'adopted': { cat: 'pets-animal-lovers', sub: 'Adopted with Love' },
  'farmanimals': { cat: 'pets-animal-lovers', sub: 'Barnyard Companions' },
  'seaanimals': { cat: 'pets-animal-lovers', sub: 'Underwater Universe' },
  'flyinganimals': { cat: 'pets-animal-lovers', sub: 'Wings in Motion' },
  'wildanimals': { cat: 'pets-animal-lovers', sub: 'Amazing Life' },

  // 🕊️ SUPPORT (support-healing-care)
  'getwell': { cat: 'support-healing-care', sub: 'Get Well Wishes' },
  'thinkingofyou': { cat: 'support-healing-care', sub: 'Thinking of You Message' },
  'staystrong': { cat: 'support-healing-care', sub: 'Stay Strong Motivation' },
  'cheerup': { cat: 'support-healing-care', sub: 'Cheer Up Message' },
  'yougotthis': { cat: 'support-healing-care', sub: "You've Got This Inspiration" },
  'condolence': { cat: 'support-healing-care', sub: 'Condolence Message' },
  'condolences': { cat: 'support-healing-care', sub: 'Condolence Message' },
  'loss': { cat: 'support-healing-care', sub: 'Loss & Healing' },
  'memory': { cat: 'support-healing-care', sub: 'In Loving Memory' },
  'sympathy': { cat: 'support-healing-care', sub: 'With Deepest Sympathy' },

  // 🧩 CONNECTION (hear-every-heart)
  'diversity': { cat: 'hear-every-heart', sub: 'Inclusivity & Belonging' },
  'unity': { cat: 'hear-every-heart', sub: 'Unity & Harmony' },
  'peace': { cat: 'hear-every-heart', sub: 'Peace & Balance' },
  'pride': { cat: 'hear-every-heart', sub: 'Pride Celebration' },
  'equality': { cat: 'hear-every-heart', sub: 'Equality for All' },
  'acceptance': { cat: 'hear-every-heart', sub: 'Acceptance & Respect' },
  'immigration': { cat: 'hear-every-heart', sub: 'Immigration Journey' },
  'disability': { cat: 'hear-every-heart', sub: 'Disability Awareness Tribute' },
  'autism': { cat: 'hear-every-heart', sub: 'Autism Awareness Day' },
  'mentalhealth': { cat: 'hear-every-heart', sub: 'Mental Health Awareness' },
  'cancer': { cat: 'hear-every-heart', sub: 'Cancer Awareness' },
  'afroheritage': { cat: 'hear-every-heart', sub: 'Afro Heritage Pride' },
  'hispanicheritage': { cat: 'hear-every-heart', sub: 'Hispanic Heritage Pride' },
  'imsorry': { cat: 'hear-every-heart', sub: "I'm Sorry Message" },
  'forgiveme': { cat: 'hear-every-heart', sub: 'Forgive Me Note' },
  'missingyou': { cat: 'hear-every-heart', sub: 'Missing You Moment' },
  'yourespecial': { cat: 'hear-every-heart', sub: "You're Special Message" },
  'youmatter': { cat: 'hear-every-heart', sub: 'You Matter Reminder' },

  // 🏟️ SPORTS (sports)
  'sports': { cat: 'sports', sub: 'Team Sports Energy' },
  'championship': { cat: 'sports', sub: 'Championship Moment' },
  'victory': { cat: 'sports', sub: 'Victory Celebration' },
  'fitness': { cat: 'sports', sub: 'Fitness & Training Journey' },
  'gym': { cat: 'sports', sub: 'Healthy Movement Habit' },
  'endurance': { cat: 'sports', sub: 'Endurance Sports Challenge' },
  'yoga': { cat: 'sports', sub: 'Yoga & Balance Flow' },
  'dance': { cat: 'sports', sub: 'Dance & Rhythm Energy' },
  'martialarts': { cat: 'sports', sub: 'Martial Arts Flow' },

  // 🕯️ WELLNESS (wellness-mindful-living)
  'wellness': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'selfcare': { cat: 'wellness-mindful-living', sub: 'Self-Care Routine' },
  'meditation': { cat: 'wellness-mindful-living', sub: 'Meditation Practice' },
  'mindfulness': { cat: 'wellness-mindful-living', sub: 'Mindfulness Moment' },
  'innerpeace': { cat: 'wellness-mindful-living', sub: 'Inner Peace Journey' },
  'mentalbalance': { cat: 'wellness-mindful-living', sub: 'Mental Health Balance' },
  'spa': { cat: 'wellness-mindful-living', sub: 'Spa Day Relaxation' },
  'healthy': { cat: 'wellness-mindful-living', sub: 'Healthy Lifestyle Choice' },
  'fitnessjourney': { cat: 'wellness-mindful-living', sub: 'Fitness Journey Path' },
  'weightloss': { cat: 'wellness-mindful-living', sub: 'Weight Loss Success Story' },
  'quitsmoking': { cat: 'wellness-mindful-living', sub: 'Quit Smoking Journey' },

  // 🏕️ NATURE & LIFE JOURNEYS (life-journeys-transitions)
  'newhome': { cat: 'life-journeys-transitions', sub: 'New Home Celebration' },
  'moving': { cat: 'life-journeys-transitions', sub: 'Moving to a New Place' },
  'housewarming': { cat: 'life-journeys-transitions', sub: 'Housewarming Moment' },
  'freshstart': { cat: 'life-journeys-transitions', sub: 'Fresh Start Journey' },
  'newbeginning': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'newbeginnings': { cat: 'life-journeys-transitions', sub: 'New Chapter Beginning' },
  'thankyou': { cat: 'life-journeys-transitions', sub: 'Thank You Message' },
  'justbecause': { cat: 'life-journeys-transitions', sub: 'Just Because Moment' },
  'congratulations': { cat: 'life-journeys-transitions', sub: 'Congratulations Celebration' },
  'congrats': { cat: 'life-journeys-transitions', sub: 'Congratulations Celebration' },
  'goodluck': { cat: 'life-journeys-transitions', sub: 'Good Luck Wish' },
  'safetravels': { cat: 'life-journeys-transitions', sub: 'Safe Travels Message' },
  'welcome': { cat: 'life-journeys-transitions', sub: 'Warm Welcome Greeting' },
  'outdoor': { cat: 'life-journeys-transitions', sub: 'Outdoor Adventure Moment' },
  'nature': { cat: 'life-journeys-transitions', sub: 'Beautiful Landscape Scene' },
  'natureescape': { cat: 'life-journeys-transitions', sub: 'Nature Escape Journey' },
  'general': { cat: 'life-journeys-transitions', sub: 'Just Because Moment' },
};

// ⚠️ OBJETOS ESPECÍFICOS (NO son categorías)
const OBJECT_KEYWORDS = new Set([
  'zombie', 'zombies', 'ghost', 'ghosts', 'pumpkin', 'pumpkins',
  'turkey', 'turkeys', 'santa', 'reindeer', 'snowman', 'snowmen',
  'bunny', 'bunnies', 'egg', 'eggs', 'chick', 'chicks',
  'heart', 'hearts', 'rose', 'roses', 'ring', 'rings',
  'cake', 'cakes', 'balloon', 'balloons', 'gift', 'gifts',
  'turtle', 'turtles', 'fish', 'shark', 'sharks',
  'cow', 'cows', 'horse', 'horses', 'pig', 'pigs',
  'bird', 'birds', 'eagle', 'eagles', 'parrot', 'parrots',
  'lion', 'lions', 'tiger', 'tigers', 'bear', 'bears',
]);

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
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.split("_");
  
  // Detectar variante (ej: 1A, 2B)
  const lastPart = parts[parts.length - 1];
  const isVariant = /^[0-9]+[A-Z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  const nameParts = isVariant ? parts.slice(0, -1) : parts;
  
  // Detectar objeto (primera palabra que NO sea categoría)
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
  
  // Clasificar categorías y subcategorías
  const foundCategories = new Set();
  const foundSubcategories = new Set();
  
  for (const part of nameParts) {
    const normalized = normalize(part);
    
    // Saltar objetos específicos
    if (OBJECT_KEYWORDS.has(normalized)) continue;
    
    // Buscar en mapa
    if (CATEGORY_MAP[normalized]) {
      foundCategories.add(CATEGORY_MAP[normalized].cat);
      foundSubcategories.add(CATEGORY_MAP[normalized].sub);
    }
  }
  
  // Fallback si no encontró nada
  if (foundCategories.size === 0) {
    foundCategories.add('life-journeys-transitions');
    foundSubcategories.add('Just Because Moment');
  }
  
  return {
    object,
    categories: [...foundCategories],
    subcategories: [...foundSubcategories],
    variant,
    searchTerms: nameParts.map(p => normalize(p)),
  };
}

function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🚀 Generador V14 - Sincronizado con Classification System\n");
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
    const nameWithoutExt = basename.replace(/\.(mp4|MP4)$/, "");
    
    const classification = classifyFromFilename(basename);
    
    const videoData = {
      name: nameWithoutExt,
      file: urlPath,
      object: classification.object,
      categories: classification.categories,
      subcategories: classification.subcategories,
      variant: classification.variant,
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
