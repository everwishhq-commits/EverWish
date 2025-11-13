/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V14 - ZOMBIE FIX
 * - Detecta categorías por CUALQUIER parte del nombre
 * - Prioriza palabras específicas (zombie, halloween, etc)
 * - Funciona con nombres complejos como "zombie_halloween_seasonal_1A"
 */

/* ---------------------------------------------------------
   🗂 BASE CATEGORIES
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   🗂 SUBCATEGORY GROUPS
--------------------------------------------------------- */
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter", "St Patricks Day"],
    "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day"],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Birthday", "Milestone Birthday", "Sweet 16", "21st Birthday"],
    "Celebrations": ["Party", "Surprise", "Gender Reveal"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "Hugs", "Romantic"],
    "Wedding": ["Wedding", "Engagement", "Anniversary"],
  },
  "family-friendship": {
    "Family": ["Mother's Day", "Father's Day", "Parents"],
    "Friendship": ["Friends", "Best Friends"],
  },
  "work": {
    "Career": ["New Job", "Promotion", "Retirement", "Boss Day"],
    "Education": ["Graduation", "School", "Teacher Appreciation"],
  },
  "babies-parenting": {
    "Baby": ["Newborn", "Baby Shower", "Pregnancy", "Gender Reveal"],
    "Parenting": ["Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Beloved Pets": ["Companion Animals", "Furry Friends", "Exotic Pets"],
    "Sea Animals": ["Sea Animals", "Ocean Friends"],
    "Farm Animals": ["Farm Animals", "Barnyard Helpers"],
    "Flying Animals": ["Flying Animals", "Sky Creatures"],
    "Wild Animals": ["Wild Animals", "Safari Friends"],
  },
  "support-healing-care": {
    "Support": ["Get Well", "Thinking of You", "Recovery"],
    "Sympathy": ["Condolences", "Loss"],
  },
  "hear-every-heart": {
    "Diversity": ["Inclusivity", "Unity", "Peace", "For Everyone"],
  },
  "sports": {
    "Sports": ["Soccer", "Basketball", "Football", "Baseball"],
    "Fitness": ["Gym", "Yoga", "Running"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Mindfulness"],
  },
  "life-journeys-transitions": {
    "New Beginnings": ["New Home", "Moving", "Journey", "New Chapter"],
    "Everyday": ["Thank You", "Just Because", "Daily Moments"],
  },
};

/* ---------------------------------------------------------
   🧠 MAPAS MEJORADOS - DETECTAN SINGULAR Y PLURAL
--------------------------------------------------------- */
function normalize(t) {
  if (!t) return "";
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// 🔑 CATEGORÍAS - Ahora detecta singular/plural y variaciones
const DIRECT_CATEGORY_MAP = {
  // Halloween & Seasonal
  halloween: "seasonal-global-celebrations",
  zombie: "seasonal-global-celebrations",
  zombies: "seasonal-global-celebrations",
  ghost: "seasonal-global-celebrations",
  ghosts: "seasonal-global-celebrations",
  pumpkin: "seasonal-global-celebrations",
  pumpkins: "seasonal-global-celebrations",
  witch: "seasonal-global-celebrations",
  witches: "seasonal-global-celebrations",
  skeleton: "seasonal-global-celebrations",
  skeletons: "seasonal-global-celebrations",
  bat: "seasonal-global-celebrations",
  bats: "seasonal-global-celebrations",
  
  // Otros holidays
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  independence: "seasonal-global-celebrations",
  
  // Seasonal
  spring: "seasonal-global-celebrations",
  summer: "seasonal-global-celebrations",
  fall: "seasonal-global-celebrations",
  autumn: "seasonal-global-celebrations",
  winter: "seasonal-global-celebrations",
  seasonal: "seasonal-global-celebrations",
  
  // Celebrations
  birthday: "birthdays-celebrations",
  birthdays: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  celebrations: "birthdays-celebrations",
  party: "birthdays-celebrations",
  parties: "birthdays-celebrations",
  
  // Love
  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  romantic: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  weddings: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  anniversaries: "love-weddings-anniversaries",
  hug: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  
  // Family
  mother: "family-friendship",
  mothers: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  family: "family-friendship",
  friend: "family-friendship",
  friends: "family-friendship",
  
  // Work
  work: "work",
  job: "work",
  career: "work",
  graduation: "work",
  
  // Baby
  baby: "babies-parenting",
  babies: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  
  // Pets
  pet: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  animal: "pets-animal-lovers",
  animals: "pets-animal-lovers",
  
  // Support
  support: "support-healing-care",
  getwell: "support-healing-care",
  condolence: "support-healing-care",
  condolences: "support-healing-care",
  
  // Sports
  sport: "sports",
  sports: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  
  // Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  
  // Life
  nature: "life-journeys-transitions",
  journey: "life-journeys-transitions",
  transition: "life-journeys-transitions",
};

// 🏷️ SUBCATEGORÍAS - Singular y plural
const DIRECT_SUBCATEGORY_MAP = {
  halloween: "Halloween",
  zombie: "Halloween",
  zombies: "Halloween",
  ghost: "Halloween",
  ghosts: "Halloween",
  pumpkin: "Halloween",
  pumpkins: "Halloween",
  
  christmas: "Christmas",
  xmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  
  birthday: "Birthday",
  birthdays: "Birthday",
  party: "Party",
  parties: "Party",
  
  love: "Love",
  hug: "Hugs",
  hugs: "Hugs",
  wedding: "Wedding",
  weddings: "Wedding",
  
  mother: "Mother's Day",
  mothers: "Mother's Day",
  father: "Father's Day",
  fathers: "Father's Day",
  
  dog: "Dogs",
  dogs: "Dogs",
  cat: "Cats",
  cats: "Cats",
};

/* ---------------------------------------------------------
   🔍 CLASIFICAR VIDEO - VERSION MEJORADA
--------------------------------------------------------- */
function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/i, "");
  
  // Dividir por guiones bajos, espacios o guiones
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  // Detectar variante (1A, 2B, etc)
  const last = parts.at(-1);
  const isVariant = /^[0-9]+[a-z]$/i.test(last);
  const variant = isVariant ? last.toUpperCase() : "1A";
  
  // El objeto es la primera parte
  const object = parts[0];
  
  // Categorías y subcategorías encontradas
  const categoriesFound = new Map();
  
  // 🔍 ANALIZAR CADA PARTE DEL NOMBRE
  const nameParts = isVariant ? parts.slice(0, -1) : parts;
  
  for (const part of nameParts) {
    const n = normalize(part);
    
    // 1. Buscar categoría directa
    if (DIRECT_CATEGORY_MAP[n]) {
      const catSlug = DIRECT_CATEGORY_MAP[n];
      if (!categoriesFound.has(catSlug)) {
        categoriesFound.set(catSlug, []);
      }
    }
    
    // 2. Buscar subcategoría directa
    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];
      
      // Encontrar a qué categoría pertenece esta subcategoría
      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        const match = Object.values(groups).some((subs) => subs.includes(sub));
        if (match) {
          if (!categoriesFound.has(catSlug)) {
            categoriesFound.set(catSlug, []);
          }
          if (!categoriesFound.get(catSlug).includes(sub)) {
            categoriesFound.get(catSlug).push(sub);
          }
        }
      }
    }
  }
  
  // Si no se encontró ninguna categoría, usar fallback
  if (categoriesFound.size === 0) {
    const fallback = "life-journeys-transitions";
    return [{
      categorySlug: fallback,
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    }];
  }
  
  // Construir resultados
  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find((c) => c.slug === slug);
    
    // Si no hay subcategorías, agregar la primera del grupo
    if (subs.length === 0) {
      const first = getFirstSubcategory(slug);
      if (first) subs.push(first);
    }
    
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

