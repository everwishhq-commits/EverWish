/**
 * 🔍 SISTEMA DE CLASIFICACIÓN AUTOMÁTICA V6
 * Lee nombres de archivo y clasifica automáticamente sin modificar manualmente
 * Formato: objeto_categoria1_categoria2_subcategoria_variante
 * Ejemplo: octopus_animallovers_general_1A
 */

// 🎯 CATEGORÍAS BASE (las 12 oficiales de tu UI)
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
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival"],
    "Family Days": ["Mother's Day", "Father's Day", "Easter"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah"],
    "American Holidays": ["Independence Day", "Veterans Day"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Every Candle, Every Wish"],
    "Ages": ["Baby", "Kids", "Teens", "Adult"],
    "Milestones": ["Sweet 16", "21st", "30th"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs"],
    "Wedding": ["Wedding", "Engagement"],
    "Anniversary": ["Anniversary"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend"],
    "Parents": ["Mom", "Dad"],
    "Siblings": ["Sister", "Brother"],
  },
  "work": {
    "Achievements": ["New Job", "Promotion"],
    "Graduation": ["Graduation"],
    "Professions": ["Teacher", "Nurse"],
  },
  "babies-parenting": {
    "Arrival": ["Pregnancy", "Baby Shower", "Newborn"],
    "Parents": ["New Parents"],
  },
  "pets-animal-lovers": {
    "Dogs": ["Dog", "Puppy"],
    "Cats": ["Cat", "Kitten"],
    "Other": ["Pet", "Cute", "Funny"],
  },
  "support-healing-care": {
    "Health": ["Get Well", "Recovery"],
    "Support": ["Thinking of You"],
    "Loss": ["Sympathy"],
  },
  "hear-every-heart": {
    "All voices": ["Love in Every Form", "All Welcome"],
    "Values": ["Kindness", "Peace", "Unity"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation"],
    "Lifestyle": ["Healthy Living", "Nature"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck"],
    "Moving": ["New Home", "Housewarming"],
    "Everyday": ["Just Because", "Thank You"],
  },
};

/**
 * 🧠 NORMALIZACIÓN INTELIGENTE
 * Convierte texto para matching flexible
 */
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]/g, "") // solo letras y números
    .trim();
}

/**
 * 🎯 MATCHING FLEXIBLE DE CATEGORÍAS
 * Compara palabras del archivo con nombres de categorías oficiales
 */
function matchCategory(filePart) {
  const normalized = normalize(filePart);
  
  // Buscar coincidencia exacta o parcial en categorías base
  for (const cat of BASE_CATEGORIES) {
    const catName = normalize(cat.name);
    const catSlug = normalize(cat.slug);
    
    // Matching flexible
    if (
      normalized === catName ||
      normalized === catSlug ||
      normalized.includes(catName) ||
      catName.includes(normalized) ||
      normalized.includes(catSlug) ||
      catSlug.includes(normalized)
    ) {
      return cat.slug;
    }
    
    // Casos especiales
    if (normalized.includes("animal") && catSlug.includes("animal")) {
      return cat.slug;
    }
    if (normalized.includes("pet") && catSlug.includes("pet")) {
      return cat.slug;
    }
    if (normalized.includes("love") && !normalized.includes("animal")) {
      if (catSlug.includes("love")) return cat.slug;
    }
  }
  
  return null;
}

/**
 * 🏷️ MATCHING FLEXIBLE DE SUBCATEGORÍAS
 */
function matchSubcategory(filePart, categorySlug) {
  const normalized = normalize(filePart);
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  
  // Buscar en todas las subcategorías de esta categoría
  for (const subs of Object.values(groups)) {
    for (const sub of subs) {
      const subNorm = normalize(sub);
      
      if (
        normalized === subNorm ||
        normalized.includes(subNorm) ||
        subNorm.includes(normalized)
      ) {
        return sub;
      }
    }
  }
  
  return "General";
}

/**
 * 📊 CLASIFICACIÓN AUTOMÁTICA COMPLETA
 * Lee el nombre del archivo y detecta categoría + subcategoría
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const results = new Map(); // categorySlug -> subcategory
  
  console.log(`🔍 Analizando: ${filename}`);
  console.log(`📦 Partes: ${parts.join(", ")}`);
  
  // Analizar cada parte del nombre
  parts.forEach((part, index) => {
    console.log(`  🔹 Parte ${index + 1}: "${part}"`);
    
    // 1. Intentar detectar categoría
    const categorySlug = matchCategory(part);
    if (categorySlug) {
      console.log(`    ✅ Categoría encontrada: ${categorySlug}`);
      
      // Si no existe aún, agregar con subcategoría "General"
      if (!results.has(categorySlug)) {
        results.set(categorySlug, "General");
      }
    }
    
    // 2. Intentar detectar subcategoría (para todas las categorías ya detectadas)
    results.forEach((currentSub, catSlug) => {
      const detectedSub = matchSubcategory(part, catSlug);
      if (detectedSub !== "General") {
        console.log(`    ✅ Subcategoría encontrada: ${detectedSub} (en ${catSlug})`);
        results.set(catSlug, detectedSub);
      }
    });
  });
  
  // Convertir a array final
  const finalResults = [];
  results.forEach((subcategory, categorySlug) => {
    const categoryObj = BASE_CATEGORIES.find(c => c.slug === categorySlug);
    finalResults.push({
      categorySlug,
      categoryName: categoryObj?.name || "General",
      subcategories: [subcategory]
    });
  });
  
  console.log(`📊 Resultado final:`, finalResults);
  
  return finalResults.length > 0 ? finalResults : [
    {
      categorySlug: "life-journeys-transitions",
      categoryName: "Nature & Life Journeys",
      subcategories: ["General"]
    }
  ];
}

/**
 * 🔎 BÚSQUEDA DE VIDEOS
 */
export function searchVideos(videos, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return videos;
  
  const normalized = normalize(searchTerm);
  
  return videos.filter(video => {
    const searchableText = [
      video.name,
      video.object,
      ...(video.tags || [])
    ].filter(Boolean).join(" ");
    
    return normalize(searchableText).includes(normalized);
  });
}

/**
 * 📦 AGRUPAR POR CATEGORÍA BASE
 */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach(c => grouped[c.slug] = []);
  
  videos.forEach(video => {
    const classifications = detectCategoriesAndSubs(video.name);
    
    classifications.forEach(classification => {
      const slug = classification.categorySlug;
      
      if (!grouped[slug].some(v => v.name === video.name)) {
        grouped[slug].push({
          ...video,
          contextSubcategories: classification.subcategories,
          contextCategory: classification.categoryName
        });
      }
    });
  });
  
  return grouped;
}

