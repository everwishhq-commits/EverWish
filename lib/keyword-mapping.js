/**
 * 🎯 SISTEMA DE CLASIFICACIÓN POR FORMATO DE NOMBRE
 * 
 * Formato esperado: objeto_subcategoria_categoria_variante.mp4
 * Ejemplo: pumpkin_halloween_general_1A.mp4
 */

// Mapeo de subcategorías a categorías base
export const SUBCATEGORY_TO_CATEGORY = {
  // ========== HOLIDAYS (seasonal-global-celebrations) ==========
  "halloween": "seasonal-global-celebrations",
  "thanksgiving": "seasonal-global-celebrations",
  "christmas": "seasonal-global-celebrations",
  "easter": "seasonal-global-celebrations",
  "newyear": "seasonal-global-celebrations",
  "valentines": "seasonal-global-celebrations",
  "mothersday": "seasonal-global-celebrations",
  "fathersday": "seasonal-global-celebrations",
  "diwali": "seasonal-global-celebrations",
  "hanukkah": "seasonal-global-celebrations",
  "ramadan": "seasonal-global-celebrations",
  "stpatrick": "seasonal-global-celebrations",
  "cincodemayo": "seasonal-global-celebrations",
  "veteransday": "seasonal-global-celebrations",
  "july4": "seasonal-global-celebrations",
  "independenceday": "seasonal-global-celebrations",
  
  // Estaciones
  "spring": "seasonal-global-celebrations",
  "summer": "seasonal-global-celebrations",
  "fall": "seasonal-global-celebrations",
  "autumn": "seasonal-global-celebrations",
  "winter": "seasonal-global-celebrations",
  
  // ========== CELEBRATIONS (birthdays-celebrations) ==========
  "birthday": "birthdays-celebrations",
  "party": "birthdays-celebrations",
  "celebration": "birthdays-celebrations",
  "surprise": "birthdays-celebrations",
  "milestone": "birthdays-celebrations",
  
  // ========== LOVE & ROMANCE (love-weddings-anniversaries) ==========
  "love": "love-weddings-anniversaries",
  "romance": "love-weddings-anniversaries",
  "valentine": "love-weddings-anniversaries",
  "wedding": "love-weddings-anniversaries",
  "engagement": "love-weddings-anniversaries",
  "anniversary": "love-weddings-anniversaries",
  "bridal": "love-weddings-anniversaries",
  "hugs": "love-weddings-anniversaries",
  
  // ========== FAMILY & FRIENDSHIP (family-friendship) ==========
  "family": "family-friendship",
  "friendship": "family-friendship",
  "bestfriend": "family-friendship",
  "siblings": "family-friendship",
  "reunion": "family-friendship",
  
  // ========== WORK (work) ==========
  "graduation": "work",
  "job": "work",
  "promotion": "work",
  "retirement": "work",
  "work": "work",
  "career": "work",
  "success": "work",
  
  // ========== BABIES & PARENTING (babies-parenting) ==========
  "baby": "babies-parenting",
  "newborn": "babies-parenting",
  "babyshower": "babies-parenting",
  "pregnancy": "babies-parenting",
  "adoption": "babies-parenting",
  "firststeps": "babies-parenting",
  
  // ========== PETS & ANIMALS (pets-animal-lovers) ==========
  "pets": "pets-animal-lovers",
  "dog": "pets-animal-lovers",
  "cat": "pets-animal-lovers",
  "animal": "pets-animal-lovers",
  "furry": "pets-animal-lovers",
  "farm": "pets-animal-lovers",
  "wild": "pets-animal-lovers",
  "sea": "pets-animal-lovers",
  "underwater": "pets-animal-lovers",
  "bird": "pets-animal-lovers",
  "wings": "pets-animal-lovers",
  
  // ========== SUPPORT & CARE (support-healing-care) ==========
  "getwell": "support-healing-care",
  "health": "support-healing-care",
  "recovery": "support-healing-care",
  "condolence": "support-healing-care",
  "sympathy": "support-healing-care",
  "support": "support-healing-care",
  "encouragement": "support-healing-care",
  "healing": "support-healing-care",
  
  // ========== CONNECTION (hear-every-heart) ==========
  "pride": "hear-every-heart",
  "diversity": "hear-every-heart",
  "unity": "hear-every-heart",
  "community": "hear-every-heart",
  "inclusion": "hear-every-heart",
  
  // ========== SPORTS (sports) ==========
  "sports": "sports",
  "fitness": "sports",
  "gym": "sports",
  "team": "sports",
  "championship": "sports",
  "victory": "sports",
  "training": "sports",
  
  // ========== WELLNESS (wellness-mindful-living) ==========
  "meditation": "wellness-mindful-living",
  "yoga": "wellness-mindful-living",
  "mindfulness": "wellness-mindful-living",
  "wellness": "wellness-mindful-living",
  "spa": "wellness-mindful-living",
  "relaxation": "wellness-mindful-living",
  
  // ========== LIFE JOURNEYS (life-journeys-transitions) ==========
  "newhome": "life-journeys-transitions",
  "newbeginning": "life-journeys-transitions",
  "moving": "life-journeys-transitions",
  "travel": "life-journeys-transitions",
  "adventure": "life-journeys-transitions",
  "nature": "life-journeys-transitions",
  "outdoor": "life-journeys-transitions",
  "landscape": "life-journeys-transitions",
};

