/**
 * 🧠 SISTEMA DE CLASIFICACIÓN AUTO-APRENDIZAJE V10
 * - Construye el glosario automáticamente desde los nombres de archivo
 * - NO necesitas mapear palabra por palabra manualmente
 * - Aprende: "octopus" aparece con "seaanimals" → lo asocia automáticamente
 */

// 🎯 CATEGORÍAS BASE (las 12 oficiales)
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

// 🗂️ GRUPOS DE SUBCATEGORÍAS
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter", "General"],
    "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day", "General"],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter", "General"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Birthday", "Sweet 16", "21st Birthday", "General"],
    "Celebrations": ["Party", "Surprise", "General"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "Hugs", "Valentine's Day", "General"],
    "Wedding": ["Wedding", "Anniversary", "General"],
  },
  "family-friendship": {
    "Family": ["Mother's Day", "Father's Day", "Parents", "General"],
    "Friendship": ["Friends", "Best Friends", "General"],
  },
  "work": {
    "Career": ["New Job", "Promotion", "Retirement", "General"],
    "Education": ["Graduation", "School", "General"],
  },
  "babies-parenting": {
    "Baby": ["Newborn", "Baby Shower", "Pregnancy", "General"],
    "Parenting": ["Mom Life", "Dad Life", "General"],
  },
  "pets-animal-lovers": {
    "Companion Animals": ["Dogs", "Cats", "General"],
    "Sea Animals": ["Fish", "Dolphins", "Whales", "Octopus", "Turtles", "Sharks", "Seahorses", "General"],
    "Farm Animals": ["Horses", "Cows", "Chickens", "Pigs", "General"],
    "Flying Animals": ["Birds", "Butterflies", "Bees", "Eagles", "General"],
    "Wild Animals": ["Lions", "Bears", "Elephants", "Tigers", "Giraffes", "General"],
  },
  "support-healing-care": {
    "Support": ["Get Well", "Thinking of You", "General"],
    "Sympathy": ["Condolences", "Loss", "General"],
  },
  "hear-every-heart": {
    "Diversity": ["Inclusivity", "Unity", "Peace", "General"],
  },
  "sports": {
    "Sports": ["Soccer", "Basketball", "Football", "General"],
    "Fitness": ["Gym", "Yoga", "General"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "General"],
  },
  "life-journeys-transitions": {
    "New Beginnings": ["New Home", "Moving", "General"],
    "Everyday": ["Thank You", "Just Because", "General"],
  },
};

// 🎯 PALABRAS CLAVE MÍNIMAS (solo las esenciales para identificar categorías)
// ⚠️ IMPORTANTE: "animallovers" es UNA SOLA PALABRA (no separar en "animal" + "lovers")
const CATEGORY_KEYWORDS = {
  // Holidays
  "halloween": "seasonal-global-celebrations",
  "christmas": "seasonal-global-celebrations",
  "thanksgiving": "seasonal-global-celebrations",
  "easter": "seasonal-global-celebrations",
  "holidays": "seasonal-global-celebrations",
  "july4": "seasonal-global-celebrations",
  "valentine": "seasonal-global-celebrations",
  
  // Celebrations
  "birthday": "birthdays-celebrations",
  "celebration": "birthdays-celebrations",
  
  // Love (SOLO si aparece "love" explícitamente)
  "love": "love-weddings-anniversaries",
  "wedding": "love-weddings-anniversaries",
  "romance": "love-weddings-anniversaries",
  
  // Family
  "family": "family-friendship",
  "mother": "family-friendship",
  "father": "family-friendship",
  
  // Work
  "work": "work",
  "graduation": "work",
  
  // Babies
  "baby": "babies-parenting",
  
  // Animals (GRUPOS, no objetos individuales)
  // ⚠️ "animallovers" es PALABRA COMPLETA (no contiene "love" para búsquedas)
  "animallovers": "pets-animal-lovers",
  "pets": "pets-animal-lovers",
  "seaanimals": "pets-animal-lovers",
  "farmanimals": "pets-animal-lovers",
  "flyinganimals": "pets-animal-lovers",
  "wildanimals": "pets-animal-lovers",
  
  // Support
  "support": "support-healing-care",
  
  // Connection
  "diversity": "hear-every-heart",
  
  // Sports
  "sports": "sports",
  
  // Wellness
  "wellness": "wellness-mindful-living",
  
  // Nature
  "nature": "life-journeys-transitions",
};

