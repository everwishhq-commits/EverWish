/**
 * 🗺️ MAPEO SIMPLE DE PALABRAS → CATEGORÍAS
 * 
 * REGLA: Cualquier palabra aquí será reconocida automáticamente
 * FÁCIL: Solo agrega o quita palabras sin tocar código
 */

// 📋 Mapeo directo: palabra → categoría base
export const KEYWORD_TO_CATEGORY = {
  // ========== HOLIDAYS ==========
  halloween: "seasonal-global-celebrations",
  pumpkin: "seasonal-global-celebrations",
  ghost: "seasonal-global-celebrations",
  witch: "seasonal-global-celebrations",
  zombie: "seasonal-global-celebrations",
  
  thanksgiving: "seasonal-global-celebrations",
  turkey: "seasonal-global-celebrations",
  
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  santa: "seasonal-global-celebrations",
  reindeer: "seasonal-global-celebrations",
  snowman: "seasonal-global-celebrations",
  
  easter: "seasonal-global-celebrations",
  bunny: "seasonal-global-celebrations",
  egg: "seasonal-global-celebrations",
  
  newyear: "seasonal-global-celebrations",
  firework: "seasonal-global-celebrations",
  
  diwali: "seasonal-global-celebrations",
  hanukkah: "seasonal-global-celebrations",
  ramadan: "seasonal-global-celebrations",
  eid: "seasonal-global-celebrations",
  
  stpatrick: "seasonal-global-celebrations",
  cincodemayo: "seasonal-global-celebrations",
  veteransday: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  
  // ========== BIRTHDAYS & CELEBRATIONS ==========
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  surprise: "birthdays-celebrations",
  
  // ========== LOVE & ROMANCE ==========
  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  valentine: "love-weddings-anniversaries",
  heart: "love-weddings-anniversaries",
  kiss: "love-weddings-anniversaries",
  hug: "love-weddings-anniversaries",
  
  wedding: "love-weddings-anniversaries",
  bride: "love-weddings-anniversaries",
  groom: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  
  anniversary: "love-weddings-anniversaries",
  
  // ========== FAMILY & FRIENDSHIP ==========
  family: "family-friendship",
  mom: "family-friendship",
  dad: "family-friendship",
  mother: "family-friendship",
  father: "family-friendship",
  parents: "family-friendship",
  siblings: "family-friendship",
  
  friend: "family-friendship",
  friendship: "family-friendship",
  bestfriend: "family-friendship",
  
  // ========== WORK ==========
  graduation: "work",
  graduate: "work",
  job: "work",
  promotion: "work",
  retirement: "work",
  work: "work",
  office: "work",
  
  // ========== BABIES & PARENTING ==========
  baby: "babies-parenting",
  newborn: "babies-parenting",
  babyshower: "babies-parenting",
  pregnancy: "babies-parenting",
  
  // ========== PETS & ANIMALS ==========
  dog: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  puppy: "pets-animal-lovers",
  kitten: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  
  turtle: "pets-animal-lovers",
  fish: "pets-animal-lovers",
  bird: "pets-animal-lovers",
  rabbit: "pets-animal-lovers",
  hamster: "pets-animal-lovers",
  
  cow: "pets-animal-lovers",
  pig: "pets-animal-lovers",
  chicken: "pets-animal-lovers",
  horse: "pets-animal-lovers",
  farm: "pets-animal-lovers",
  
  wild: "pets-animal-lovers",
  zoo: "pets-animal-lovers",
  
  // ========== SUPPORT & CARE ==========
  getwell: "support-healing-care",
  health: "support-healing-care",
  hospital: "support-healing-care",
  recovery: "support-healing-care",
  
  condolence: "support-healing-care",
  sympathy: "support-healing-care",
  rip: "support-healing-care",
  
  support: "support-healing-care",
  encouragement: "support-healing-care",
  
  // ========== CONNECTION ==========
  pride: "hear-every-heart",
  diversity: "hear-every-heart",
  unity: "hear-every-heart",
  community: "hear-every-heart",
  
  // ========== SPORTS ==========
  sport: "sports",
  football: "sports",
  soccer: "sports",
  basketball: "sports",
  baseball: "sports",
  tennis: "sports",
  gym: "sports",
  fitness: "sports",
  
  // ========== WELLNESS ==========
  meditation: "wellness-mindful-living",
  yoga: "wellness-mindful-living",
  mindfulness: "wellness-mindful-living",
  relaxation: "wellness-mindful-living",
  spa: "wellness-mindful-living",
  
  // ========== LIFE JOURNEYS ==========
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  
  travel: "life-journeys-transitions",
  vacation: "life-journeys-transitions",
  trip: "life-journeys-transitions",
  adventure: "life-journeys-transitions",
  
  nature: "life-journeys-transitions",
  outdoor: "life-journeys-transitions",
  camping: "life-journeys-transitions",
};

