/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V3.0 - CLASIFICACIÓN EXACTA POR NOMBRE
 * 
 * REGLAS:
 * 1. Solo usar palabras que APARECEN en el nombre del archivo
 * 2. No asumir nada que no esté explícito
 * 3. Formato: object_cat1_cat2_sub1_sub2_1A
 * 4. Respetar subcategorías EXACTAS (furrycompanion ≠ householdfriends)
 */

import {
  BASE_CATEGORIES,
  SUBCATEGORY_GROUPS,
} from './categories-config.js';

// Re-exportar para compatibilidad
export { BASE_CATEGORIES, SUBCATEGORY_GROUPS };

// ============================================================
// NORMALIZACIÓN
// ============================================================

function normalize(t) {
  if (!t) return '';
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\da-z]/g, "")
    .trim();
}

// ============================================================
// MAPEOS DIRECTOS (palabra → categoría/subcategoría)
// ============================================================

const WORD_TO_CATEGORY = {
  // Holidays
  halloween: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  stpatrick: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  stpatricksday: "seasonal-global-celebrations",
  veterans: "seasonal-global-celebrations",
  veteransday: "seasonal-global-celebrations",
  independence: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  cincodemayo: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  mothersday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  newyear: "seasonal-global-celebrations",
  
  // Seasonal
  spring: "seasonal-global-celebrations",
  summer: "seasonal-global-celebrations",
  fall: "seasonal-global-celebrations",
  autumn: "seasonal-global-celebrations",
  winter: "seasonal-global-celebrations",
  
  // Celebrations
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  
  // Love
  love: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  
  // Family
  family: "family-friendship",
  friendship: "family-friendship",
  friends: "family-friendship",
  
  // Work
  work: "work",
  graduation: "work",
  
  // Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",
  
  // Pets - SOLO si dice "pets"
  pets: "pets-animal-lovers",
  
  // Support
  support: "support-healing-care",
  getwell: "support-healing-care",
  sympathy: "support-healing-care",
  
  // Connection
  diversity: "hear-every-heart",
  pride: "hear-every-heart",
  
  // Sports
  sports: "sports",
  sport: "sports",
  
  // Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  
  // Life Journeys
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  travel: "life-journeys-transitions",
};

const WORD_TO_SUBCATEGORY = {
  // Holidays
  halloween: "Halloween",
  thanksgiving: "Thanksgiving",
  christmas: "Christmas",
  easter: "Easter",
  stpatrick: "St Patrick's Day",
  stpatricks: "St Patrick's Day",
  stpatricksday: "St Patrick's Day",
  veterans: "Veterans Day",
  veteransday: "Veterans Day",
  independence: "Independence Day",
  independenceday: "Independence Day",
  july4: "Independence Day",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  newyear: "New Year",
  
  // Seasonal
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  autumn: "Autumn",
  winter: "Winter",
  
  // Celebrations
  birthday: "Birthday Celebration",
  
  // Love
  love: "Love & Affection",
  hugs: "Warm Hugs",
  wedding: "Wedding Celebration",
  anniversary: "Anniversary Celebration",
  
  // Pets - SUBCATEGORÍAS EXACTAS
  furrycompanions: "Furry Companions",
  furrycompanion: "Furry Companions",
  householdfriends: "Household Friends",
  householdfriend: "Household Friends",
  loyalsidekicks: "Loyal Sidekicks",
  loyalsidekick: "Loyal Sidekicks",
  barnyardcompanions: "Barnyard Companions",
  barnyardcompanion: "Barnyard Companions",
  underwateruniverse: "Underwater Universe",
  seaanimals: "Sea Animals",
  wingsinmotion: "Wings in Motion",
  flyinganimals: "Flying Animals",
  amazinglife: "Amazing Life",
  wildanimals: "Wild Animals",
  
  // Sports - SUBCATEGORÍAS EXACTAS
  teamsports: "Team Sports Energy",
  teamsport: "Team Sports Energy",
  championship: "Championship Moment",
  victory: "Victory Celebration",
  soccer: "Soccer",
  basketball: "Basketball",
  baseball: "Baseball",
  football: "Football",
  hockey: "Hockey",
  volleyball: "Volleyball",
  tennis: "Tennis",
  golf: "Golf",
  swimming: "Swimming",
  trackandfield: "Track and Field",
  gymnastics: "Gymnastics",
  martialarts: "Martial Arts",
  fitness: "Fitness & Training Journey",
  gym: "Gym Motivation",
  running: "Running Achievement",
  yoga: "Yoga Practice",
  marathon: "Marathon Completion",
  
  // Life Journeys
  newhome: "New Home Celebration",
  newbeginning: "New Chapter Beginning",
  moving: "Moving to a New Place",
  travel: "Travel Adventure",
  nature: "Beautiful Landscape Scene",
  outdoor: "Outdoor Adventure Moment",
  
  // Work
  graduation: "Graduation Celebration",
  newjob: "New Job Celebration",
  
  // Support
  getwell: "Get Well Wishes",
  sympathy: "Condolence Message",
};