// 🏷️ SUBCATEGORÍAS MÍNIMAS (solo grupos, no objetos)
const SUBCATEGORY_KEYWORDS = {
  "halloween": "Halloween",
  "christmas": "Christmas",
  "thanksgiving": "Thanksgiving",
  "easter": "Easter",
  "valentine": "Valentine's Day",
  "july4": "Independence Day",
  "mothersday": "Mother's Day",
  "fathersday": "Father's Day",
  "birthday": "Birthday",
  "love": "Love",
  "hugs": "Hugs",
  "wedding": "Wedding",
  
  // GRUPOS de animales (no objetos individuales)
  "seaanimals": "Sea Animals",
  "farmanimals": "Farm Animals",
  "flyinganimals": "Flying Animals",
  "wildanimals": "Wild Animals",
  "companionanimals": "Companion Animals",
};

// 🧠 GLOSARIO AUTO-GENERADO (se construye al escanear archivos)
let LEARNED_GLOSSARY = {};

/**
 * 🧠 NORMALIZACIÓN
 */
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * 🎓 APRENDER DESDE ARCHIVOS
 * Ejemplo: "octopus_seaanimals_1A" → aprende que "octopus" pertenece a "seaanimals"
 */
export function learnFromFilename(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  // Detectar variante
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const relevantParts = isVariant ? parts.slice(0, -1) : parts;
  
  // Primera parte = objeto
  const object = relevantParts[0];
  if (!object) return;
  
  // Buscar grupos (seaanimals, flyinganimals, etc.)
  const groups = relevantParts.slice(1).filter(part => {
    const norm = normalize(part);
    return CATEGORY_KEYWORDS[norm] || SUBCATEGORY_KEYWORDS[norm];
  });
  
  // Si encontró grupos, asociar el objeto con esos grupos
  if (groups.length > 0) {
    const normalizedObject = normalize(object);
    
    if (!LEARNED_GLOSSARY[normalizedObject]) {
      LEARNED_GLOSSARY[normalizedObject] = {
        object: object,
        categories: new Set(),
        subcategories: new Set(),
        appearances: 0,
      };
    }
    
    groups.forEach(group => {
      const norm = normalize(group);
      
      // Asociar con categoría
      if (CATEGORY_KEYWORDS[norm]) {
        LEARNED_GLOSSARY[normalizedObject].categories.add(CATEGORY_KEYWORDS[norm]);
      }
      
      // Asociar con subcategoría
      if (SUBCATEGORY_KEYWORDS[norm]) {
        LEARNED_GLOSSARY[normalizedObject].subcategories.add(SUBCATEGORY_KEYWORDS[norm]);
      }
    });
    
    LEARNED_GLOSSARY[normalizedObject].appearances++;
  }
}

/**
 * 🔍 BUSCAR EN GLOSARIO APRENDIDO
 */
function findInGlossary(word) {
  const normalized = normalize(word);
  return LEARNED_GLOSSARY[normalized] || null;
}

/**
 * 📊 CLASIFICACIÓN PRINCIPAL CON AUTO-APRENDIZAJE
 */
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  // 1. Aprender de este archivo
  learnFromFilename(filename);
  
  console.log(`\n🔍 Clasificando: ${basename}`);
  
  // 2. Extraer variante
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  // 3. Primera parte = objeto
  const object = parts[0] || "unknown";
  console.log(`  🎨 Objeto: "${object}" | Variante: "${variant}"`);
  
  // 4. Partes de clasificación
  const classificationParts = isVariant ? parts.slice(1, -1) : parts.slice(1);
  
  // 5. Detectar categorías usando palabras clave Y glosario
  const categoriesMap = new Map();
  
  // Buscar en palabras clave explícitas
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    
    if (CATEGORY_KEYWORDS[normalized]) {
      const categorySlug = CATEGORY_KEYWORDS[normalized];
      if (!categoriesMap.has(categorySlug)) {
        categoriesMap.set(categorySlug, "General");
        console.log(`    ✅ Categoría (keyword): ${categorySlug}`);
      }
    }
  });
  
  // 🧠 Buscar objeto en glosario aprendido
  const glossaryEntry = findInGlossary(object);
  if (glossaryEntry) {
    console.log(`    🧠 Encontrado en glosario: ${object}`);
    glossaryEntry.categories.forEach(catSlug => {
      if (!categoriesMap.has(catSlug)) {
        categoriesMap.set(catSlug, "General");
        console.log(`    ✅ Categoría (glosario): ${catSlug}`);
      }
    });
  }
  
  // 6. Detectar subcategorías
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    
    if (SUBCATEGORY_KEYWORDS[normalized]) {
      const subcategory = SUBCATEGORY_KEYWORDS[normalized];
      console.log(`    🏷️  Subcategoría detectada: ${subcategory}`);
      
      categoriesMap.forEach((currentSub, categorySlug) => {
        const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
        
        for (const subs of Object.values(groups)) {
          if (subs.includes(subcategory)) {
            categoriesMap.set(categorySlug, subcategory);
            console.log(`    ✅ "${subcategory}" → ${categorySlug}`);
            break;
          }
        }
      });
    }
  });
  
  // 🧠 Aplicar subcategorías del glosario
  if (glossaryEntry) {
    glossaryEntry.subcategories.forEach(subcategory => {
      categoriesMap.forEach((currentSub, categorySlug) => {
        const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
        
        for (const subs of Object.values(groups)) {
          if (subs.includes(subcategory)) {
            categoriesMap.set(categorySlug, subcategory);
            console.log(`    ✅ "${subcategory}" → ${categorySlug} (glosario)`);
            break;
          }
        }
      });
    });
  }
  
  // 7. Convertir a resultados
  const results = [];
  categoriesMap.forEach((subcategory, categorySlug) => {
    const categoryObj = BASE_CATEGORIES.find(c => c.slug === categorySlug);
    results.push({
      categorySlug,
      categoryName: categoryObj?.name || "General",
      subcategories: [subcategory],
      variant: variant,
      object: object
    });
  });
  
  // 8. Default si no encontró nada
  if (results.length === 0) {
    return [{
      categorySlug: "life-journeys-transitions",
      categoryName: "Nature & Life Journeys",
      subcategories: ["General"],
      variant: variant,
      object: object
    }];
  }
  
  return results;
}