/**
 * 🎯 FILTRAR POR CATEGORÍA
 */
export function filterByCategory(videos, categorySlug) {
  const result = [];
  
  videos.forEach(video => {
    const classifications = detectCategoriesAndSubs(video.name);
    const match = classifications.find(c => c.categorySlug === categorySlug);
    
    if (match) {
      result.push({
        ...video,
        contextSubcategories: match.subcategories,
        contextCategory: match.categoryName
      });
    }
  });
  
  return result;
}

/**
 * 🗂️ OBTENER GRUPOS CON SUBCATEGORÍAS (CON VIDEOS)
 */
export function getGroupsWithSubcategories(videos, categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  const result = {};
  
  Object.entries(groups).forEach(([groupName, subcategories]) => {
    const subsWithVideos = [];
    
    subcategories.forEach(sub => {
      const count = videos.filter(v => 
        v.contextSubcategories?.includes(sub)
      ).length;
      
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

/**
 * 🎯 FILTRAR POR SUBCATEGORÍA
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => 
    video.contextSubcategories?.some(sub => normalize(sub) === normalize(subcategory))
  );
}

/**
 * 🎨 OBTENER CATEGORÍAS CON RESULTADOS
 */
export function getCategoriesWithResults(videos, searchTerm) {
  const matchedVideos = searchVideos(videos, searchTerm);
  const grouped = groupVideosByBaseCategory(matchedVideos);
  
  const categoriesWithResults = BASE_CATEGORIES
    .map(cat => ({
      ...cat,
      count: grouped[cat.slug]?.length || 0,
      videos: grouped[cat.slug] || []
    }))
    .filter(cat => cat.count > 0);
  
  return {
    categories: categoriesWithResults,
    totalVideos: matchedVideos.length
  };
}
