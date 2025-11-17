/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V2.1 - Con detección mejorada
 * Prioriza palabras clave sobre fallback a Nature
 */

import {
  BASE_CATEGORIES,
  SUBCATEGORY_GROUPS,
  KEYWORD_TO_CATEGORY,
  KEYWORD_TO_SUBCATEGORY,
  OBJECT_KEYWORDS,
} from './categories-config.js';

export { BASE_CATEGORIES, SUBCATEGORY_GROUPS };

function normalize(t) {
  if (!t) return '';
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\da-z]/g, "")
    .trim();
}

function isObjectKeyword(word) {
  return OBJECT_KEYWORDS.has(normalize(word));
}

function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

let LEARNED_GLOSSARY = {};

/**
 * 🔥 CLASIFICAR VIDEO - Versión mejorada
 */
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  // Detectar variante (1A, 2B, etc.)
  const lastPart = parts.at(-1) || "";
  const isVariant = /^\d+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  // Detectar objeto principal
  let object = parts[0];
  for (const part of parts) {
    if (isObjectKeyword(part)) {
      object = part;
      continue;
    }
    const n = normalize(part);
    if (!KEYWORD_TO_CATEGORY[n] && !KEYWORD_TO_SUBCATEGORY[n] && part !== lastPart) {
      object = part;
      break;
    }
  }
  
  const categoriesFound = new Map();
  const allParts = isVariant ? parts.slice(0, -1) : parts;
  
  console.log(`\n🔍 Clasificando: ${basename}`);
  console.log(`   Partes: ${allParts.join(", ")}`);
  
  /**
   * 🔥 FUNCIÓN AUXILIAR: PROCESAR COINCIDENCIAS
   */
  function processMatch(normalized, originalPart) {
    // 1. Buscar categoría
    if (KEYWORD_TO_CATEGORY[normalized]) {
      const catSlug = KEYWORD_TO_CATEGORY[normalized];
      console.log(`   ✅ Categoría encontrada: "${originalPart}" → ${catSlug}`);
      
      if (!categoriesFound.has(catSlug)) {
        categoriesFound.set(catSlug, []);
      }
    }
    
    // 2. Buscar subcategoría
    if (KEYWORD_TO_SUBCATEGORY[normalized]) {
      const sub = KEYWORD_TO_SUBCATEGORY[normalized];
      console.log(`   ✅ Subcategoría encontrada: "${originalPart}" → ${sub}`);
      
      // Encontrar a qué categoría pertenece esta subcategoría
      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            if (!categoriesFound.has(catSlug)) {
              categoriesFound.set(catSlug, []);
            }
            if (!categoriesFound.get(catSlug).includes(sub)) {
              categoriesFound.get(catSlug).push(sub);
            }
            return true; // ✅ Encontró match
          }
        }
      }
    }
    
    return false;
  }
  
  /**
   * 🔥 BUSCAR COINCIDENCIAS: 1, 2 y 3 PALABRAS
   */
  let foundMatch = false;
  
  for (let i = 0; i < allParts.length; i++) {
    const part = allParts[i];
    if (isObjectKeyword(part)) continue;
    
    const n = normalize(part);
    
    // 1️⃣ Palabra individual
    if (processMatch(n, part)) foundMatch = true;
    
    // 2️⃣ Combinación de 2 palabras
    if (i < allParts.length - 1) {
      const combined = normalize(part + allParts[i + 1]);
      if (processMatch(combined, `${part}_${allParts[i + 1]}`)) foundMatch = true;
      
      // 3️⃣ Combinación de 3 palabras
      if (i < allParts.length - 2) {
        const combined3 = normalize(part + allParts[i + 1] + allParts[i + 2]);
        if (processMatch(combined3, `${part}_${allParts[i + 1]}_${allParts[i + 2]}`)) foundMatch = true;
      }
    }
  }
  
  /**
   * 🔥 APLICAR GLOSARIO APRENDIDO
   */
  const glossary = LEARNED_GLOSSARY[normalize(object)];
  if (glossary && !isObjectKeyword(object)) {
    console.log(`   📚 Aplicando glosario para: ${object}`);
    
    for (const slug of glossary.categories) {
      if (slug === "pets-animal-lovers" && categoriesFound.size > 0) {
        const hasNonPetCategory = [...categoriesFound.keys()].some(s => s !== "pets-animal-lovers");
        if (hasNonPetCategory) continue;
      }
      
      if (!categoriesFound.has(slug)) {
        categoriesFound.set(slug, []);
      }
    }
    
    for (const sub of glossary.subcategories) {
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
  
  /**
   * 🔥 CONSTRUIR RESULTADOS
   */
  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    
    // Si no hay subcategorías, usar la primera del grupo
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
  
  /**
   * 🔥 FALLBACK SOLO SI NO HAY MATCHES
   */
  if (results.length === 0) {
    console.log(`   ⚠️  No se encontraron matches, usando fallback`);
    const fallback = "life-journeys-transitions";
    results.push({
      categorySlug: fallback,
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    });
  } else {
    console.log(`   ✅ Clasificación exitosa: ${results.length} categoría(s)`);
  }
  
  /**
   * 🔥 APRENDER PARA FUTURAS CLASIFICACIONES
   */
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
    
    for (const r of results) {
      LEARNED_GLOSSARY[key].categories.add(r.categorySlug);
      for (const sub of r.subcategories) {
        LEARNED_GLOSSARY[key].subcategories.add(sub);
      }
    }
    LEARNED_GLOSSARY[key].appearances++;
  }
  
  return results;
}

/**
 * 🔍 FUNCIONES DE BÚSQUEDA
 */
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
    const matches = classifications.some((c) => c.categorySlug === categorySlug);
    
    // Evitar contaminación de "pets" en "life-journeys"
    if (matches && categorySlug === "life-journeys-transitions") {
      const hasAnimalClass = classifications.some(c => c.categorySlug === "pets-animal-lovers");
      if (hasAnimalClass && 
          !video.name.toLowerCase().includes("moving") && 
          !video.name.toLowerCase().includes("newhome") &&
          !video.name.toLowerCase().includes("newbeginning")) {
        return false;
      }
    }
    
    return matches;
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
    }));
    
    // 🔥 MOSTRAR TODAS (incluso vacías)
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

export function getLearnedGlossary() {
  const g = {};
  for (const [k, v] of Object.entries(LEARNED_GLOSSARY)) {
    g[k] = {
      object: v.object,
      categories: [...v.categories],
      subcategories: [...v.subcategories],
      appearances: v.appearances,
    };
  }
  return g;
}

export function loadGlossary(glossary) {
  if (!glossary) return;
  for (const [k, v] of Object.entries(glossary)) {
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
