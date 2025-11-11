/**
 * 🔍 SISTEMA DE CLASIFICACIÓN AUTOMÁTICA V7
 * - Muestra subcategorías aunque estén vacías
 * - Cada grupo tiene "General"
 * - No crea subcategorías del objeto
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

// 🗂️ GRUPOS DE SUBCATEGORÍAS (cada grupo tiene "General" ahora)
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Seasonal": ["Spring", "Summer", "Fall", "Winter", "General"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival", "Cinco de Mayo", "Oktoberfest", "Day of the Dead", "General"],
    "Family Days": ["Mother's Day", "Father's Day", "Grandparents Day", "Easter", "General"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah", "Kwanzaa", "General"],
    "American Holidays": ["MLK Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Veterans Day", "Columbus Day", "Juneteenth", "General"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Every Candle, Every Wish", "General"],
    "Ages": ["Baby", "Kids", "Teens", "Adult", "General"],
    "Milestones": ["Sweet 16", "18th", "21st", "30th", "40th", "50th", "General"],
    "Styles": ["Funny", "Belated", "Surprise", "General"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs", "General"],
    "Wedding": ["Wedding", "Engagement", "Proposal", "General"],
    "Anniversary": ["Anniversary", "1 Year", "5 Years", "10 Years", "General"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend", "General"],
    "Parents": ["Mom", "Dad", "General"],
    "Siblings": ["Sister", "Brother", "General"],
    "Extended Family": ["Grandparents", "Aunt", "Uncle", "General"],
  },
  "work": {
    "Achievements": ["New Job", "Promotion", "New Business", "General"],
    "Graduation": ["Graduation", "College", "High School", "General"],
    "Professions": ["Teacher", "Nurse", "Firefighter", "Police", "Military", "General"],
    "Appreciation": ["Coworker", "Boss", "Team", "General"],
  },
  "babies-parenting": {
    "Arrival": ["Pregnancy", "Baby Shower", "Newborn", "Twins", "General"],
    "Parents": ["New Parents", "Mom Life", "Dad Life", "General"],
  },
  "pets-animal-lovers": {
    "Dogs": ["Dog", "Puppy", "General"],
    "Cats": ["Cat", "Kitten", "General"],
    "Other": ["Pet", "Cute", "Funny", "General"],
  },
  "support-healing-care": {
    "Health": ["Get Well", "Recovery", "Hospital", "General"],
    "Support": ["Thinking of You", "Stay Strong", "General"],
    "Loss": ["Sympathy", "Condolences", "General"],
  },
  "hear-every-heart": {
    "All voices": ["Love in Every Form", "All Welcome", "Dreams Without Borders", "Multicultural", "General"],
    "Values": ["Kindness", "Strength in Kindness", "Courage to Be", "Peace", "Unity", "Colors of the Heart", "General"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football", "General"],
    "Fitness": ["Gym", "Yoga", "General"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Gratitude", "General"],
    "Lifestyle": ["Healthy Living", "Nature", "General"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck", "General"],
    "Moving": ["New Home", "Housewarming", "General"],
    "Everyday": ["Just Because", "Thank You", "General"],
  },
};

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
 * 🎯 MATCHING DE CATEGORÍAS (NO del objeto)
 */
function matchCategory(filePart) {
  const normalized = normalize(filePart);
  
  for (const cat of BASE_CATEGORIES) {
    const catName = normalize(cat.name);
    const catSlug = normalize(cat.slug);
    
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
  }
  
  return null;
}

/**
 * 🏷️ MATCHING DE SUBCATEGORÍAS (SOLO de las definidas, NO del objeto)
 */
function matchSubcategory(filePart, categorySlug) {
  const normalized = normalize(filePart);
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  
  // Buscar en subcategorías definidas
  for (const subs of Object.values(groups)) {
    for (const sub of subs) {
      const subNorm = normalize(sub);
      
      // Coincidencia exacta o muy cercana
      if (normalized === subNorm || normalized.includes(subNorm) || subNorm.includes(normalized)) {
        return sub;
      }
    }
  }
  
  // Si no encuentra ninguna subcategoría definida → "General"
  return "General";
}

/**
 * 📊 CLASIFICACIÓN AUTOMÁTICA
 * Formato: objeto_categoria_subcategoria_variante
 * Ejemplo: octopus_animallovers_general_1A
 * 
 * Variantes:
 * - 1A, 2A, 3A = diferentes diseños del mismo objeto
 * - 1B, 2B = variantes premium o alternativas
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const results = new Map();
  
  console.log(`🔍 Analizando: ${filename}`);
  console.log(`📦 Partes: ${parts.join(", ")}`);
  
  // Extraer variante (última parte: 1A, 2A, 1B, etc)
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  if (isVariant) {
    console.log(`  🎨 Variante: "${variant}"`);
  }
  
  // Primera parte = objeto (lo ignoramos para clasificación)
  const objectPart = parts[0];
  console.log(`  🎨 Objeto: "${objectPart}"`);
  
  // Partes del medio = categoría + subcategoría (sin variante)
  const classificationParts = isVariant ? parts.slice(1, -1) : parts.slice(1);
  
  classificationParts.forEach((part, index) => {
    console.log(`  🔹 Parte ${index + 2}: "${part}"`);
    
    // 1. Detectar categoría
    const categorySlug = matchCategory(part);
    if (categorySlug) {
      console.log(`    ✅ Categoría: ${categorySlug}`);
      
      if (!results.has(categorySlug)) {
        results.set(categorySlug, "General");
      }
    }
    
    // 2. Detectar subcategoría (solo si ya hay categoría)
    results.forEach((currentSub, catSlug) => {
      const detectedSub = matchSubcategory(part, catSlug);
      if (detectedSub !== "General") {
        console.log(`    ✅ Subcategoría: ${detectedSub}`);
        results.set(catSlug, detectedSub);
      }
    });
  });
  
  // Convertir a array
  const finalResults = [];
  results.forEach((subcategory, categorySlug) => {
    const categoryObj = BASE_CATEGORIES.find(c => c.slug === categorySlug);
    finalResults.push({
      categorySlug,
      categoryName: categoryObj?.name || "General",
      subcategories: [subcategory],
      variant: variant,
      object: objectPart
    });
  });
  
  console.log(`📊 Clasificación final:`, finalResults);
  
  return finalResults.length > 0 ? finalResults : [
    {
      categorySlug: "life-journeys-transitions",
      categoryName: "Nature & Life Journeys",
      subcategories: ["General"],
      variant: variant,
      object: objectPart
    }
  ];
}

/**
 * 🔎 BÚSQUEDA
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
 * 📦 AGRUPAR POR CATEGORÍA
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
 * 🗂️ OBTENER GRUPOS CON SUBCATEGORÍAS
 * ✅ SOLO MUESTRA las subcategorías que tienen videos
 */
export function getGroupsWithSubcategories(videos, categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  const result = {};
  
  Object.entries(groups).forEach(([groupName, subcategories]) => {
    const subsWithVideos = [];
    
    // Solo agregar subcategorías que tienen videos
    subcategories.forEach(sub => {
      const count = videos.filter(v => 
        v.contextSubcategories?.includes(sub)
      ).length;
      
      // ✅ Solo agregar si tiene videos (count > 0)
      if (count > 0) {
        subsWithVideos.push({ name: sub, count });
      }
    });
    
    // ✅ Solo agregar el grupo si tiene subcategorías con videos
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