// ============================================================
// FUNCIÓN PRINCIPAL: CLASIFICAR POR NOMBRE EXACTO
// ============================================================

export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/).filter(Boolean);
  
  // Detectar variante (1A, 2B, etc.)
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^\d+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  const relevantParts = isVariant ? parts.slice(0, -1) : parts;
  
  console.log(`\n📹 Clasificando: ${filename}`);
  console.log(`   Partes: ${relevantParts.join(", ")}`);
  
  // El PRIMER término es el objeto
  const object = relevantParts[0] || "unknown";
  
  // Buscar categorías y subcategorías en el resto de las partes
  const categoriesFound = new Map();
  
  for (let i = 0; i < relevantParts.length; i++) {
    const part = relevantParts[i];
    const normalized = normalize(part);
    
    // Saltar el objeto
    if (i === 0) continue;
    
    // 1️⃣ Buscar palabra individual
    if (WORD_TO_CATEGORY[normalized]) {
      const catSlug = WORD_TO_CATEGORY[normalized];
      if (!categoriesFound.has(catSlug)) {
        categoriesFound.set(catSlug, []);
      }
      console.log(`   ✅ Categoría: ${catSlug} (de "${part}")`);
    }
    
    if (WORD_TO_SUBCATEGORY[normalized]) {
      const sub = WORD_TO_SUBCATEGORY[normalized];
      
      // Encontrar la categoría de esta subcategoría
      const parentCat = findCategoryForSubcategory(sub);
      if (parentCat) {
        if (!categoriesFound.has(parentCat)) {
          categoriesFound.set(parentCat, []);
        }
        if (!categoriesFound.get(parentCat).includes(sub)) {
          categoriesFound.get(parentCat).push(sub);
          console.log(`   ✅ Subcategoría: ${sub} (de "${part}")`);
        }
      }
    }
    
    // 2️⃣ Buscar combinaciones de 2 palabras
    if (i < relevantParts.length - 1) {
      const combined = normalize(part + relevantParts[i + 1]);
      
      if (WORD_TO_CATEGORY[combined]) {
        const catSlug = WORD_TO_CATEGORY[combined];
        if (!categoriesFound.has(catSlug)) {
          categoriesFound.set(catSlug, []);
        }
        console.log(`   ✅ Categoría: ${catSlug} (de "${part} ${relevantParts[i + 1]}")`);
      }
      
      if (WORD_TO_SUBCATEGORY[combined]) {
        const sub = WORD_TO_SUBCATEGORY[combined];
        const parentCat = findCategoryForSubcategory(sub);
        if (parentCat) {
          if (!categoriesFound.has(parentCat)) {
            categoriesFound.set(parentCat, []);
          }
          if (!categoriesFound.get(parentCat).includes(sub)) {
            categoriesFound.get(parentCat).push(sub);
            console.log(`   ✅ Subcategoría: ${sub} (de "${part} ${relevantParts[i + 1]}")`);
          }
        }
      }
    }
    
    // 3️⃣ Buscar combinaciones de 3 palabras
    if (i < relevantParts.length - 2) {
      const combined3 = normalize(part + relevantParts[i + 1] + relevantParts[i + 2]);
      
      if (WORD_TO_SUBCATEGORY[combined3]) {
        const sub = WORD_TO_SUBCATEGORY[combined3];
        const parentCat = findCategoryForSubcategory(sub);
        if (parentCat) {
          if (!categoriesFound.has(parentCat)) {
            categoriesFound.set(parentCat, []);
          }
          if (!categoriesFound.get(parentCat).includes(sub)) {
            categoriesFound.get(parentCat).push(sub);
            console.log(`   ✅ Subcategoría: ${sub} (de "${part} ${relevantParts[i + 1]} ${relevantParts[i + 2]}")`);
          }
        }
      }
    }
  }
  
  // ============================================================
  // CONSTRUIR RESULTADOS
  // ============================================================
  
  const results = [];
  
  for (const [catSlug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find(c => c.slug === catSlug);
    
    results.push({
      categorySlug: catSlug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subs,
      variant,
      object,
    });
  }
  
  // Si no se encontró NADA, usar fallback genérico
  if (results.length === 0) {
    console.log(`   ⚠️  Sin coincidencias → General`);
    results.push({
      categorySlug: "life-journeys-transitions",
      categoryName: "Nature & Life Journeys",
      subcategories: ["Beautiful Landscape Scene"],
      variant,
      object,
    });
  }
  
  return results;
}

