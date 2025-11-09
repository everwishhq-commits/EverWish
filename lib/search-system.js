/**
 * 🔍 SISTEMA DE BÚSQUEDA INTELIGENTE
 * Clasifica automáticamente videos según nombre de archivo
 * Sin necesidad de modificar código para cada palabra nueva
 */

// 🎯 CATEGORÍAS BASE (estructura fija de la UI)
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

/**
 * 🧠 PALABRAS CLAVE → CATEGORÍA
 * Mapeo flexible para clasificación automática
 */
const CATEGORY_KEYWORDS = {
  "seasonal-global-celebrations": [
    "halloween", "christmas", "xmas", "thanksgiving", "easter", "holiday",
    "newyear", "valentines", "valentine", "independence", "july4",
    "spring", "summer", "fall", "autumn", "winter"
  ],
  "birthdays-celebrations": [
    "birthday", "celebration", "party", "anniversary", "congrats"
  ],
  "love-weddings-anniversaries": [
    "love", "wedding", "romance", "valentine", "anniversary", "heart", "hugs"
  ],
  "family-friendship": [
    "family", "friend", "mother", "father", "parent", "sibling"
  ],
  "work": [
    "work", "office", "professional", "career", "graduation"
  ],
  "babies-parenting": [
    "baby", "newborn", "parenting", "infant"
  ],
  "pets-animal-lovers": [
    "pet", "dog", "cat", "animal", "puppy", "kitten", "turtle", "bird"
  ],
  "support-healing-care": [
    "support", "healing", "care", "health", "recovery"
  ],
  "hear-every-heart": [
    "diversity", "inclusion", "unity", "connection"
  ],
  "sports": [
    "sport", "fitness", "athletic", "game"
  ],
  "wellness-mindful-living": [
    "wellness", "mindful", "meditation", "yoga", "zen"
  ],
  "life-journeys-transitions": [
    "journey", "transition", "travel", "nature", "adventure"
  ]
};

/**
 * 🔍 Normaliza texto para comparación
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
 * 🎯 Detecta categorías automáticamente desde el nombre
 */
export function detectCategoriesFromName(filename) {
  const normalized = normalize(filename);
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  
  const matchedCategories = new Set();
  
  // Buscar en cada parte del nombre
  parts.forEach(part => {
    const normalizedPart = normalize(part);
    
    // Comparar con palabras clave de cada categoría
    Object.entries(CATEGORY_KEYWORDS).forEach(([categorySlug, keywords]) => {
      if (keywords.some(keyword => {
        const normalizedKeyword = normalize(keyword);
        return normalizedPart.includes(normalizedKeyword) || 
               normalizedKeyword.includes(normalizedPart);
      })) {
        matchedCategories.add(categorySlug);
      }
    });
  });
  
  return Array.from(matchedCategories);
}

/**
 * 🔎 Busca videos por término
 */
export function searchVideos(videos, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return [];
  
  const normalized = normalize(searchTerm);
  
  return videos.filter(video => {
    // Campos donde buscar
    const searchableText = [
      video.name,
      video.object,
      video.subcategory,
      video.category,
      ...(video.categories || []),
      ...(video.tags || [])
    ].filter(Boolean).join(" ");
    
    const normalizedText = normalize(searchableText);
    
    // Búsqueda flexible
    return normalizedText.includes(normalized) ||
           normalized.split(/\s+/).some(word => normalizedText.includes(word));
  });
}

/**
 * 📊 Agrupa videos por categoría base
 */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  
  BASE_CATEGORIES.forEach(baseCat => {
    grouped[baseCat.slug] = [];
  });
  
  videos.forEach(video => {
    // Usar categories del video o detectar automáticamente
    let videoCategories = video.categories && video.categories.length > 0
      ? video.categories
      : detectCategoriesFromName(video.name);
    
    // Mapear a slugs base
    videoCategories.forEach(cat => {
      const normalizedCat = normalize(cat);
      
      // Buscar categoría base que coincida
      BASE_CATEGORIES.forEach(baseCat => {
        const normalizedSlug = normalize(baseCat.slug);
        
        if (normalizedCat.includes(normalizedSlug) || 
            normalizedSlug.includes(normalizedCat) ||
            CATEGORY_KEYWORDS[baseCat.slug]?.some(kw => 
              normalize(kw) === normalizedCat
            )) {
          if (!grouped[baseCat.slug].some(v => v.name === video.name)) {
            grouped[baseCat.slug].push(video);
          }
        }
      });
    });
  });
  
  return grouped;
}

/**
 * 🗂️ Extrae subcategorías únicas de un grupo de videos
 */
export function extractSubcategories(videos) {
  const subcats = new Set();
  
  videos.forEach(video => {
    if (video.subcategory && video.subcategory !== "General") {
      subcats.add(video.subcategory);
    }
  });
  
  return Array.from(subcats).sort();
}

/**
 * 🎯 Filtra videos por subcategoría
 */
export function filterBySubcategory(videos, subcategory) {
  const normalized = normalize(subcategory);
  
  return videos.filter(video => {
    const videoSubNorm = normalize(video.subcategory);
    const videoNameNorm = normalize(video.name);
    const videoObjNorm = normalize(video.object);
    
    return videoSubNorm === normalized ||
           videoSubNorm.includes(normalized) ||
           normalized.includes(videoSubNorm) ||
           videoNameNorm.includes(normalized) ||
           videoObjNorm.includes(normalized) ||
           (video.tags || []).some(tag => normalize(tag) === normalized);
  });
}

/**
 * 🎨 Obtiene categorías con resultados de búsqueda
 */
export function getCategoriesWithResults(videos, searchTerm) {
  const matchedVideos = searchVideos(videos, searchTerm);
  const grouped = groupVideosByBaseCategory(matchedVideos);
  
  // Filtrar solo categorías con videos
  const categoriesWithResults = BASE_CATEGORIES
    .filter(cat => grouped[cat.slug] && grouped[cat.slug].length > 0)
    .map(cat => ({
      ...cat,
      count: grouped[cat.slug].length,
      videos: grouped[cat.slug]
    }));
  
  return {
    categories: categoriesWithResults,
    totalVideos: matchedVideos.length
  };
    }