// Mapeo de subcategorías a nombres descriptivos
export const SUBCATEGORY_DISPLAY_NAMES = {
  "halloween": "Halloween",
  "thanksgiving": "Thanksgiving",
  "christmas": "Christmas",
  "easter": "Easter",
  "newyear": "New Year",
  "valentines": "Valentine's Day",
  "mothersday": "Mother's Day",
  "fathersday": "Father's Day",
  
  "birthday": "Birthday Celebration",
  "party": "Surprise Party",
  
  "love": "Love & Affection",
  "romance": "Romantic Moments",
  "hugs": "Warm Hugs",
  "wedding": "Wedding Celebration",
  "engagement": "Engagement Joy",
  "anniversary": "Anniversary Celebration",
  
  "family": "Family Gathering",
  "friendship": "Friendship Appreciation",
  
  "graduation": "Graduation Celebration",
  "job": "New Job Celebration",
  "promotion": "Promotion Success",
  "retirement": "Retirement Celebration",
  
  "baby": "Baby Arrival",
  "babyshower": "Baby Shower",
  
  "pets": "Furry Companions",
  "dog": "Furry Companions",
  "cat": "Household Friends",
  "farm": "Barnyard Companions",
  "underwater": "Underwater Universe",
  "sea": "Underwater Universe",
  "bird": "Wings in Motion",
  "wings": "Wings in Motion",
  "wild": "Amazing Life",
  
  "getwell": "Get Well Soon",
  "condolence": "Condolence Message",
  "support": "Stay Strong",
  
  "sports": "Team Sports Energy",
  "fitness": "Fitness & Training Journey",
  "gym": "Gym Motivation",
  
  "meditation": "Meditation Practice",
  "yoga": "Yoga Practice",
  "spa": "Self-Care Reminder",
  
  "newhome": "New Home Celebration",
  "newbeginning": "New Chapter Beginning",
  "travel": "Travel Adventure",
  "nature": "Nature Appreciation",
  "outdoor": "Outdoor Adventure Moment",
  "landscape": "Beautiful Landscape Scene",
};

/**
 * Clasifica un archivo según su formato de nombre
 * Formato: objeto_subcategoria_categoria_variante.mp4
 * 
 * @param {string} filename - Nombre del archivo
 * @returns {Object} - { categories, subcategories, searchTerms, object }
 */
export function classifyByFilename(filename) {
  // Remover extensión y variante
  const nameWithoutExt = filename.replace(/\.mp4$/i, '');
  const nameWithoutVariant = nameWithoutExt.replace(/_\d+[A-Z]$/i, '');
  
  // Dividir en partes: [objeto, subcategoria, categoria]
  const parts = nameWithoutVariant.split('_').filter(Boolean);
  
  console.log(`📹 Procesando: ${filename}`);
  console.log(`   Partes detectadas: ${parts.join(' | ')}`);
  
  if (parts.length < 2) {
    console.log(`   ⚠️  Formato incorrecto (mínimo 2 partes)`);
    return {
      categories: ["general"],
      subcategories: [],
      searchTerms: parts,
      object: parts[0] || "Unknown",
    };
  }
  
  // Extraer partes
  const object = parts[0]; // Primera parte es el objeto
  const subcategoryPart = parts[1]?.toLowerCase(); // Segunda parte es subcategoría
  
  // Buscar la categoría base según la subcategoría
  const category = SUBCATEGORY_TO_CATEGORY[subcategoryPart];
  
  if (!category) {
    console.log(`   ⚠️  Subcategoría "${subcategoryPart}" no encontrada en mapeo`);
    return {
      categories: ["general"],
      subcategories: [subcategoryPart],
      searchTerms: parts,
      object: object.charAt(0).toUpperCase() + object.slice(1),
    };
  }
  
  // Obtener nombre descriptivo de la subcategoría
  const subcategoryName = SUBCATEGORY_DISPLAY_NAMES[subcategoryPart] || 
                          subcategoryPart.charAt(0).toUpperCase() + subcategoryPart.slice(1);
  
  console.log(`   ✅ Categoría: ${category}`);
  console.log(`   ✅ Subcategoría: ${subcategoryName}`);
  
  return {
    categories: [category],
    subcategories: [subcategoryName],
    searchTerms: parts, // Todas las partes son términos de búsqueda
    object: object.charAt(0).toUpperCase() + object.slice(1),
  };
}

// Exportar también con el nombre anterior para compatibilidad
export const classifyByKeywords = classifyByFilename;

/**
 * Busca videos por palabra clave
 */
export function searchByKeyword(videos, query) {
  const q = query.toLowerCase().trim();
  
  return videos.filter(video => {
    if (video.name.toLowerCase().includes(q)) return true;
    if (video.object?.toLowerCase().includes(q)) return true;
    if (video.searchTerms?.some(term => term.toLowerCase().includes(q))) return true;
    if (video.categories?.some(cat => cat.toLowerCase().includes(q))) return true;
    if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) return true;
    return false;
  });
}
