/**
 * 🔍 SISTEMA DE BÚSQUEDA V3 - MÚLTIPLES CATEGORÍAS CORRECTAS
 * Permite que un video aparezca en varias categorías
 * Pero muestra el nombre de subcategoría APROPIADO para cada una
 */

// 🎯 CATEGORÍAS BASE
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
 * 🗂️ SUBCATEGORÍAS VÁLIDAS POR CATEGORÍA
 * Define qué palabras del nombre corresponden a cada categoría
 */
const CATEGORY_KEYWORDS = {
  "seasonal-global-celebrations": {
    keywords: ["halloween", "christmas", "xmas", "thanksgiving", "easter", "newyear", "independence", "july4", "valentine", "valentines"],
    subcategories: {
      "halloween": "Halloween",
      "christmas": "Christmas",
      "xmas": "Christmas",
      "thanksgiving": "Thanksgiving",
      "easter": "Easter",
      "newyear": "New Year",
      "independence": "Independence Day",
      "july4": "Independence Day",
      "valentine": "Valentine's Day",
      "valentines": "Valentine's Day"
    }
  },
  "birthdays-celebrations": {
    keywords: ["birthday", "celebration", "party", "congrats", "anniversary"],
    subcategories: {
      "birthday": "Birthday",
      "celebration": "Celebration",
      "party": "Party",
      "congrats": "Congratulations",
      "anniversary": "Anniversary"
    }
  },
  "love-weddings-anniversaries": {
    keywords: ["love", "wedding", "romance", "anniversary", "valentine", "valentines", "hugs"],
    subcategories: {
      "love": "Love",
      "wedding": "Wedding",
      "romance": "Romance",
      "anniversary": "Anniversary",
      "valentine": "Valentine's Day",
      "valentines": "Valentine's Day",
      "hugs": "Hugs"
    }
  },
  "family-friendship": {
    keywords: ["family", "friend", "mother", "father", "mom", "dad", "mothers", "fathers"],
    subcategories: {
      "family": "Family",
      "friend": "Friendship",
      "mother": "Mother's Day",
      "mom": "Mother's Day",
      "mothers": "Mother's Day",
      "father": "Father's Day",
      "dad": "Father's Day",
      "fathers": "Father's Day"
    }
  },
  "work": {
    keywords: ["work", "office", "professional", "career", "graduation", "graduate"],
    subcategories: {
      "work": "Work",
      "office": "Office",
      "professional": "Professional",
      "career": "Career",
      "graduation": "Graduation",
      "graduate": "Graduation"
    }
  },
  "babies-parenting": {
    keywords: ["baby", "newborn", "parenting", "infant", "shower"],
    subcategories: {
      "baby": "Baby",
      "newborn": "Newborn",
      "parenting": "Parenting",
      "infant": "Infant",
      "shower": "Baby Shower"
    }
  },
  "pets-animal-lovers": {
    keywords: ["pet", "dog", "cat", "animal", "puppy", "kitten", "turtle", "bird", "pets", "dogcat"],
    subcategories: {
      "pet": "Pets",
      "pets": "Pets",
      "dog": "Dogs",
      "cat": "Cats",
      "animal": "Animals",
      "puppy": "Puppies",
      "kitten": "Kittens",
      "turtle": "Turtles",
      "bird": "Birds",
      "dogcat": "Dogs & Cats"
    }
  },
  "support-healing-care": {
    keywords: ["support", "healing", "care", "health", "recovery", "getwell"],
    subcategories: {
      "support": "Support",
      "healing": "Healing",
      "care": "Care",
      "health": "Health",
      "recovery": "Recovery",
      "getwell": "Get Well"
    }
  },
  "hear-every-heart": {
    keywords: ["diversity", "inclusion", "unity", "connection"],
    subcategories: {
      "diversity": "Diversity",
      "inclusion": "Inclusion",
      "unity": "Unity",
      "connection": "Connection"
    }
  },
  "sports": {
    keywords: ["sport", "fitness", "athletic", "game"],
    subcategories: {
      "sport": "Sports",
      "fitness": "Fitness",
      "athletic": "Athletics",
      "game": "Games"
    }
  },
  "wellness-mindful-living": {
    keywords: ["wellness", "mindful", "meditation", "yoga", "zen"],
    subcategories: {
      "wellness": "Wellness",
      "mindful": "Mindfulness",
      "meditation": "Meditation",
      "yoga": "Yoga",
      "zen": "Zen"
    }
  },
  "life-journeys-transitions": {
    keywords: ["journey", "transition", "travel", "nature", "adventure"],
    subcategories: {
      "journey": "Life Journey",
      "transition": "Transition",
      "travel": "Travel",
      "nature": "Nature",
      "adventure": "Adventure"
    }
  }
};

