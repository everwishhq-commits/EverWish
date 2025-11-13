/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V13 - FIXED
 * - Detección mejorada por nombre de archivo
 * - Evita contaminación entre categorías
 * - Mejor separación de contextos
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

// 🎯 MAPA DIRECTO: palabra → categoría (ORDEN IMPORTA)
const DIRECT_CATEGORY_MAP = {
  // 🎃 Holidays (PRIORIDAD MÁXIMA)
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  
  // 🐾 Animals (ANTES que otros para evitar contaminación)
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  
  // 🚚 Life Journeys (ANTES que general)
  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  newbeginnings: "life-journeys-transitions",
  transition: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  
  // 🎂 Celebrations
  birthday: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  party: "birthdays-celebrations",
  
  // 💝 Love & Romance
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  
  // 🫶 Family & Friendship
  family: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  mothersday: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  fathersday: "family-friendship",
  parents: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  
  // 💼 Work
  work: "work",
  graduation: "work",
  career: "work",
  job: "work",
  
  // 🧸 Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  
  // 🕊️ Support
  support: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  getwell: "support-healing-care",
  
  // 🧩 Connection
  diversity: "hear-every-heart",
  inclusivity: "hear-every-heart",
  
  // 🏟️ Sports
  sports: "sports",
  gym: "sports",
  fitness: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  running: "sports",
  yoga: "sports",
  
  // 🕯️ Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
};

// 🎯 SUBCATEGORÍAS ESPECÍFICAS
const DIRECT_SUBCATEGORY_MAP = {
  // Holidays
  halloween: "Halloween",
  christmas: "Christmas",
  xmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  july4: "Independence Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  
  // Celebrations
  birthday: "Birthday",
  anniversary: "Anniversary",
  party: "Party",
  
  // Animals (SIN objetos específicos como "zombie")
  seaanimals: "Sea Animals",
  farmanimals: "Farm Animals",
  flyinganimals: "Flying Animals",
  wildanimals: "Wild Animals",
  companionanimals: "Companion Animals",
  dogs: "Dogs",
  cats: "Cats",
  
  // Love
  love: "Love",
  hugs: "Hugs",
  wedding: "Wedding",
  
  // Sports
  gym: "Gym",
  yoga: "Yoga",
  soccer: "Soccer",
  basketball: "Basketball",
  football: "Football",
  
  // Life Journeys
  moving: "Moving",
  newhome: "New Home",
  newbeginning: "New Home",
  newbeginnings: "New Home",
  thankyou: "Thank You",
  justbecause: "Just Because",
  
  // Work
  graduation: "Graduation",
  newjob: "New Job",
  
  // Support
  getwell: "Get Well",
  condolences: "Condolences",
};

// ⚠️ PALABRAS QUE NO SON CATEGORÍAS (objetos específicos)
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

function normalize(t) {
  return t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
}

function isObjectKeyword(word) {
  const n = normalize(word);
  return OBJECT_KEYWORDS.has(n);
}

function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

let LEARNED_GLOSSARY = {};

// 📊 CLASIFICAR - VERSIÓN MEJORADA
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  const lastPart = parts.at(-1) || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  // 🎯 DETECTAR OBJETO (primera palabra que NO sea categoría/subcategoría)
  let object = parts[0];
  for (const part of parts) {
    const n = normalize(part);
    // ⚠️ NUEVO: Evitar que objetos específicos se usen como categorías
    if (isObjectKeyword(part)) {
      object = part;
      continue;
    }
    if (!DIRECT_CATEGORY_MAP[n] && !DIRECT_SUBCATEGORY_MAP[n] && part !== lastPart) {
      object = part;
      break;
    }
  }
  
  // 🔍 BUSCAR CATEGORÍAS Y SUBCATEGORÍAS (evitando contaminación)
  const categoriesFound = new Map();
  const allParts = isVariant ? parts.slice(0, -1) : parts;
  
  for (const part of allParts) {
    const n = normalize(part);
    
    // ⚠️ SKIP si es un objeto específico
    if (isObjectKeyword(part)) continue;
    
    // Buscar categoría
    if (DIRECT_CATEGORY_MAP[n]) {
      const catSlug = DIRECT_CATEGORY_MAP[n];
      if (!categoriesFound.has(catSlug)) {
        categoriesFound.set(catSlug, []);
      }
    }
    
    // Buscar subcategoría
    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];
      
      // Encontrar a qué categoría pertenece
      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            if (!categoriesFound.has(catSlug)) {
              categoriesFound.set(catSlug, []);
            }
            if (!categoriesFound.get(catSlug).includes(sub)) {
              categoriesFound.get(catSlug).push(sub);
            }
            break;
          }
        }
      }
    }
  }
  
  // 🧠 Aplicar glosario (solo si no contiene objetos que lo contradigan)
  const glossary = LEARNED_GLOSSARY[normalize(object)];
  if (glossary && !isObjectKeyword(object)) {
    glossary.categories.forEach(slug => {
      // ⚠️ NO agregar "pets-animal-lovers" si ya tiene otra categoría clara
      if (slug === "pets-animal-lovers" && categoriesFound.size > 0) {
        const hasNonPetCategory = [...categoriesFound.keys()].some(s => s !== "pets-animal-lovers");
        if (hasNonPetCategory) return;
      }
      
      if (!categoriesFound.has(slug)) {
        categoriesFound.set(slug, []);
      }
    });
    
    glossary.subcategories.forEach(sub => {
      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            if (!categoriesFound.has(catSlug)) {
              categoriesFound.set(catSlug, []);
            }
            if (!categoriesFound.get(catSlug).includes(sub)) {
              categoriesFound.get(catSlug).push(sub);
            }
            break;
          }
        }
      }
    });
  }
  
  // 📋 CONSTRUIR RESULTADOS
  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    
    // Si no tiene subcategorías, agregar la primera del grupo
    if (subs.length === 0) {
      const firstSub = getFirstSubcategory(slug);
      if (firstSub) subs.push(firstSub);
    }
    
    results.push({
      categorySlug: slug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subs,
      variant,
      object,
    });
  }
  
  // Si no encontró nada, fallback
  if (results.length === 0) {
    const fallback = "life-journeys-transitions";
    results.push({
      categorySlug: fallback,
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    });
  }
  
  // 🧠 APRENDER (con precaución)
  const key = normalize(object);
  if (!isObjectKeyword(object)) {
    if (!LEARNED_GLOSSARY[key]) {
      LEARNED_GLOSSARY[key] = {
        object,
        categories: new Set(),
        subcategories: new Set(),
        appearances: 0,
      };
    }
    
    results.forEach(r => {
      LEARNED_GLOSSARY[key].categories.add(r.categorySlug);
      r.subcategories.forEach(sub => LEARNED_GLOSSARY[key].subcategories.add(sub));
    });
    LEARNED_GLOSSARY[key].appearances++;
  }
  
  return results;
}

