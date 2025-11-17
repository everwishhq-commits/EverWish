/**
 * 🚀 SISTEMA DE CLASIFICACIÓN "V SUPERIOR 2025"
 * Combina lo mejor de V3.0 + V13.1 + optimizaciones nuevas.
 * Incluye:
 *  - prioridad inteligente
 *  - subcategorías exactas
 *  - combinaciones 2 y 3 palabras (del V3.0)
 *  - glosario con aprendizaje
 *  - bloqueo de contaminación
 *  - palabras objeto protegidas
 *  - fallback correcto
 */

import { BASE_CATEGORIES, SUBCATEGORY_GROUPS } from './categories-config.js';
export { BASE_CATEGORIES, SUBCATEGORY_GROUPS };

// -----------------------------------------------------------
// NORMALIZATION
// -----------------------------------------------------------
function normalize(t) {
  return t?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\da-z]/g, "")
    .trim();
}

// -----------------------------------------------------------
// DIRECT MAPS (V13.1 optimizado)
// -----------------------------------------------------------
const CATEGORY_MAP = {
  // Holidays
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",

  // Animals
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",

  // Journeys
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",

  // Celebrations
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",

  // Love
  love: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",

  // Family
  family: "family-friendship",
  mothersday: "family-friendship",
  fathersday: "family-friendship",
  friends: "family-friendship",

  // Work
  work: "work",
  graduation: "work",

  // Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",

  // Support
  getwell: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",

  // Diversity
  diversity: "hear-every-heart",

  // Sports
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  gym: "sports",
  yoga: "sports",

  // Wellness
  meditation: "wellness-mindful-living",
  wellness: "wellness-mindful-living",
};

const SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  july4: "Independence Day",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  birthday: "Birthday",
  anniversary: "Anniversary",
  party: "Party",
  dogs: "Dogs",
  cats: "Cats",
  seaanimals: "Sea Animals",
  flyinganimals: "Flying Animals",
  wildanimals: "Wild Animals",
  farmanimals: "Farm Animals",
  newhome: "New Home",
  moving: "Moving",
  nature: "Beautiful Landscape Scene",
  thankyou: "Thank You",
  getwell: "Get Well",
  condolences: "Condolences",
  soccer: "Soccer",
  basketball: "Basketball",
  football: "Football",
  gym: "Gym",
  yoga: "Yoga",
};

// -----------------------------------------------------------
// OBJECT KEYWORDS → NO deben crear categorías
// -----------------------------------------------------------
const OBJECT_WORDS = new Set([
  "pumpkin","pumpkins","ghost","ghosts","zombie","zombies",
  "snowman","snowmen","reindeer","turkey","turkeys",
  "cat","cats","dog","dogs","fish","shark","sharks",
  "horse","horses","pig","pigs","lion","lions","tiger","tigers"
]);

const isObjectWord = w => OBJECT_WORDS.has(normalize(w));

let GLOSSARY = {};

// -----------------------------------------------------------
// FIND SUBCATEGORY PARENT
// -----------------------------------------------------------
function findParentCategory(sub) {
  for (const [slug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
    for (const subs of Object.values(groups)) {
      if (subs.includes(sub)) return slug;
    }
  }
  return null;
}

// -----------------------------------------------------------
// MAIN CLASSIFICATION FUNCTION
// -----------------------------------------------------------
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/i, "");
  const parts = basename.split(/[_\s-]+/).filter(Boolean);

  const last = parts.at(-1);
  const isVar = /^\d+[a-z]$/i.test(last);
  const variant = isVar ? last.toUpperCase() : "1A";
  const words = isVar ? parts.slice(0, -1) : parts;

  // OBJECT DETECTION (best of both systems)
  let object = words[0];
  for (const w of words) {
    const n = normalize(w);
    if (isObjectWord(w)) { object = w; continue; }
    if (!CATEGORY_MAP[n] && !SUBCATEGORY_MAP[n]) {
      object = w;
      break;
    }
  }

  const found = new Map();

  // CATEGORY + SUBCATEGORY SCAN with 1, 2 & 3 word combos (from V3.0)
  for (let i = 0; i < words.length; i++) {
    const n1 = normalize(words[i]);
    if (isObjectWord(words[i])) continue;

    check(n1, found, words[i]);

    if (i < words.length - 1) {
      const n2 = normalize(words[i] + words[i+1]);
      check(n2, found, words[i] + " " + words[i+1]);
    }

    if (i < words.length - 2) {
      const n3 = normalize(words[i] + words[i+1] + words[i+2]);
      check(n3, found, words[i] + " " + words[i+1] + " " + words[i+2]);
    }
  }

  // APPLY GLOSSARY (from V13.1)
  const key = normalize(object);
  const learned = GLOSSARY[key];
  if (learned) {
    for (const c of learned.categories) {
      if (!found.has(c)) found.set(c, []);
    }
    for (const s of learned.subcategories) {
      const parent = findParentCategory(s);
      if (!parent) continue;
      if (!found.has(parent)) found.set(parent, []);
      if (!found.get(parent).includes(s)) found.get(parent).push(s);
    }
  }

  // BUILD RESULTS
  const result = [];
  for (const [slug, subs] of found.entries()) {
    if (subs.length === 0) {
      const firstSub = Object.values(SUBCATEGORY_GROUPS[slug] || {})[0]?.[0];
      if (firstSub) subs.push(firstSub);
    }
    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    result.push({
      categorySlug: slug,
      categoryName: cat?.name,
      subcategories: subs,
      variant,
      object
    });
  }

  // FALLBACK
  if (result.length === 0) {
    result.push({
      categorySlug: "life-journeys-transitions",
      categoryName: "Nature & Life Journeys",
      subcategories: ["Beautiful Landscape Scene"],
      variant,
      object,
    });
  }

  // LEARN
  if (!isObjectWord(object)) {
    if (!GLOSSARY[key]) {
      GLOSSARY[key] = {
        object,
        categories: new Set(),
        subcategories: new Set(),
        appearances: 0
      };
    }

    for (const r of result) {
      GLOSSARY[key].categories.add(r.categorySlug);
      for (const s of r.subcategories) {
        GLOSSARY[key].subcategories.add(s);
      }
    }
    GLOSSARY[key].appearances++;
  }

  return result;
}

// INTERNAL CHECKER
function check(keyword, found, source) {
  if (CATEGORY_MAP[keyword]) {
    const slug = CATEGORY_MAP[keyword];
    if (!found.has(slug)) found.set(slug, []);
  }

  if (SUBCATEGORY_MAP[keyword]) {
    const sub = SUBCATEGORY_MAP[keyword];
    const parent = findParentCategory(sub);
    if (!parent) return;
    if (!found.has(parent)) found.set(parent, []);
    if (!found.get(parent).includes(sub)) found.get(parent).push(sub);
  }
}