// ============================================================
// HELPER: Encontrar categoría de una subcategoría
// ============================================================

function findCategoryForSubcategory(subcategory) {
  for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
    for (const subs of Object.values(groups)) {
      if (subs.includes(subcategory)) {
        return catSlug;
      }
    }
  }
  return null;
}

// ============================================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ============================================================

export function searchVideos(videos, term) {
  if (!term?.trim()) return videos;
  const n = normalize(term);
  
  const variations = [n];
  if (n.endsWith('s')) variations.push(n.slice(0, -1));
  else variations.push(n + 's');
  if (n.endsWith('ies')) variations.push(n.slice(0, -3) + 'y');
  
  return videos.filter(v => {
    const allText = [
      v.name, v.object, v.subcategory, v.category,
      ...(v.tags || []),
      ...(v.categories || []),
      ...(v.subcategories || [])
    ].filter(Boolean).join(" ");
    
    const normalizedText = normalize(allText);
    return variations.some(variant => normalizedText.includes(variant));
  });
}

export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  for (const c of BASE_CATEGORIES) {
    grouped[c.slug] = [];
  }
  
  for (const v of videos) {
    const classifications = classifyVideo(v.name);
    for (const c of classifications) {
      if (!grouped[c.categorySlug].some(x => x.name === v.name)) {
        grouped[c.categorySlug].push({
          ...v,
          contextSubcategories: c.subcategories,
          contextCategory: c.categoryName,
        });
      }
    }
  }
  
  return grouped;
}

export function filterByCategory(videos, categorySlug) {
  return videos.filter((video) => {
    if (video.categories && Array.isArray(video.categories)) {
      if (video.categories.includes(categorySlug)) return true;
    }
    
    const classifications = classifyVideo(video.name);
    return classifications.some((c) => c.categorySlug === categorySlug);
  });
}

export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};
  
  for (const [group, subs] of Object.entries(groups)) {
    const subsWithVideos = subs.map(s => ({
      name: s,
      count: videos.filter(v => {
        const classifications = classifyVideo(v.name);
        const allSubs = classifications.flatMap(c => c.subcategories || []);
        const videoSubs = [
          v.subcategory,
          ...(v.contextSubcategories || []),
          ...(v.subcategories || []),
          ...allSubs
        ].filter(Boolean);
        return videoSubs.includes(s);
      }).length,
    })).filter(s => s.count > 0);
    
    if (subsWithVideos.length > 0) result[group] = subsWithVideos;
  }
  
  return result;
}

export function filterBySubcategory(videos, sub) {
  return videos.filter(v => {
    const classifications = classifyVideo(v.name);
    const allSubs = classifications.flatMap(c => c.subcategories || []);
    const videoSubs = [
      v.subcategory,
      ...(v.contextSubcategories || []),
      ...(v.subcategories || []),
      ...allSubs
    ].filter(Boolean);
    return videoSubs.includes(sub);
  });
    }
