/**
 * 🔍 SISTEMA DE CLASIFICACIÓN AUTOMÁTICA V8
 * - Múltiples categorías por video (zombie_halloween_birthday_1A → Holidays + Celebrations)
 * - Variantes: 1A, 2A, 3A = mismo objeto, diferente diseño
 * - "General" es subcategoría por defecto de cada grupo (NO viene del nombre)
 * - Grupos descriptivos con sentido
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

// 🗂️ GRUPOS DE SUBCATEGORÍAS REDISEÑADOS
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Seasons": ["Spring", "Summer", "Fall", "Winter", "General"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival", "Cinco de Mayo", "Oktoberfest", "Day of the Dead", "General"],
    "Family Days": ["Mother's Day", "Father's Day", "Grandparents Day", "Easter", "General"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah", "Kwanzaa", "General"],
    "American Holidays": ["MLK Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Veterans Day", "Columbus Day", "Juneteenth", "General"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Every Candle, Every Wish", "General"],
    "Life Milestones": ["Sweet 16", "18th Birthday", "21st Birthday", "30th Birthday", "40th Birthday", "50th Birthday", "General"],
    "Birthday Styles": ["Funny", "Belated", "Surprise", "General"],
    "Ages": ["Baby", "Kids", "Teens", "Adult", "General"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs", "General"],
    "Wedding Moments": ["Wedding", "Engagement", "Proposal", "General"],
    "Anniversary": ["Anniversary", "1 Year", "5 Years", "10 Years", "25 Years", "50 Years", "General"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend", "General"],
    "Parents": ["Mom", "Dad", "General"],
    "Siblings": ["Sister", "Brother", "General"],
    "Extended Family": ["Grandparents", "Aunt", "Uncle", "Cousin", "General"],
  },
  "work": {
    "Career Milestones": ["New Job", "Promotion", "New Business", "Retirement", "General"],
    "Graduation": ["Graduation", "College", "High School", "General"],
    "Professions": ["Teacher", "Nurse", "Firefighter", "Police", "Military", "General"],
    "Work Appreciation": ["Coworker", "Boss", "Team", "General"],
  },
  "babies-parenting": {
    "Baby Arrival": ["Pregnancy", "Baby Shower", "Newborn", "Twins", "General"],
    "Parenting": ["New Parents", "Mom Life", "Dad Life", "General"],
  },
  "pets-animal-lovers": {
    "Companion Animals": ["Dogs", "Cats", "General"],
    "Sea Animals": ["Fish", "Dolphins", "Whales", "Octopus", "Turtles", "General"],
    "Farm Animals": ["Horses", "Cows", "Chickens", "Pigs", "General"],
    "Flying Animals": ["Birds", "Butterflies", "Bees", "General"],
    "Wild Animals": ["Lions", "Bears", "Elephants", "General"],
    "Pet Moments": ["Cute", "Funny", "General"],
  },
  "support-healing-care": {
    "Health & Recovery": ["Get Well", "Recovery", "Hospital", "General"],
    "Emotional Support": ["Thinking of You", "Stay Strong", "General"],
    "Loss & Sympathy": ["Sympathy", "Condolences", "General"],
  },
  "hear-every-heart": {
    "Inclusivity": ["Love in Every Form", "All Welcome", "Dreams Without Borders", "Multicultural", "General"],
    "Values": ["Kindness", "Strength in Kindness", "Courage to Be", "Peace", "Unity", "Colors of the Heart", "General"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football", "Baseball", "General"],
    "Individual Sports": ["Tennis", "Golf", "Swimming", "Running", "General"],
    "Fitness": ["Gym", "Yoga", "General"],
  },
  "wellness-mindful-living": {
    "Mental Wellness": ["Self-Care", "Meditation", "Gratitude", "General"],
    "Lifestyle": ["Healthy Living", "Nature", "General"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck", "General"],
    "New Beginnings": ["New Home", "Housewarming", "Moving", "General"],
    "Everyday Moments": ["Just Because", "Thank You", "General"],
  },
};

// 🎯 MAPEO DE PALABRAS CLAVE → CATEGORÍAS
const CATEGORY_KEYWORDS = {
  // Holidays
  "halloween": "seasonal-global-celebrations",
  "christmas": "seasonal-global-celebrations",
  "xmas": "seasonal-global-celebrations",
  "thanksgiving": "seasonal-global-celebrations",
  "easter": "seasonal-global-celebrations",
  "newyear": "seasonal-global-celebrations",
  "independenceday": "seasonal-global-celebrations",
  "july4": "seasonal-global-celebrations",
  "valentine": "seasonal-global-celebrations",
  "valentines": "seasonal-global-celebrations",
  "mothersday": "seasonal-global-celebrations",
  "fathersday": "seasonal-global-celebrations",
  "holidays": "seasonal-global-celebrations",
  "seasonal": "seasonal-global-celebrations",
  
  // Celebrations
  "birthday": "birthdays-celebrations",
  "bday": "birthdays-celebrations",
  "celebration": "birthdays-celebrations",
  "celebrations": "birthdays-celebrations",
  
  // Love & Romance
  "love": "love-weddings-anniversaries",
  "romance": "love-weddings-anniversaries",
  "wedding": "love-weddings-anniversaries",
  "anniversary": "love-weddings-anniversaries",
  "hugs": "love-weddings-anniversaries",
  
  // Family & Friendship
  "family": "family-friendship",
  "friendship": "family-friendship",
  "friend": "family-friendship",
  "mom": "family-friendship",
  "dad": "family-friendship",
  "mother": "family-friendship",
  "father": "family-friendship",
  
  // Work
  "work": "work",
  "job": "work",
  "career": "work",
  "graduation": "work",
  "professional": "work",
  
  // Babies
  "baby": "babies-parenting",
  "babies": "babies-parenting",
  "newborn": "babies-parenting",
  "parenting": "babies-parenting",
  
  // Animals
  "animals": "pets-animal-lovers",
  "animallovers": "pets-animal-lovers",
  "pets": "pets-animal-lovers",
  "pet": "pets-animal-lovers",
  "dog": "pets-animal-lovers",
  "cat": "pets-animal-lovers",
  "seaanimals": "pets-animal-lovers",
  "flyinganimals": "pets-animal-lovers",
  "wildanimals": "pets-animal-lovers",
  "farmanimals": "pets-animal-lovers",
  
  // Support
  "support": "support-healing-care",
  "healing": "support-healing-care",
  "care": "support-healing-care",
  "getwell": "support-healing-care",
  
  // Connection
  "diversity": "hear-every-heart",
  "connection": "hear-every-heart",
  "inclusivity": "hear-every-heart",
  
  // Sports
  "sports": "sports",
  "fitness": "sports",
  
  // Wellness
  "wellness": "wellness-mindful-living",
  "mindful": "wellness-mindful-living",
  "meditation": "wellness-mindful-living",
  
  // Life Journeys
  "nature": "life-journeys-transitions",
  "journeys": "life-journeys-transitions",
  "transitions": "life-journeys-transitions",
  "newbeginnings": "life-journeys-transitions",
};

// 🏷️ MAPEO DE PALABRAS CLAVE → SUBCATEGORÍAS
const SUBCATEGORY_KEYWORDS = {
  // Holidays
  "halloween": "Halloween",
  "christmas": "Christmas",
  "thanksgiving": "Thanksgiving",
  "easter": "Easter",
  "newyear": "New Year",
  "independenceday": "Independence Day",
  "july4": "Independence Day",
  "valentine": "Valentine's Day",
  "valentines": "Valentine's Day",
  "mothersday": "Mother's Day",
  "fathersday": "Father's Day",
  
  // Celebrations
  "birthday": "Birthday",
  
  // Love
  "love": "Love",
  "hugs": "Hugs",
  "wedding": "Wedding",
  "anniversary": "Anniversary",
  
  // Animals - Grupos
  "seaanimals": "Sea Animals",
  "flyinganimals": "Flying Animals",
  "wildanimals": "Wild Animals",
  "farmanimals": "Farm Animals",
  "companionanimals": "Companion Animals",
  
  // Animals - Companion
  "dogs": "Dogs",
  "dog": "Dogs",
  "cats": "Cats",
  "cat": "Cats",
  
  // Animals - Sea
  "octopus": "Sea Animals",
  "turtle": "Sea Animals",
  "turtles": "Sea Animals",
  "fish": "Sea Animals",
  "dolphin": "Sea Animals",
  "dolphins": "Sea Animals",
  "whale": "Sea Animals",
  "whales": "Sea Animals",
  
  // Animals - Flying
  "butterfly": "Flying Animals",
  "butterflies": "Flying Animals",
  "bird": "Flying Animals",
  "birds": "Flying Animals",
  "bee": "Flying Animals",
  "bees": "Flying Animals",
  
  // Animals - Farm
  "horse": "Farm Animals",
  "horses": "Farm Animals",
  "cow": "Farm Animals",
  "cows": "Farm Animals",
  "chicken": "Farm Animals",
  "chickens": "Farm Animals",
  "pig": "Farm Animals",
  "pigs": "Farm Animals",
  
  // Animals - Wild
  "lion": "Wild Animals",
  "lions": "Wild Animals",
  "bear": "Wild Animals",
  "bears": "Wild Animals",
  "elephant": "Wild Animals",
  "elephants": "Wild Animals",
  
  // Pet Moments
  "cute": "Cute",
  "funny": "Funny",
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
 * 📊 CLASIFICACIÓN AUTOMÁTICA MULTI-CATEGORÍA
 * Formato: objeto_cat1_cat2_sub1_sub2_variante
 * Ejemplo: zombie_halloween_birthday_1A
 * Ejemplo: butterfly_easter_flyinganimals_1A
 * Ejemplo: octopus_animallovers_1A
 */