/**
 * 💾 GUARDAR GLOSARIO (para el index.json)
 */
export function getLearnedGlossary() {
  const glossary = {};
  
  Object.entries(LEARNED_GLOSSARY).forEach(([key, value]) => {
    glossary[key] = {
      object: value.object,
      categories: [...value.categories],
      subcategories: [...value.subcategories],
      appearances: value.appearances,
    };
  });
  
  return glossary;
}

/**
 * 📂 CARGAR GLOSARIO (desde index.json al iniciar la app)
 */
export function loadGlossary(glossary) {
  if (!glossary) return;
  
  Object.entries(glossary).forEach(([key, value]) => {
    LEARNED_GLOSSARY[key] = {
      object: value.object,
      categories: new Set(value.categories || []),
      subcategories: new Set(value.subcategories || []),
      appearances: value.appearances || 0,
    };
  });
  
  console.log(`📚 Glosario cargado: ${Object.keys(LEARNED_GLOSSARY).length} objetos`);
}

/**
 * 🔎 BÚSQUEDA INTELIGENTE
 * Ahora busca en el glosario también
 */
export function searchVideos(videos, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return videos;
  
  const normalized = normalize(searchTerm);
  
  return videos.filter(video => {
    // Búsqueda normal
    const searchableText = [
      video.name,
      video.object,
      ...(video.tags || [])
    ].filter(Boolean).join(" ");
    
    if (normalize(searchableText).includes(normalized)) {
      return true;
    }
    
    // 🧠 Búsqueda en glosario
    const glossaryEntry = findInGlossary(searchTerm);
    if (glossaryEntry) {
      // Si el objeto del video está en el glosario
      const videoObject = normalize(video.object || video.name?.split('_')[0]);
      return videoObject === normalized;
    }
    
    return false;
  });
}

// Las demás funciones permanecen igual
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach(c => grouped[c.slug] = []);
  
  videos.forEach(video => {
    if (video.categories && Array.isArray(video.categories)) {
      video.categories.forEach(catSlug => {
        if (grouped[catSlug] && !grouped[catSlug].some(v => v.name === video.name)) {
          grouped[catSlug].push(video);
        }
      });
    } else {
      const classifications = classifyVideo(video.name);
      classifications.forEach(classification => {
        const slug = classification.categorySlug;
        if (grouped[slug] && !grouped[slug].some(v => v.name === video.name)) {
          grouped[slug].push({
            ...video,
            contextSubcategories: classification.subcategories,
            contextCategory: classification.categoryName
          });
        }
      });
    }
  });
  
  return grouped;
}

export function filterByCategory(videos, categorySlug) {
  return videos.filter(video => {
    if (video.categories && Array.isArray(video.categories)) {
      return video.categories.includes(categorySlug);
    }
    const classifications = classifyVideo(video.name);
    return classifications.some(c => c.categorySlug === categorySlug);
  });
}

export function getGroupsWithSubcategories(videos, categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  const result = {};
  
  Object.entries(groups).forEach(([groupName, subcategories]) => {
    const subsWithVideos = [];
    subcategories.forEach(sub => {
      const count = videos.filter(v => {
        if (v.subcategory === sub) return true;
        if (v.contextSubcategories?.includes(sub)) return true;
        return false;
      }).length;
      if (count > 0) {
        subsWithVideos.push({ name: sub, count });
      }
    });
    if (subsWithVideos.length > 0) {
      result[groupName] = subsWithVideos;
    }
  });
  
  return result;
}

export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => {
    if (video.subcategory === subcategory) return true;
    if (video.contextSubcategories?.includes(subcategory)) return true;
    return false;
  });
    }
