#!/usr/bin/env node
/**
 * 🚀 GENERADOR DE INDEX V17.0
 * Actualizado con nombres descriptivos completos
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 MAPEO ACTUALIZADO CON NOMBRES DESCRIPTIVOS
const CATEGORY_MAP = {
  // ========== HOLIDAY SEASONS ==========
  'halloween': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Halloween' 
  },
  'christmas': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Christmas' 
  },
  'xmas': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Christmas' 
  },
  'thanksgiving': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Thanksgiving' 
  },
  'easter': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Easter' 
  },
  'newyear': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'New Year' 
  },
  'newyearseve': { 
    cat: 'seasonal-global-celebrations', 
    sub: "New Year's Eve" 
  },
  'lunarnewyear': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Lunar New Year' 
  },
  'chinesenewyear': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Chinese New Year' 
  },
  'stpatricks': { 
    cat: 'seasonal-global-celebrations', 
    sub: "St Patrick's Day" 
  },
  'stpatricksday': { 
    cat: 'seasonal-global-celebrations', 
    sub: "St Patrick's Day" 
  },
  'mardigras': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Mardi Gras' 
  },
  'cincodemayo': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Cinco de Mayo' 
  },

  // ========== CULTURAL & HERITAGE DAYS ==========
  'valentine': { 
    cat: 'seasonal-global-celebrations', 
    sub: "Valentine's Day" 
  },
  'valentines': { 
    cat: 'seasonal-global-celebrations', 
    sub: "Valentine's Day" 
  },
  'valentinesday': { 
    cat: 'seasonal-global-celebrations', 
    sub: "Valentine's Day" 
  },
  'july4': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Independence Day' 
  },
  'fourthofjuly': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Independence Day' 
  },
  'independenceday': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Independence Day' 
  },
  'mothersday': { 
    cat: 'seasonal-global-celebrations', 
    sub: "Mother's Day Celebration" 
  },
  'fathersday': { 
    cat: 'seasonal-global-celebrations', 
    sub: "Father's Day Celebration" 
  },
  'hanukkah': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Hanukkah' 
  },
  'diwali': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Diwali' 
  },
  'ramadan': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Ramadan' 
  },
  'eid': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Eid' 
  },
  'passover': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Passover' 
  },
  'dayofthedead': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Day of the Dead' 
  },
  'kwanzaa': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Kwanzaa' 
  },
  'oktoberfest': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Oktoberfest' 
  },

  // ========== SEASONAL ==========
  'spring': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Spring Season' 
  },
  'summer': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Summer Season' 
  },
  'autumn': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Autumn Season' 
  },
  'fall': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Autumn Season' 
  },
  'winter': { 
    cat: 'seasonal-global-celebrations', 
    sub: 'Winter Season' 
  },

  // ========== BIRTHDAYS & CELEBRATIONS ==========
  'birthday': { 
    cat: 'birthdays-celebrations', 
    sub: 'Birthday Celebration' 
  },
  'happybirthday': { 
    cat: 'birthdays-celebrations', 
    sub: 'Birthday Celebration' 
  },
  'firstbirthday': { 
    cat: 'birthdays-celebrations', 
    sub: 'First Birthday' 
  },
  'quinceanera': { 
    cat: 'birthdays-celebrations', 
    sub: 'Quinceañera' 
  },
  'sweet16': { 
    cat: 'birthdays-celebrations', 
    sub: 'Sweet 16' 
  },
  'party': { 
    cat: 'birthdays-celebrations', 
    sub: 'Party Celebration' 
  },
  'surprise': { 
    cat: 'birthdays-celebrations', 
    sub: 'Surprise Party' 
  },
  'surpriseparty': { 
    cat: 'birthdays-celebrations', 
    sub: 'Surprise Party' 
  },
  'babyshower': { 
    cat: 'birthdays-celebrations', 
    sub: 'Baby Shower Celebration' 
  },
  'bridalshower': { 
    cat: 'birthdays-celebrations', 
    sub: 'Bridal Shower Celebration' 
  },
  'genderreveal': { 
    cat: 'birthdays-celebrations', 
    sub: 'Gender Reveal Celebration' 
  },

  // ========== LOVE & ROMANCE ==========
  'love': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Love & Affection' 
  },
  'romance': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Romantic Moments' 
  },
  'romantic': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Romantic Moments' 
  },
  'hugs': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Warm Hugs' 
  },
  'iloveyou': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'I Love You Message' 
  },
  'firstdate': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'First Date Memory' 
  },
  'wedding': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Wedding Celebration' 
  },
  'engagement': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Engagement Moment' 
  },
  'proposal': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Proposal Moment' 
  },
  'bachelor': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Bachelor Party Celebration' 
  },
  'bachelorette': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Bachelorette Party Celebration' 
  },
  'anniversary': { 
    cat: 'love-weddings-anniversaries', 
    sub: 'Anniversary Celebration' 
  },

  // ========== FAMILY & FRIENDSHIP ==========
  'family': { 
    cat: 'family-friendship', 
    sub: 'Family Time Together' 
  },
  'mother': { 
    cat: 'family-friendship', 
    sub: "Mother's Day Celebration" 
  },
  'mothers': { 
    cat: 'family-friendship', 
    sub: "Mother's Day Celebration" 
  },
  'father': { 
    cat: 'family-friendship', 
    sub: "Father's Day Celebration" 
  },
  'fathers': { 
    cat: 'family-friendship', 
    sub: "Father's Day Celebration" 
  },
  'parents': { 
    cat: 'family-friendship', 
    sub: 'Parents Appreciation' 
  },
  'grandparents': { 
    cat: 'family-friendship', 
    sub: 'Grandparents Day Celebration' 
  },
  'siblings': { 
    cat: 'family-friendship', 
    sub: 'Siblings Day Celebration' 
  },
  'friends': { 
    cat: 'family-friendship', 
    sub: 'Friends Forever' 
  },
  'bestfriends': { 
    cat: 'family-friendship', 
    sub: 'Best Friends Bond' 
  },
  'friendship': { 
    cat: 'family-friendship', 
    sub: 'Friendship Day Celebration' 
  },
  'bff': { 
    cat: 'family-friendship', 
    sub: 'BFF Connection' 
  },

  // ========== WORK & EDUCATION ==========
  'work': { 
    cat: 'work', 
    sub: 'New Job Celebration' 
  },
  'job': { 
    cat: 'work', 
    sub: 'New Job Celebration' 
  },
  'newjob': { 
    cat: 'work', 
    sub: 'New Job Celebration' 
  },
  'promotion': { 
    cat: 'work', 
    sub: 'Promotion Celebration' 
  },
  'retirement': { 
    cat: 'work', 
    sub: 'Retirement Celebration' 
  },
  'graduation': { 
    cat: 'work', 
    sub: 'Graduation Celebration' 
  },
  'graduate': { 
    cat: 'work', 
    sub: 'Graduation Celebration' 
  },
  'school': { 
    cat: 'work', 
    sub: 'School Achievement' 
  },
  'highschool': { 
    cat: 'work', 
    sub: 'High School Graduation' 
  },
  'college': { 
    cat: 'work', 
    sub: 'College Graduation' 
  },
  'university': { 
    cat: 'work', 
    sub: 'College Graduation' 
  },
  'backtoschool': { 
    cat: 'work', 
    sub: 'Back to School Moment' 
  },

  // ========== BABIES & PARENTING ==========
  'baby': { 
    cat: 'babies-parenting', 
    sub: 'Newborn Arrival' 
  },
  'newborn': { 
    cat: 'babies-parenting', 
    sub: 'Newborn Arrival' 
  },
  'newbaby': { 
    cat: 'babies-parenting', 
    sub: 'New Baby Celebration' 
  },
  'pregnancy': { 
    cat: 'babies-parenting', 
    sub: 'Pregnancy Announcement' 
  },
  'pregnant': { 
    cat: 'babies-parenting', 
    sub: 'Pregnancy Announcement' 
  },
  'itsaboy': { 
    cat: 'babies-parenting', 
    sub: "It's a Boy Announcement" 
  },
  'itsagirl': { 
    cat: 'babies-parenting', 
    sub: "It's a Girl Announcement" 
  },
  'twins': { 
    cat: 'babies-parenting', 
    sub: 'Twins Announcement' 
  },
  'momlife': { 
    cat: 'babies-parenting', 
    sub: 'Mom Life Moment' 
  },
  'dadlife': { 
    cat: 'babies-parenting', 
    sub: 'Dad Life Moment' 
  },
  'adoption': { 
    cat: 'babies-parenting', 
    sub: 'Adoption Journey' 
  },
  'fostercare': { 
    cat: 'babies-parenting', 
    sub: 'Foster Care Love' 
  },

  // ========== PETS & ANIMAL LOVERS ==========
  'pets': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'pet': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'dog': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'dogs': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'cat': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'cats': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'furry': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'furryfriends': { 
    cat: 'pets-animal-lovers', 
    sub: 'Furry Companions' 
  },
  'companions': { 
    cat: 'pets-animal-lovers', 
    sub: 'Household Friends' 
  },
  'loyal': { 
    cat: 'pets-animal-lovers', 
    sub: 'Loyal Sidekicks' 
  },
  'petcelebration': { 
    cat: 'pets-animal-lovers', 
    sub: 'Pet Celebration Moments' 
  },
  'adopted': { 
    cat: 'pets-animal-lovers', 
    sub: 'Adopted with Love' 
  },
  'farm': { 
    cat: 'pets-animal-lovers', 
    sub: 'Barnyard Companions' 
  },
  'farmanimals': { 
    cat: 'pets-animal-lovers', 
    sub: 'Barnyard Companions' 
  },
  'barnyard': { 
    cat: 'pets-animal-lovers', 
    sub: 'Barnyard Companions' 
  },
  'ocean': { 
    cat: 'pets-animal-lovers', 
    sub: 'Underwater Universe' 
  },
  'sea': { 
    cat: 'pets-animal-lovers', 
    sub: 'Underwater Universe' 
  },
  'seaanimals': { 
    cat: 'pets-animal-lovers', 
    sub: 'Underwater Universe' 
  },
  'marine': { 
    cat: 'pets-animal-lovers', 
    sub: 'Underwater Universe' 
  },
  'underwater': { 
    cat: 'pets-animal-lovers', 
    sub: 'Underwater Universe' 
  },
  'birds': { 
    cat: 'pets-animal-lovers', 
    sub: 'Wings in Motion' 
  },
  'flying': { 
    cat: 'pets-animal-lovers', 
    sub: 'Wings in Motion' 
  },
  'flyinganimals': { 
    cat: 'pets-animal-lovers', 
    sub: 'Wings in Motion' 
  },
  'wings': { 
    cat: 'pets-animal-lovers', 
    sub: 'Wings in Motion' 
  },
  'wild': { 
    cat: 'pets-animal-lovers', 
    sub: 'Amazing Life' 
  },
  'wildlife': { 
    cat: 'pets-animal-lovers', 
    sub: 'Amazing Life' 
  },
  'wildanimals': { 
    cat: 'pets-animal-lovers', 
    sub: 'Amazing Life' 
  },
  'safari': { 
    cat: 'pets-animal-lovers', 
    sub: 'Amazing Life' 
  },

  // ========== SUPPORT & CARE ==========
  'getwell': { 
    cat: 'support-healing-care', 
    sub: 'Get Well Wishes' 
  },
  'getwellsoon': { 
    cat: 'support-healing-care', 
    sub: 'Get Well Wishes' 
  },
  'thinkingofyou': { 
    cat: 'support-healing-care', 
    sub: 'Thinking of You Message' 
  },
  'staystrong': { 
    cat: 'support-healing-care', 
    sub: 'Stay Strong Motivation' 
  },
  'cheerup': { 
    cat: 'support-healing-care', 
    sub: 'Cheer Up Message' 
  },
  'yougotthis': { 
    cat: 'support-healing-care', 
    sub: "You've Got This Inspiration" 
  },
  'sympathy': { 
    cat: 'support-healing-care', 
    sub: 'Condolence Message' 
  },
  'condolences': { 
    cat: 'support-healing-care', 
    sub: 'Condolence Message' 
  },
  'loss': { 
    cat: 'support-healing-care', 
    sub: 'Loss & Healing' 
  },
  'memory': { 
    cat: 'support-healing-care', 
    sub: 'In Loving Memory' 
  },
  'inmemory': { 
    cat: 'support-healing-care', 
    sub: 'In Loving Memory' 
  },

  // ========== DIVERSITY & UNITY ==========
  'diversity': { 
    cat: 'hear-every-heart', 
    sub: 'Inclusivity & Belonging' 
  },
  'inclusivity': { 
    cat: 'hear-every-heart', 
    sub: 'Inclusivity & Belonging' 
  },
  'unity': { 
    cat: 'hear-every-heart', 
    sub: 'Unity & Harmony' 
  },
  'peace': { 
    cat: 'hear-every-heart', 
    sub: 'Peace & Balance' 
  },
  'pride': { 
    cat: 'hear-every-heart', 
    sub: 'Pride Celebration' 
  },
  'equality': { 
    cat: 'hear-every-heart', 
    sub: 'Equality for All' 
  },
  'acceptance': { 
    cat: 'hear-every-heart', 
    sub: 'Acceptance & Respect' 
  },
  'immigration': { 
    cat: 'hear-every-heart', 
    sub: 'Immigration Journey' 
  },
  'disability': { 
    cat: 'hear-every-heart', 
    sub: 'Disability Awareness Tribute' 
  },
  'autism': { 
    cat: 'hear-every-heart', 
    sub: 'Autism Awareness Day' 
  },
  'mentalhealth': { 
    cat: 'hear-every-heart', 
    sub: 'Mental Health Awareness' 
  },
  'cancer': { 
    cat: 'hear-every-heart', 
    sub: 'Cancer Awareness' 
  },
  'afro': { 
    cat: 'hear-every-heart', 
    sub: 'Afro Heritage Pride' 
  },
  'hispanic': { 
    cat: 'hear-every-heart', 
    sub: 'Hispanic Heritage Pride' 
  },
  'sorry': { 
    cat: 'hear-every-heart', 
    sub: "I'm Sorry Message" 
  },
  'imsorry': { 
    cat: 'hear-every-heart', 
    sub: "I'm Sorry Message" 
  },
  'forgive': { 
    cat: 'hear-every-heart', 
    sub: 'Forgive Me Note' 
  },
  'forgiveme': { 
    cat: 'hear-every-heart', 
    sub: 'Forgive Me Note' 
  },
  'missyou': { 
    cat: 'hear-every-heart', 
    sub: 'Missing You Moment' 
  },
  'special': { 
    cat: 'hear-every-heart', 
    sub: "You're Special Message" 
  },
  'youmatter': { 
    cat: 'hear-every-heart', 
    sub: 'You Matter Reminder' 
  },

  // ========== SPORTS & FITNESS ==========
  'sports': { 
    cat: 'sports', 
    sub: 'Team Sports Energy' 
  },
  'team': { 
    cat: 'sports', 
    sub: 'Team Sports Energy' 
  },
  'championship': { 
    cat: 'sports', 
    sub: 'Championship Moment' 
  },
  'victory': { 
    cat: 'sports', 
    sub: 'Victory Celebration' 
  },
  'fitness': { 
    cat: 'sports', 
    sub: 'Fitness & Training Journey' 
  },
  'training': { 
    cat: 'sports', 
    sub: 'Fitness & Training Journey' 
  },
  'gym': { 
    cat: 'sports', 
    sub: 'Fitness & Training Journey' 
  },
  'endurance': { 
    cat: 'sports', 
    sub: 'Endurance Sports Challenge' 
  },
  'yoga': { 
    cat: 'sports', 
    sub: 'Yoga & Balance Flow' 
  },
  'dance': { 
    cat: 'sports', 
    sub: 'Dance & Rhythm Energy' 
  },
  'martialarts': { 
    cat: 'sports', 
    sub: 'Martial Arts Flow' 
  },

  // ========== WELLNESS & MINDFULNESS ==========
  'wellness': { 
    cat: 'wellness-mindful-living', 
    sub: 'Self-Care Routine' 
  },
  'selfcare': { 
    cat: 'wellness-mindful-living', 
    sub: 'Self-Care Routine' 
  },
  'meditation': { 
    cat: 'wellness-mindful-living', 
    sub: 'Meditation Practice' 
  },
  'mindfulness': { 
    cat: 'wellness-mindful-living', 
    sub: 'Mindfulness Moment' 
  },
  'innerpeace': { 
    cat: 'wellness-mindful-living', 
    sub: 'Inner Peace Journey' 
  },
  'mentalhealth': { 
    cat: 'wellness-mindful-living', 
    sub: 'Mental Health Balance' 
  },
  'spa': { 
    cat: 'wellness-mindful-living', 
    sub: 'Spa Day Relaxation' 
  },
  'healthy': { 
    cat: 'wellness-mindful-living', 
    sub: 'Healthy Lifestyle Choice' 
  },
  'healthylifestyle': { 
    cat: 'wellness-mindful-living', 
    sub: 'Healthy Lifestyle Choice' 
  },
  'weightloss': { 
    cat: 'wellness-mindful-living', 
    sub: 'Weight Loss Success Story' 
  },
  'quitsmoking': { 
    cat: 'wellness-mindful-living', 
    sub: 'Quit Smoking Journey' 
  },

  // ========== LIFE JOURNEYS & TRANSITIONS ==========
  'newhome': { 
    cat: 'life-journeys-transitions', 
    sub: 'New Home Celebration' 
  },
  'moving': { 
    cat: 'life-journeys-transitions', 
    sub: 'Moving to a New Place' 
  },
  'housewarming': { 
    cat: 'life-journeys-transitions', 
    sub: 'Housewarming Moment' 
  },
  'freshstart': { 
    cat: 'life-journeys-transitions', 
    sub: 'Fresh Start Journey' 
  },
  'newchapter': { 
    cat: 'life-journeys-transitions', 
    sub: 'New Chapter Beginning' 
  },
  'newbeginning': { 
    cat: 'life-journeys-transitions', 
    sub: 'New Chapter Beginning' 
  },
  'newbeginnings': { 
    cat: 'life-journeys-transitions', 
    sub: 'New Chapter Beginning' 
  },
  'thankyou': { 
    cat: 'life-journeys-transitions', 
    sub: 'Thank You Message' 
  },
  'thanks': { 
    cat: 'life-journeys-transitions', 
    sub: 'Thank You Message' 
  },
  'justbecause': { 
    cat: 'life-journeys-transitions', 
    sub: 'Just Because Moment' 
  },
  'congratulations': { 
    cat: 'life-journeys-transitions', 
    sub: 'Congratulations Celebration' 
  },
  'congrats': { 
    cat: 'life-journeys-transitions', 
    sub: 'Congratulations Celebration' 
  },
  'goodluck': { 
    cat: 'life-journeys-transitions', 
    sub: 'Good Luck Wish' 
  },
  'safetravels': { 
    cat: 'life-journeys-transitions', 
    sub: 'Safe Travels Message' 
  },
  'welcome': { 
    cat: 'life-journeys-transitions', 
    sub: 'Warm Welcome Greeting' 
  },
  'outdoor': { 
    cat: 'life-journeys-transitions', 
    sub: 'Outdoor Adventure Moment' 
  },
  'nature': { 
    cat: 'life-journeys-transitions', 
    sub: 'Nature Escape Journey' 
  },
  'landscape': { 
    cat: 'life-journeys-transitions', 
    sub: 'Beautiful Landscape Scene' 
  },

  // ========== GENERAL (FALLBACK) ==========
  'general': { 
    cat: 'life-journeys-transitions', 
    sub: 'Just Because Moment' 
  },
};

// 🔍 Función para encontrar todos los archivos .mp4
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

// 📝 Capitalizar primera letra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 🎯 Clasificar desde nombre de archivo
function classifyFromFilename(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.split("_");
  
  // Detectar si tiene valor al final (ej: 1A, 2B)
  const lastPart = parts[parts.length - 1];
  const isValue = /^[0-9]+[A-Z]$/i.test(lastPart);
  
  const value = isValue ? lastPart.toUpperCase() : "1A";
  const nameParts = isValue ? parts.slice(0, -1) : parts;
  
  // Objeto principal (primera palabra capitalizada)
  const object = capitalize(nameParts[0] || "Unknown");
  
  // Buscar coincidencias en el mapa
  const foundCategories = new Set();
  const foundSubcategories = new Set();
  
  for (const part of nameParts) {
    const normalized = part.toLowerCase();
    if (CATEGORY_MAP[normalized]) {
      foundCategories.add(CATEGORY_MAP[normalized].cat);
      foundSubcategories.add(CATEGORY_MAP[normalized].sub);
    }
  }
  
  // Si no se encontró nada, usar general
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
  
  console.log("🚀 Generador de Index V17.0 - Con Nombres Descriptivos\n");
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
    console.log(`   🔍 Search: ${videoData.searchTerms.join(", ")}`);
    console.log("");
    
    return videoData;
  });
  
  const indexData = {
    videos,
    generated: new Date().toISOString(),
    total: videos.length,
    version: "17.0",
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total: ${videos.length} videos`);
  console.log(`🎯 Versión: 17.0 - Nombres Descriptivos Completos\n`);
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