export function detectCategoriesAndSubs(filename) {
  const parts = filename.toLowerCase().split(/[_\s-]+/);
  const categoriesMap = new Map(); // categorySlug → subcategory
  
  console.log(`\n🔍 Analizando: ${filename}`);
  console.log(`📦 Partes: ${parts.join(", ")}`);
  
  // 1. Extraer variante (última parte: 1A, 2A, 3A...)
  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  // 2. Primera parte = objeto (NO se usa para clasificación)
  const objectPart = parts[0];
  console.log(`  🎨 Objeto: "${objectPart}" | Variante: "${variant}"`);
  
  // 3. Partes del medio = categorías + subcategorías
  const classificationParts = isVariant ? parts.slice(1, -1) : parts.slice(1);
  
  // 4. Detectar TODAS las categorías
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    
    // Buscar categoría
    if (CATEGORY_KEYWORDS[normalized]) {
      const categorySlug = CATEGORY_KEYWORDS[normalized];
      
      if (!categoriesMap.has(categorySlug)) {
        categoriesMap.set(categorySlug, "General"); // Default
        console.log(`  ✅ Categoría detectada: ${categorySlug}`);
      }
    }
  });
  
  // 5. Detectar subcategorías para cada categoría
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    
    // Buscar subcategoría
    if (SUBCATEGORY_KEYWORDS[normalized]) {
      const subcategory = SUBCATEGORY_KEYWORDS[normalized];
      
      // Asignar subcategoría a la(s) categoría(s) correspondiente(s)
      categoriesMap.forEach((currentSub, categorySlug) => {
        const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
        
        // Verificar si esta subcategoría existe en esta categoría
        for (const subs of Object.values(groups)) {
          if (subs.includes(subcategory)) {
            categoriesMap.set(categorySlug, subcategory);
            console.log(`  ✅ Subcategoría asignada: ${subcategory} → ${categorySlug}`);
            break;
          }
        }
      });
    }
  });
  
  // 6. Convertir a array de resultados
  const finalResults = [];
  categoriesMap.forEach((subcategory, categorySlug) => {
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
  
  // 7. Si no se detectó ninguna categoría → Life Journeys por defecto
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
 * 🗂️ OBTENER GRUPOS CON SUBCATEGORÍAS (SOLO con videos)
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