/* ---------------------------------------------------------
   🔍 SEARCH - MEJORADA
--------------------------------------------------------- */
export function searchVideos(videos, term) {
  const n = normalize(term);
  if (!n) return videos;
  
  return videos.filter((v) => {
    // Buscar en nombre completo
    const nameMatch = normalize(v.name).includes(n);
    if (nameMatch) return true;
    
    // Buscar en object
    const objectMatch = normalize(v.object).includes(n);
    if (objectMatch) return true;
    
    // Buscar en tags
    const tagsMatch = (v.tags || []).some(tag => normalize(tag).includes(n));
    if (tagsMatch) return true;
    
    return false;
  });
}

/* ---------------------------------------------------------
   📂 AGRUPAR POR CATEGORÍA
--------------------------------------------------------- */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach((c) => (grouped[c.slug] = []));
  
  videos.forEach((v) => {
    const classifications = classifyVideo(v.name);
    classifications.forEach((c) => {
      if (!grouped[c.categorySlug].some((x) => x.name === v.name)) {
        grouped[c.categorySlug].push({
          ...v,
          contextSubcategories: c.subcategories,
        });
      }
    });
  });
  
  return grouped;
}

/* ---------------------------------------------------------
   🎯 FILTRAR POR CATEGORÍA
--------------------------------------------------------- */
export function filterByCategory(videos, categorySlug) {
  return videos.filter((v) => {
    const cl = classifyVideo(v.name);
    return cl.some((c) => c.categorySlug === categorySlug);
  });
}

/* ---------------------------------------------------------
   📊 OBTENER GRUPOS + SUBCATEGORÍAS
--------------------------------------------------------- */
export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};
  
  Object.entries(groups).forEach(([groupName, subs]) => {
    const filtered = subs
      .map((sub) => ({
        name: sub,
        count: videos.filter((v) => {
          const cl = classifyVideo(v.name);
          const allSubs = [];
          cl.forEach((c) => allSubs.push(...c.subcategories));
          return allSubs.includes(sub);
        }).length,
      }))
      .filter((s) => s.count > 0);
    
    if (filtered.length > 0) result[groupName] = filtered;
  });
  
  return result;
}

/* ---------------------------------------------------------
   🎯 FILTRAR POR SUBCATEGORÍA
--------------------------------------------------------- */
export function filterBySubcategory(videos, sub) {
  return videos.filter((v) => {
    const cl = classifyVideo(v.name);
    const allSubs = [];
    cl.forEach((c) => allSubs.push(...c.subcategories));
    return allSubs.includes(sub);
  });
}
