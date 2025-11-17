/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V13.2 (FINAL)
 * Incluye: clasificación, subclasificación, glosario, búsqueda,
 * filtros, agrupación y compatibilidad total con Next.js.
 */

import fs from "node:fs";
import path from "node:path";

export const BASE_CATEGORIES = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Connection", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

// 🧩 Subcategorías
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter"],
    "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day"],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Birthday", "Sweet 16", "21st Birthday"],
    "Celebrations": ["Party", "Surprise"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "Hugs", "Valentine's Day"],
    "Wedding": ["Wedding", "Anniversary"],
  },
  "family-friendship": {
    "Family": ["Mother's Day", "Father's Day", "Parents"],
    "Friendship": ["Friends", "Best Friends"],
  },
  "work": {
    "Career": ["New Job", "Promotion", "Retirement"],
    "Education": ["Graduation", "School"],
  },
  "babies-parenting": {
    "Baby": ["Newborn", "Baby Shower", "Pregnancy"],
    "Parenting": ["Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Companion Animals": ["Dogs", "Cats"],
    "Sea Animals": ["Sea Animals"],
    "Farm Animals": ["Farm Animals"],
    "Flying Animals": ["Flying Animals"],
    "Wild Animals": ["Wild Animals"],
  },
  "support-healing-care": {
    "Support": ["Get Well", "Thinking of You"],
    "Sympathy": ["Condolences", "Loss"],
  },
  "hear-every-heart": {
    "Diversity": ["Inclusivity", "Unity", "Peace"],
  },
  "sports": {
    "Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation"],
  },
  "life-journeys-transitions": {
    "New Beginnings": ["New Home", "Moving"],
    "Everyday": ["Thank You", "Just Because"],
  },
};

// 🎯 Mapa directo
const DIRECT_CATEGORY_MAP = {
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",

  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",

  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  nature: "life-journeys-transitions",

  birthday: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  party: "birthdays-celebrations",

  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",

  family: "family-friendship",
  mother: "family-friendship",
  mothersday: "family-friendship",
  father: "family-friendship",
  fathersday: "family-friendship",
  friends: "family-friendship",

  work: "work",
  graduation: "work",

  baby: "babies-parenting",

  support: "support-healing-care",
  getwell: "support-healing-care",

  gym: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",

  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
};

const DIRECT_SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  birthday: "Birthday",
  anniversary: "Anniversary",
  party: "Party",
  love: "Love",
  hugs: "Hugs",
  gym: "Gym",
  soccer: "Soccer",
  basketball: "Basketball",
  football: "Football",
  seaanimals: "Sea Animals",
  farmanimals: "Farm Animals",
};

const OBJECT_KEYWORDS = new Set([
  "zombie", "ghost", "pumpkin", "turkey", "santa", "bunny",
  "heart", "rose", "cake", "balloon", "gift",
  "turtle", "fish", "shark", "cow", "horse", "pig",
  "bird", "lion", "tiger", "bear"
]);

function normalize(t) {
  return t?.toLowerCase().replace(/[^\da-z]/g, "").trim();
}

function isObjectKeyword(w) {
  return OBJECT_KEYWORDS.has(normalize(w));
}

function getFirstSubcategory(slug) {
  const g = SUBCATEGORY_GROUPS[slug];
  if (!g) return null;
  return Object.values(g)[0]?.[0] || null;
}

let LEARNED_GLOSSARY = {};

// 🎯 CLASIFICACIÓN PRINCIPAL
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/i, "");
  const parts = basename.split(/[_\s-]+/).map(p => p.toLowerCase());

  const lastPart = parts.at(-1);
  const variant = /^\d+[a-z]$/i.test(lastPart) ? lastPart.toUpperCase() : "1A";

  const keywords = variant === "1A" ? parts : parts.slice(0, -1);

  let categoriesFound = new Map();
  let object = parts[0];

  for (const p of keywords) {
    const n = normalize(p);

    if (DIRECT_CATEGORY_MAP[n]) {
      const slug = DIRECT_CATEGORY_MAP[n];
      if (!categoriesFound.has(slug)) categoriesFound.set(slug, []);
    }

    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];

      for (const [slug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            if (!categoriesFound.has(slug)) categoriesFound.set(slug, []);
            if (!categoriesFound.get(slug).includes(sub)) {
              categoriesFound.get(slug).push(sub);
            }
          }
        }
      }
    }
  }

  if (categoriesFound.size === 0) {
    const fallback = "life-journeys-transitions";
    categoriesFound.set(fallback, [getFirstSubcategory(fallback)]);
  }

  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    if (subs.length === 0) subs.push(getFirstSubcategory(slug));

    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    results.push({
      categorySlug: slug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subs,
      variant,
      object,
    });
  }

  return results;
}

// 🔍 BÚSQUEDA
export function searchVideos(videos, term) {
  if (!term?.trim()) return videos;
  const n = normalize(term);

  return videos.filter(v => {
    const text = [
      v.name,
      v.object,
      v.subcategory,
      ...(v.categories || []),
      ...(v.tags || [])
    ].join(" ").toLowerCase();

    return text.includes(n);
  });
}

// 📂 AGRUPAR POR CATEGORÍA
export function groupVideosByBaseCategory(videos) {
  const grouped = {};

  for (const base of BASE_CATEGORIES) grouped[base.slug] = [];

  for (const v of videos) {
    const classifications = classifyVideo(v.name);

    classifications.forEach(c => {
      grouped[c.categorySlug].push({
        ...v,
        contextSubcategories: c.subcategories,
        contextCategory: c.categoryName
      });
    });
  }

  return grouped;
}

// 🎯 FILTRAR POR CATEGORÍA
export function filterByCategory(videos, slug) {
  return videos.filter(v => {
    const classes = classifyVideo(v.name);
    return classes.some(c => c.categorySlug === slug);
  });
}

// ⭐ FILTRAR POR SUBCATEGORÍA (FALTABA — YA LISTO)
export function filterBySubcategory(videos, sub) {
  return videos.filter(v => {
    const classes = classifyVideo(v.name);
    const subs = classes.flatMap(c => c.subcategories || []);

    const direct = [
      v.subcategory,
      ...(v.subcategories || []),
      ...(v.contextSubcategories || [])
    ].filter(Boolean);

    return [...subs, ...direct].includes(sub);
  });
}

// 🎯 EXPORTS CONSOLIDADOS
export default {
  classifyVideo,
  searchVideos,
  filterByCategory,
  filterBySubcategory,
  groupVideosByBaseCategory,
  BASE_CATEGORIES,
  SUBCATEGORY_GROUPS
};
