/**
 * 🔍 SISTEMA DE BÚSQUEDA V5 - DETECCIÓN PRECISA
 * Corrige problemas de clasificación incorrecta
 */

// 🎯 CATEGORÍAS BASE (12 completas)
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

// 🗂️ GRUPOS
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival", "Cinco de Mayo", "Oktoberfest", "Day of the Dead"],
    "Family Days": ["Mother's Day", "Father's Day", "Grandparents Day", "Easter"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah", "Kwanzaa"],
    "American Holidays": ["MLK Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Veterans Day", "Columbus Day", "Juneteenth"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Every Candle, Every Wish"],
    "Ages": ["Baby", "Kids", "Teens", "Adult"],
    "Milestones": ["Sweet 16", "18th", "21st", "30th", "40th", "50th"],
    "Styles": ["Funny", "Belated", "Surprise"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs"],
    "Wedding": ["Wedding", "Engagement", "Proposal"],
    "Anniversary": ["Anniversary", "1 Year", "5 Years", "10 Years"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend"],
    "Parents": ["Mom", "Dad"],
    "Siblings": ["Sister", "Brother"],
    "Extended Family": ["Grandparents", "Aunt", "Uncle"],
  },
  "work": {
    "Achievements": ["New Job", "Promotion", "New Business"],
    "Graduation": ["Graduation", "College", "High School"],
    "Professions": ["Teacher", "Nurse", "Firefighter", "Police", "Military"],
    "Appreciation": ["Coworker", "Boss", "Team"],
  },
  "babies-parenting": {
    "Arrival": ["Pregnancy", "Baby Shower", "Newborn", "Twins"],
    "Parents": ["New Parents", "Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Dogs": ["Dog", "Puppy"],
    "Cats": ["Cat", "Kitten"],
    "Other": ["Pet", "Cute", "Funny"],
  },
  "support-healing-care": {
    "Health": ["Get Well", "Recovery", "Hospital"],
    "Support": ["Thinking of You", "Stay Strong"],
    "Loss": ["Sympathy", "Condolences"],
  },
  "hear-every-heart": {
    "All voices": ["Love in Every Form", "All Welcome", "Dreams Without Borders", "Multicultural"],
    "Values": ["Kindness", "Strength in Kindness", "Courage to Be", "Peace", "Unity", "Colors of the Heart"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Gratitude"],
    "Lifestyle": ["Healthy Living", "Nature"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck"],
    "Moving": ["New Home", "Housewarming"],
    "Everyday": ["Just Because", "Thank You"],
  },
};

/**
 * 🔍 MAPEO ESTRICTO: palabra → (categoría, subcategoría)
 * Evita clasificaciones incorrectas
 */
const KEYWORD_MAPPING = {
  // Holidays - ALTA PRIORIDAD
  "halloween": { category: "seasonal-global-celebrations", sub: "Halloween" },
  "ghost": { category: "seasonal-global-celebrations", sub: "Halloween" },
  "zombie": { category: "seasonal-global-celebrations", sub: "Halloween" },
  "spooky": { category: "seasonal-global-celebrations", sub: "Halloween" },
  "christmas": { category: "seasonal-global-celebrations", sub: "Christmas" },
  "xmas": { category: "seasonal-global-celebrations", sub: "Christmas" },
  "thanksgiving": { category: "seasonal-global-celebrations", sub: "Thanksgiving" },
  "easter": { category: "seasonal-global-celebrations", sub: "Easter" },
  "independence": { category: "seasonal-global-celebrations", sub: "Independence Day" },
  "july4": { category: "seasonal-global-celebrations", sub: "Independence Day" },
  "july": { category: "seasonal-global-celebrations", sub: "Independence Day" },
  "eagle": { category: "seasonal-global-celebrations", sub: "Independence Day" },
  "flag": { category: "seasonal-global-celebrations", sub: "Independence Day" },
  "veterans": { category: "seasonal-global-celebrations", sub: "Veterans Day" },
  "memorial": { category: "seasonal-global-celebrations", sub: "Memorial Day" },
  
  // Family - DEBE tener prioridad sobre holidays para mother/father
  "mother": { category: "family-friendship", sub: "Mom" },
  "mom": { category: "family-friendship", sub: "Mom" },
  "mothers": { category: "family-friendship", sub: "Mom" },
  "father": { category: "family-friendship", sub: "Dad" },
  "dad": { category: "family-friendship", sub: "Dad" },
  "fathers": { category: "family-friendship", sub: "Dad" },
  "family": { category: "family-friendship", sub: "Best Friends" },
  "friend": { category: "family-friendship", sub: "Friend" },
  
  // Birthday
  "birthday": { category: "birthdays-celebrations", sub: "Every Candle, Every Wish" },
  "bday": { category: "birthdays-celebrations", sub: "Every Candle, Every Wish" },
  "party": { category: "birthdays-celebrations", sub: "Every Candle, Every Wish" },
  
  // Love & Romance
  "love": { category: "love-weddings-anniversaries", sub: "Love" },
  "kiss": { category: "love-weddings-anniversaries", sub: "Love" },
  "hugs": { category: "love-weddings-anniversaries", sub: "Hugs" },
  "hug": { category: "love-weddings-anniversaries", sub: "Hugs" },
  "romance": { category: "love-weddings-anniversaries", sub: "Love" },
  "wedding": { category: "love-weddings-anniversaries", sub: "Wedding" },
  "anniversary": { category: "love-weddings-anniversaries", sub: "Anniversary" },
  
  // Pets
  "dog": { category: "pets-animal-lovers", sub: "Dog" },
  "dogcat": { category: "pets-animal-lovers", sub: "Dog" },
  "puppy": { category: "pets-animal-lovers", sub: "Puppy" },
  "cat": { category: "pets-animal-lovers", sub: "Cat" },
  "kitten": { category: "pets-animal-lovers", sub: "Kitten" },
  "pet": { category: "pets-animal-lovers", sub: "Pet" },
  "turtle": { category: "pets-animal-lovers", sub: "Pet" },
  
  // Work
  "graduation": { category: "work", sub: "Graduation" },
  "graduate": { category: "work", sub: "Graduation" },
  
  // Babies
  "baby": { category: "babies-parenting", sub: "Newborn" },
  "newborn": { category: "babies-parenting", sub: "Newborn" },
  "shower": { category: "babies-parenting", sub: "Baby Shower" },
};

/**
 * 🔍 Normaliza texto
 */
function normalize(text) {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

/**
 * 🎯 Detecta TODAS las categorías y subcategorías aplicables
 * IMPORTANTE: Un video solo puede estar en UNA subcategoría por categoría
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const results = new Map(); // categorySlug -> subcategory (solo UNA)
  
  // Prioridad de subcategorías (más específica primero)
  const specificityOrder = [
    "kiss", "hugs", "hug",   // Más específico en Love
    "halloween", "ghost", "zombie",  // Más específico en Holidays
    "mother", "mom", "father", "dad", // Más específico en Family
    "birthday", "party",     // Más específico en Celebrations
    "dog", "cat", "pet",     // Más específico en Pets
    "love", "romance",       // Menos específico
  ];
  
  // Ordenar partes por especificidad
  const sortedParts = parts.sort((a, b) => {
    const indexA = specificityOrder.findIndex(kw => normalize(a).includes(normalize(kw)) || normalize(kw).includes(normalize(a)));
    const indexB = specificityOrder.findIndex(kw => normalize(b).includes(normalize(kw)) || normalize(kw).includes(normalize(b)));
    
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
  
  // Para cada parte del nombre (ordenada por especificidad)
  sortedParts.forEach(part => {
    const normPart = normalize(part);
    
    // Buscar en el mapeo estricto
    Object.entries(KEYWORD_MAPPING).forEach(([keyword, mapping]) => {
      const normKeyword = normalize(keyword);
      
      // Coincidencia exacta o contiene
      if (normPart === normKeyword || normPart.includes(normKeyword) || normKeyword.includes(normPart)) {
        const categorySlug = mapping.category;
        const subcategory = mapping.sub;
        
        // Solo agregar si NO existe ya una subcategoría para esta categoría
        if (!results.has(categorySlug)) {
          results.set(categorySlug, subcategory);
        }
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
      subcategories: [subcategory] // Solo UNA subcategoría
    });
  });
  
  return finalResults;
}

/**
 * 🔎 Busca videos (sin filtrar por categoría aún)
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
 * 📊 Agrupa videos por categoría
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
 * 🎯 Filtra por categoría
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
 * 🗂️ Obtiene grupos con subcategorías (con videos)
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
 * 🎯 Filtra por subcategoría
 * CRÍTICO: Solo filtra por subcategoría, NO por búsqueda adicional
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => 
    video.contextSubcategories?.some(sub => normalize(sub) === normalize(subcategory))
  );
}

/**
 * 🎨 Obtiene categorías con resultados
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