// 📋 Mapeo: palabra → subcategoría
export const KEYWORD_TO_SUBCATEGORY = {
  // Holidays
  halloween: "Halloween",
  thanksgiving: "Thanksgiving",
  christmas: "Christmas",
  easter: "Easter",
  newyear: "New Year",
  valentine: "Valentine's Day",
  
  diwali: "Diwali",
  hanukkah: "Hanukkah",
  ramadan: "Ramadan & Eid",
  stpatrick: "St Patrick's Day",
  cincodemayo: "Cinco de Mayo",
  veteransday: "Veterans Day",
  july4: "Independence Day",
  
  // Love
  love: "Love & Affection",
  romance: "Romantic Moments",
  hug: "Warm Hugs",
  wedding: "Wedding Celebration",
  engagement: "Engagement Joy",
  anniversary: "Anniversary Celebration",
  
  // Family
  family: "Family Gathering",
  friend: "Friendship Appreciation",
  
  // Work
  graduation: "Graduation Celebration",
  job: "New Job Celebration",
  promotion: "Promotion Success",
  retirement: "Retirement Celebration",
  
  // Babies
  baby: "Baby Arrival",
  babyshower: "Baby Shower",
  
  // Pets
  dog: "Furry Companions",
  cat: "Household Friends",
  turtle: "Underwater Universe",
  fish: "Underwater Universe",
  bird: "Wings in Motion",
  farm: "Barnyard Companions",
  wild: "Amazing Life",
  
  // Support
  getwell: "Get Well Soon",
  condolence: "Condolence Message",
  support: "Stay Strong",
  
  // Sports
  gym: "Fitness & Training Journey",
  sport: "Team Sports Energy",
  
  // Wellness
  meditation: "Meditation Practice",
  yoga: "Yoga Practice",
  spa: "Self-Care Reminder",
  
  // Life Journeys
  newhome: "New Home Celebration",
  newbeginning: "New Chapter Beginning",
  travel: "Travel Adventure",
  nature: "Nature Appreciation",
};

/**
 * Función simple: busca palabras en el nombre del archivo
 * @param {string} filename - Nombre del archivo (ej: "india_diwali_romance_1A.mp4")
 * @returns {Object} - { categories: [], subcategories: [] }
 */
export function classifyByKeywords(filename) {
  const lower = filename.toLowerCase()
    .replace(/\.mp4$/i, '')
    .replace(/_\d+[a-z]$/i, ''); // Quita "_1A" al final
  
  const words = lower.split('_').filter(Boolean);
  
  const categories = new Set();
  const subcategories = new Set();
  
  // Buscar cada palabra en los mapeos
  words.forEach(word => {
    // Buscar categoría
    if (KEYWORD_TO_CATEGORY[word]) {
      categories.add(KEYWORD_TO_CATEGORY[word]);
    }
    
    // Buscar subcategoría
    if (KEYWORD_TO_SUBCATEGORY[word]) {
      subcategories.add(KEYWORD_TO_SUBCATEGORY[word]);
    }
  });
  
  // Si no encontró nada, usar "general"
  if (categories.size === 0) {
    categories.add("general");
  }
  
  return {
    categories: [...categories],
    subcategories: [...subcategories],
    searchTerms: words, // Todas las palabras son términos de búsqueda
  };
}

/**
 * Busca videos por palabra clave
 * @param {Array} videos - Array de videos del index.json
 * @param {string} query - Palabra a buscar
 * @returns {Array} - Videos que coinciden
 */
export function searchByKeyword(videos, query) {
  const q = query.toLowerCase().trim();
  
  return videos.filter(video => {
    // Buscar en el nombre del archivo
    if (video.name.toLowerCase().includes(q)) return true;
    
    // Buscar en términos de búsqueda
    if (video.searchTerms?.some(term => term.includes(q))) return true;
    
    // Buscar en categorías
    if (video.categories?.some(cat => cat.toLowerCase().includes(q))) return true;
    
    // Buscar en subcategorías
    if (video.subcategories?.some(sub => sub.toLowerCase().includes(q))) return true;
    
    return false;
  });
}
