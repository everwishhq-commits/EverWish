/**
 * 🧠 SISTEMA DE CLASIFICACIÓN AUTO-APRENDIZAJE V11.3
 * - FIX: filterBySubcategory ahora re-clasifica videos para encontrar TODAS las subcategorías
 */

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

function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

const CATEGORY_KEYWORDS = {
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  holidays: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  birthday: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  party: "birthdays-celebrations",
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  family: "family-friendship",
  mother: "family-friendship",
  father: "family-friendship",
  parents: "family-friendship",
  work: "work",
  graduation: "work",
  baby: "babies-parenting",
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  support: "support-healing-care",
  sympathy: "support-healing-care",
  diversity: "hear-every-heart",
  sports: "sports",
  wellness: "wellness-mindful-living",
  nature: "life-journeys-transitions",
};

const SUBCATEGORY_KEYWORDS = {
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  valentine: "Valentine's Day",
  july4: "Independence Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  birthday: "Birthday",
  anniversary: "Anniversary",
  seaanimals: "Sea Animals",
  farmanimals: "Farm Animals",
  flyinganimals: "Flying Animals",
  wildanimals: "Wild Animals",
  companionanimals: "Companion Animals",
  love: "Love",
  hugs: "Hugs",
};

let LEARNED_GLOSSARY = {};

function normalize(t) {
  return t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
}

export function learnFromFilename(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.split(/[_\s-]+/);
  const lastPart = parts.at(-1) || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const relevant = isVariant ? parts.slice(0, -1) : parts;
  const object = relevant[0];
  if (!object) return;

  const groups = relevant.slice(1).filter(p => CATEGORY_KEYWORDS[normalize(p)] || SUBCATEGORY_KEYWORDS[normalize(p)]);
  if (!groups.length) return;

  const key = normalize(object);
  LEARNED_GLOSSARY[key] ||= { object, categories: new Set(), subcategories: new Set(), appearances: 0 };

  for (const g of groups) {
    const n = normalize(g);
    if (CATEGORY_KEYWORDS[n]) LEARNED_GLOSSARY[key].categories.add(CATEGORY_KEYWORDS[n]);
    if (SUBCATEGORY_KEYWORDS[n]) LEARNED_GLOSSARY[key].subcategories.add(SUBCATEGORY_KEYWORDS[n]);
  }
  LEARNED_GLOSSARY[key].appearances++;
}

function findInGlossary(word) {
  return LEARNED_GLOSSARY[normalize(word)] || null;
}

// 📊 CLASIFICAR con control de combinaciones y MÚLTIPLES SUBCATEGORÍAS
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  learnFromFilename(filename);

  const lastPart = parts.at(-1) || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  const object = parts[0];
  const classificationParts = isVariant ? parts.slice(1, -1) : parts.slice(1);

  const categoriesMap = new Map();

  // 🔎 Paso 1: detectar combinaciones completas primero
  const compoundMatches = classificationParts.filter(p => CATEGORY_KEYWORDS[normalize(p)]);
  const compoundSet = new Set(compoundMatches.map(p => normalize(p)));

  // 🔎 Paso 2: detectar categorías simples, evitando duplicados dentro de compuestos
  for (const part of classificationParts) {
    const n = normalize(part);

    // Ignora "love" si está dentro de "animallovers"
    if (n === "love" && (compoundSet.has("animallovers") || compoundSet.has("pets") || compoundSet.has("seaanimals"))) continue;

    if (CATEGORY_KEYWORDS[n]) {
      const slug = CATEGORY_KEYWORDS[n];
      if (!categoriesMap.has(slug)) {
        categoriesMap.set(slug, []);
      }
    }
  }

  // 🔎 Paso 3: aplicar glosario aprendido
  const glossary = findInGlossary(object);
  if (glossary) {
    glossary.categories.forEach(slug => {
      if (!categoriesMap.has(slug)) categoriesMap.set(slug, []);
    });
  }

  // 🔎 Paso 4: detectar TODAS las subcategorías
  const subcategoriesMap = new Map();
  
  for (const part of classificationParts) {
    const n = normalize(part);
    if (SUBCATEGORY_KEYWORDS[n]) {
      const sub = SUBCATEGORY_KEYWORDS[n];
      
      // Buscar en qué categorías existe esta subcategoría
      categoriesMap.forEach((_, slug) => {
        const groups = SUBCATEGORY_GROUPS[slug] || {};
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            // Inicializar array si no existe
            if (!subcategoriesMap.has(slug)) {
              subcategoriesMap.set(slug, []);
            }
            // Agregar subcategoría sin duplicados
            if (!subcategoriesMap.get(slug).includes(sub)) {
              subcategoriesMap.get(slug).push(sub);
            }
            break;
          }
        }
      });
    }
  }
  
  // Aplicar subcategorías detectadas
  subcategoriesMap.forEach((subs, slug) => {
    if (subs.length > 0) {
      categoriesMap.set(slug, subs);
    }
  });

  // Resultado final
  const results = [];
  for (const [slug, subs] of categoriesMap.entries()) {
    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    const subcategoriesArray = Array.isArray(subs) ? subs : (subs ? [subs] : []);
    
    results.push({
      categorySlug: slug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subcategoriesArray.filter(Boolean),
      variant,
      object,
    });
  }

  if (!results.length) {
    const fallback = "life-journeys-transitions";
    results.push({
      categorySlug: fallback,
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    });
  }
  
  // Asegurar que todas las entradas tengan al menos una subcategoría
  results.forEach(result => {
    if (!result.subcategories.length) {
      const firstSub = getFirstSubcategory(result.categorySlug);
      if (firstSub) result.subcategories.push(firstSub);
    }
  });

  return results;
}