/**
 * 🔍 Normaliza texto
 */
function normalize(text) {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

/**
 * 🎯 Detecta TODAS las categorías aplicables y sus subcategorías
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const results = [];
  
  // Para cada categoría base
  Object.entries(CATEGORY_KEYWORDS).forEach(([categorySlug, config]) => {
    const matches = [];
    
    // Buscar palabras que coincidan con esta categoría
    parts.forEach(part => {
      const normPart = normalize(part);
      
      // Verificar si esta parte coincide con alguna keyword de esta categoría
      config.keywords.forEach(keyword => {
        const normKeyword = normalize(keyword);
        
        if (normPart === normKeyword || normPart.includes(normKeyword) || normKeyword.includes(normPart)) {
          // Encontrar el nombre de subcategoría apropiado
          const subName = config.subcategories[keyword] || config.subcategories[part.toLowerCase()] || "General";
          matches.push(subName);
        }
      });
    });
    
    // Si hay coincidencias, agregar esta categoría
    if (matches.length > 0) {
      const categoryObj = BASE_CATEGORIES.find(c => c.slug === categorySlug);
      results.push({
        categorySlug: categorySlug,
        categoryName: categoryObj?.name || "General",
        subcategories: [...new Set(matches)] // Eliminar duplicados
      });
    }
  });
  
  return results;
}

/**
 * 🔎 Busca videos por término
 */
export function searchVideos(videos, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return [];
  
  const normalized = normalize(searchTerm);
  
  return videos.filter(video => {
    const searchableText = [
      video.name,
      video.object,
      ...(video.tags || [])
    ].filter(Boolean).join(" ");
    
    const normalizedText = normalize(searchableText);
    
    return normalizedText.includes(normalized) ||
           normalized.split(/\s+/).some(word => normalizedText.includes(word));
  });
}

/**
 * 📊 Agrupa videos por categoría base
 * Cada video puede aparecer en múltiples categorías
 */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach(c => grouped[c.slug] = []);
  
  videos.forEach(video => {
    // Detectar todas las categorías del video
    const classifications = detectCategoriesAndSubs(video.name);
    
    classifications.forEach(classification => {
      const slug = classification.categorySlug;
      
      // Agregar video con su subcategoría APROPIADA para esta categoría
      if (!grouped[slug].some(v => v.name === video.name)) {
        grouped[slug].push({
          ...video,
          contextSubcategories: classification.subcategories, // Subcategorías válidas para ESTA categoría
          contextCategory: classification.categoryName
        });
      }
    });
  });
  
  return grouped;
}

/**
 * 🎯 Filtra videos por categoría específica
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
 * 🗂️ Extrae subcategorías únicas para una categoría específica
 */
export function extractSubcategories(videos, categorySlug) {
  const subcats = new Set();
  
  videos.forEach(video => {
    if (video.contextSubcategories && Array.isArray(video.contextSubcategories)) {
      video.contextSubcategories.forEach(sub => {
        if (sub && sub !== "General") {
          subcats.add(sub);
        }
      });
    }
  });
  
  return Array.from(subcats).sort();
}

/**
 * 🎯 Filtra videos por subcategoría dentro de una categoría
 */
export function filterBySubcategory(videos, subcategory, categorySlug) {
  return videos.filter(video => {
    if (video.contextSubcategories && Array.isArray(video.contextSubcategories)) {
      return video.contextSubcategories.some(sub => 
        normalize(sub) === normalize(subcategory)
      );
    }
    return false;
  });
}

/**
 * 🎨 Obtiene categorías con resultados de búsqueda
 */
export function getCategoriesWithResults(videos, searchTerm) {
  const matchedVideos = searchVideos(videos, searchTerm);
  const grouped = groupVideosByBaseCategory(matchedVideos);
  
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
