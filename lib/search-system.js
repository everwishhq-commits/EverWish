/**
 * 🔍 SISTEMA DE BÚSQUEDA V4 - CON GRUPOS JERÁRQUICOS
 * Estructura: Categoría → Grupos → Subcategorías → Videos
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
 * 🗂️ GRUPOS DE SUBCATEGORÍAS POR CATEGORÍA
 * Estructura jerárquica: Categoría → Grupo → Subcategorías
 */
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
 * 🔍 Mapeo de palabras clave a subcategorías
 */
const KEYWORD_TO_SUBCATEGORY = {
  // Holidays
  "halloween": "Halloween",
  "christmas": "Christmas",
  "xmas": "Christmas",
  "thanksgiving": "Thanksgiving",
  "easter": "Easter",
  "spring": "Spring",
  "summer": "Summer",
  "fall": "Fall",
  "autumn": "Fall",
  "winter": "Winter",
  "valentine": "Valentine's Day",
  "valentines": "Valentine's Day",
  "independenceday": "Independence Day",
  "independence": "Independence Day",
  "july4": "Independence Day",
  "july": "Independence Day",
  "memorial": "Memorial Day",
  "veterans": "Veterans Day",
  "mlk": "MLK Day",
  "newyear": "Lunar New Year",
  
  // Celebrations
  "birthday": "Every Candle, Every Wish",
  "baby": "Baby",
  "kid": "Kids",
  "kids": "Kids",
  "teen": "Teens",
  "teens": "Teens",
  "adult": "Adult",
  
  // Love & Romance
  "love": "Love",
  "hugs": "Hugs",
  "wedding": "Wedding",
  "engagement": "Engagement",
  "anniversary": "Anniversary",
  
  // Family
  "mother": "Mom",
  "mom": "Mom",
  "mothers": "Mom",
  "father": "Dad",
  "dad": "Dad",
  "fathers": "Dad",
  "friend": "Friend",
  "friendship": "Best Friends",
  
  // Pets
  "dog": "Dog",
  "dogcat": "Dog",
  "puppy": "Puppy",
  "cat": "Cat",
  "kitten": "Kitten",
  "pet": "Pet",
  "pets": "Pet",
  "turtle": "Pet",
  "animal": "Pet",
  
  // Work
  "graduation": "Graduation",
  "graduate": "Graduation",
  
  // Babies
  "newborn": "Newborn",
  "shower": "Baby Shower",
};

/**
 * 🔍 Normaliza texto
 */
function normalize(text) {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

/**
 * 🎯 Detecta qué categorías y subcategorías aplican
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const results = new Map(); // categorySlug -> Set of subcategories
  
  // Para cada parte del nombre
  parts.forEach(part => {
    const normPart = normalize(part);
    
    // Buscar en el mapeo de keywords
    Object.entries(KEYWORD_TO_SUBCATEGORY).forEach(([keyword, subcategory]) => {
      const normKeyword = normalize(keyword);
      
      if (normPart === normKeyword || normPart.includes(normKeyword) || normKeyword.includes(normPart)) {
        // Encontrar a qué categoría pertenece esta subcategoría
        Object.entries(SUBCATEGORY_GROUPS).forEach(([categorySlug, groups]) => {
          Object.values(groups).forEach(subcategories => {
            if (subcategories.includes(subcategory)) {
              if (!results.has(categorySlug)) {
                results.set(categorySlug, new Set());
              }
              results.get(categorySlug).add(subcategory);
            }
          });
        });
      }
    });
  });
  
  // Convertir a array
  const finalResults = [];
  results.forEach((subcategories, categorySlug) => {
    const categoryObj = BASE_CATEGORIES.find(c => c.slug === categorySlug);
    finalResults.push({
      categorySlug,
      categoryName: categoryObj?.name || "General",
      subcategories: Array.from(subcategories)
    });
  });
  
  return finalResults;
}

/**
 * 🔎 Busca videos
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
 * 🗂️ Obtiene grupos con sus subcategorías (con videos)
 */
export function getGroupsWithSubcategories(videos, categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  const result = {};
  
  // Para cada grupo
  Object.entries(groups).forEach(([groupName, subcategories]) => {
    const subsWithVideos = [];
    
    // Para cada subcategoría del grupo
    subcategories.forEach(sub => {
      const count = videos.filter(v => 
        v.contextSubcategories?.includes(sub)
      ).length;
      
      if (count > 0) {
        subsWithVideos.push({ name: sub, count });
      }
    });
    
    // Solo agregar grupo si tiene subcategorías con videos
    if (subsWithVideos.length > 0) {
      result[groupName] = subsWithVideos;
    }
  });
  
  return result;
}

/**
 * 🎯 Filtra por subcategoría
 */
export function filterBySubcategory(videos, subcategory) {
  return videos.filter(video => 
    video.contextSubcategories?.some(sub => normalize(sub) === normalize(subcategory))
  );
}