// 💾 guardar / cargar / buscar / agrupar
export function getLearnedGlossary() {
  const g = {};
  Object.entries(LEARNED_GLOSSARY).forEach(([k, v]) => {
    g[k] = { object: v.object, categories: [...v.categories], subcategories: [...v.subcategories], appearances: v.appearances };
  });
  return g;
}

export function loadGlossary(glossary) {
  if (!glossary) return;
  for (const [k, v] of Object.entries(glossary)) {
    LEARNED_GLOSSARY[k] = {
      object: v.object,
      categories: new Set(v.categories || []),
      subcategories: new Set(v.subcategories || []),
      appearances: v.appearances || 0,
    };
  }
  console.log(`📚 Glosario cargado: ${Object.keys(LEARNED_GLOSSARY).length} objetos`);
}

export function searchVideos(videos, term) {
  if (!term?.trim()) return videos;
  const n = normalize(term);
  return videos.filter(v => {
    const text = [v.name, v.object, ...(v.tags || [])].filter(Boolean).join(" ");
    if (normalize(text).includes(n)) return true;
    const g = findInGlossary(term);
    if (g) {
      const obj = normalize(v.object || v.name?.split("_")[0]);
      return obj === n;
    }
    return false;
  });
}

export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach(c => (grouped[c.slug] = []));
  videos.forEach(v => {
    const classifications = classifyVideo(v.name);
    classifications.forEach(c => {
      if (!grouped[c.categorySlug].some(x => x.name === v.name)) {
        grouped[c.categorySlug].push({
          ...v,
          contextSubcategories: c.subcategories,
          contextCategory: c.categoryName,
        });
      }
    });
  });
  return grouped;
}

export function filterByCategory(videos, categorySlug) {
  return videos.filter((video) => {
    if (video.categories && Array.isArray(video.categories)) {
      return video.categories.includes(categorySlug);
    }
    const classifications = classifyVideo(video.name);
    return classifications.some((c) => c.categorySlug === categorySlug);
  });
}

export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};
  Object.entries(groups).forEach(([group, subs]) => {
    const subsWithVideos = subs
      .map(s => ({
        name: s,
        count: videos.filter(v => {
          // 🔧 FIX: Re-clasificar video para obtener TODAS sus subcategorías
          const classifications = classifyVideo(v.name);
          const allSubs = [];
          classifications.forEach(c => {
            if (c.subcategories) {
              allSubs.push(...c.subcategories);
            }
          });
          
          // Buscar en todas las ubicaciones posibles
          const videoSubs = [
            v.subcategory,
            ...(v.contextSubcategories || []),
            ...(v.subcategories || []),
            ...allSubs
          ].filter(Boolean);
          
          return videoSubs.includes(s);
        }).length,
      }))
      .filter(s => s.count > 0);
    if (subsWithVideos.length > 0) result[group] = subsWithVideos;
  });
  return result;
}

export function filterBySubcategory(videos, sub) {
  return videos.filter(v => {
    // 🔧 FIX: Re-clasificar video para obtener TODAS sus subcategorías
    const classifications = classifyVideo(v.name);
    const allSubsFromClassification = [];
    classifications.forEach(c => {
      if (c.subcategories) {
        allSubsFromClassification.push(...c.subcategories);
      }
    });
    
    // Buscar en TODAS las ubicaciones posibles
    const all = [
      v.subcategory, 
      ...(v.contextSubcategories || []), 
      ...(v.subcategories || []),
      ...allSubsFromClassification
    ].filter(Boolean);
    
    return all.includes(sub);
  });
                                                             }