// 💾 FUNCIONES DE GLOSARIO
export function getLearnedGlossary() {
  const g = {};
  Object.entries(LEARNED_GLOSSARY).forEach(([k, v]) => {
    g[k] = {
      object: v.object,
      categories: [...v.categories],
      subcategories: [...v.subcategories],
      appearances: v.appearances,
    };
  });
  return g;
}

export function loadGlossary(glossary) {
  if (!glossary) return;
  for (const [k, v] of Object.entries(glossary)) {
    // ⚠️ NO cargar objetos específicos al glosario
    if (isObjectKeyword(v.object)) continue;
    
    LEARNED_GLOSSARY[k] = {
      object: v.object,
      categories: new Set(v.categories || []),
      subcategories: new Set(v.subcategories || []),
      appearances: v.appearances || 0,
    };
  }
  console.log(`📚 Glosario cargado: ${Object.keys(LEARNED_GLOSSARY).length} objetos`);
}

// 🔍 BÚSQUEDA MEJORADA
export function searchVideos(videos, term) {
  if (!term?.trim()) return videos;
  const n = normalize(term);
  
  // Generar variaciones (singular/plural)
  const variations = [n];
  if (n.endsWith('s')) {
    variations.push(n.slice(0, -1)); // zombies → zombie
  } else {
    variations.push(n + 's'); // zombie → zombies
  }
  if (n.endsWith('ies')) {
    variations.push(n.slice(0, -3) + 'y'); // zombies → zombie (no aplica aquí)
  }
  
  return videos.filter(v => {
    // Buscar en campos directos
    const directFields = [v.name, v.object, v.subcategory, v.category];
    const tags = v.tags || [];
    const categories = v.categories || [];
    
    const allText = [...directFields, ...tags, ...categories]
      .filter(Boolean)
      .join(" ");
    
    const normalizedText = normalize(allText);
    
    // Verificar si alguna variación está presente
    return variations.some(variant => normalizedText.includes(variant));
  });
}

// 📂 AGRUPAR POR CATEGORÍA BASE
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

// 🎯 FILTRAR POR CATEGORÍA (con limpieza)
export function filterByCategory(videos, categorySlug) {
  return videos.filter((video) => {
    // 1. Verificar en categories array (si existe en el video)
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.includes(categorySlug)) {
        return true;
      }
    }
    
    // 2. Clasificar dinámicamente
    const classifications = classifyVideo(video.name);
    const matches = classifications.some((c) => c.categorySlug === categorySlug);
    
    // ⚠️ FILTRO ADICIONAL: Evitar "New Beginning" en "pets-animal-lovers"
    if (matches && categorySlug === "life-journeys-transitions") {
      // Verificar que NO tenga clasificación de animales
      const hasAnimalClass = classifications.some(c => c.categorySlug === "pets-animal-lovers");
      if (hasAnimalClass && !video.name.toLowerCase().includes("moving") && 
          !video.name.toLowerCase().includes("newhome") &&
          !video.name.toLowerCase().includes("newbeginning")) {
        return false;
      }
    }
    
    return matches;
  });
}

// 📊 OBTENER GRUPOS CON SUBCATEGORÍAS
export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};
  
  Object.entries(groups).forEach(([group, subs]) => {
    const subsWithVideos = subs
      .map(s => ({
        name: s,
        count: videos.filter(v => {
          const classifications = classifyVideo(v.name);
          const allSubs = [];
          classifications.forEach(c => {
            if (c.subcategories) {
              allSubs.push(...c.subcategories);
            }
          });
          
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

// 🎯 FILTRAR POR SUBCATEGORÍA
export function filterBySubcategory(videos, sub) {
  return videos.filter(v => {
    const classifications = classifyVideo(v.name);
    const allSubsFromClassification = [];
    classifications.forEach(c => {
      if (c.subcategories) {
        allSubsFromClassification.push(...c.subcategories);
      }
    });
    
    const all = [
      v.subcategory,
      ...(v.contextSubcategories || []),
      ...(v.subcategories || []),
      ...allSubsFromClassification
    ].filter(Boolean);
    
    return all.includes(sub);
  });
   }
