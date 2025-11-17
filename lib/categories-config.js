/**
 * 📋 CONFIGURACIÓN CENTRAL DE CATEGORÍAS
 * Aquí defines TODAS las categorías y subcategorías
 * El sistema las lee automáticamente
 */

// 🎯 CATEGORÍAS BASE (las 12 principales)
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

// 📂 GRUPOS DE SUBCATEGORÍAS POR CATEGORÍA
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": [
      "Halloween",
      "Thanksgiving", 
      "Christmas",
      "Easter",
      "New Year",
      "St Patrick's Day",
      "Cinco de Mayo"
    ],
    "Cultural Days": [
      "Valentine's Day",
      "Independence Day",
      "Mother's Day",
      "Father's Day",
      "Hanukkah",
      "Diwali",
      "Ramadan",
      "Eid",
      "Passover",
      "Day of the Dead",
      "Kwanzaa",
      "Oktoberfest"
    ],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
  },
  
  "birthdays-celebrations": {
    "Birthday": [
      "Birthday Celebration",
      "First Birthday",
      "Quinceañera",
      "Sweet 16",
      "18th Birthday",
      "21st Birthday"
    ],
    "Celebrations": [
      "Party Celebration",
      "Surprise Party",
      "Baby Shower",
      "Bridal Shower Celebration",
      "Gender Reveal"
    ],
  },
  
  "love-weddings-anniversaries": {
    "Romance": [
      "Love & Affection",
      "Warm Hugs",
      "Romantic Moments",
      "I Love You Message"
    ],
    "Wedding": [
      "Wedding Celebration",
      "Engagement Moment",
      "Proposal Moment"
    ],
    "Anniversaries": [
      "Anniversary Celebration",
      "Silver Anniversary Celebration",
      "Golden Anniversary Celebration"
    ],
  },
  
  "family-friendship": {
    "Family": [
      "Mother's Day Celebration",
      "Father's Day Celebration",
      "Family Time Together",
      "Grandparents Day Celebration"
    ],
    "Friendship": [
      "Friends Forever",
      "Best Friends Bond",
      "BFF Connection"
    ],
  },
  
  "work": {
    "Career": [
      "New Job Celebration",
      "Promotion Celebration",
      "Retirement Celebration"
    ],
    "Education": [
      "Graduation Celebration",
      "High School Graduation",
      "College Graduation"
    ],
  },
  
  "babies-parenting": {
    "Baby": [
      "Newborn Arrival",
      "New Baby Celebration",
      "Baby Shower Celebration",
      "Pregnancy Announcement",
      "Gender Reveal Moment"
    ],
    "Parenting": [
      "Mom Life Moment",
      "Dad Life Moment",
      "New Parents Celebration"
    ],
  },
  
  "pets-animal-lovers": {
    "Beloved Companions": [
      "Furry Companions",
      "Household Friends",
      "Loyal Sidekicks"
    ],
    "Farm Life": ["Barnyard Companions"],
    "Ocean Worlds": ["Underwater Universe"],
    "Sky Creatures": ["Wings in Motion"],
    "Wildlife Adventures": ["Amazing Life"],
  },
  
  "support-healing-care": {
    "Support": [
      "Get Well Wishes",
      "Thinking of You Message",
      "Stay Strong Motivation"
    ],
    "Sympathy": [
      "Condolence Message",
      "Loss & Healing",
      "In Loving Memory"
    ],
  },
  
  "hear-every-heart": {
    "Diversity & Unity": [
      "Inclusivity & Belonging",
      "Pride Celebration",
      "Mental Health Awareness"
    ],
    "Emotions": [
      "I'm Sorry Message",
      "Missing You Moment",
      "You're Special Message"
    ],
  },
  
  "sports": {
    "Team Spirit": [
      "Team Sports Energy",
      "Championship Moment",
      "Victory Celebration"
    ],
    "Active Lifestyle": [
      "Fitness & Training Journey",
      "Healthy Movement Habit"
    ],
  },
  
  "wellness-mindful-living": {
    "Wellness": [
      "Self-Care Routine",
      "Meditation Practice",
      "Mindfulness Moment"
    ],
    "Healthy Living": [
      "Healthy Lifestyle Choice",
      "Fitness Journey Path"
    ],
  },
  
  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home Celebration",
      "Moving to a New Place",
      "New Chapter Beginning"
    ],
    "Everyday Moments": [
      "Thank You Message",
      "Just Because Moment",
      "Congratulations Celebration"
    ],
    "Nature Moments": [
      "Outdoor Adventure Moment",
      "Beautiful Landscape Scene"
    ],
  },
};

// 🔑 MAPEO DE PALABRAS CLAVE → CATEGORÍAS
// Agregar aquí nuevas palabras para que se detecten automáticamente
export const KEYWORD_TO_CATEGORY = {
  // Holidays
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  newyear: "seasonal-global-celebrations",
  
  // St Patrick (todas las variaciones)
  stpatrick: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  stpatricksday: "seasonal-global-celebrations",
  saintpatrick: "seasonal-global-celebrations",
  saintpatricks: "seasonal-global-celebrations",
  
  cincodemayo: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  mothersday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  
  // Celebrations
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  
  // Love
  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  
  // Family & Friends
  family: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  
  // Work
  work: "work",
  job: "work",
  graduation: "work",
  career: "work",
  
  // Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  
  // Pets
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  
  // Support
  support: "support-healing-care",
  getwell: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  
  // Connection
  diversity: "hear-every-heart",
  pride: "hear-every-heart",
  sorry: "hear-every-heart",
  
  // Sports
  sports: "sports",
  gym: "sports",
  fitness: "sports",
  yoga: "sports",
  soccer: "sports",
  
  // Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
  
  // Life Journeys
  newhome: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  nature: "life-journeys-transitions",
};

// 🏷️ MAPEO DE PALABRAS CLAVE → SUBCATEGORÍAS
export const KEYWORD_TO_SUBCATEGORY = {
  // Holidays
  halloween: "Halloween",
  christmas: "Christmas",
  xmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  newyear: "New Year",
  
  // St Patrick (todas las variaciones → misma subcategoría)
  stpatrick: "St Patrick's Day",
  stpatricks: "St Patrick's Day",
  stpatricksday: "St Patrick's Day",
  saintpatrick: "St Patrick's Day",
  saintpatricks: "St Patrick's Day",
  
  cincodemayo: "Cinco de Mayo",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  july4: "Independence Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  
  // Celebrations
  birthday: "Birthday Celebration",
  party: "Party Celebration",
  
  // Love
  love: "Love & Affection",
  hugs: "Warm Hugs",
  romance: "Romantic Moments",
  wedding: "Wedding Celebration",
  anniversary: "Anniversary Celebration",
  
  // Pets
  pets: "Furry Companions",
  dogs: "Household Friends",
  cats: "Loyal Sidekicks",
  seaanimals: "Underwater Universe",
  farmanimals: "Barnyard Companions",
  flyinganimals: "Wings in Motion",
  wildanimals: "Amazing Life",
  
  // Life
  newhome: "New Home Celebration",
  moving: "Moving to a New Place",
  newbeginning: "New Chapter Beginning",
  thankyou: "Thank You Message",
  nature: "Beautiful Landscape Scene",
  
  // Work
  graduation: "Graduation Celebration",
  newjob: "New Job Celebration",
  
  // Support
  getwell: "Get Well Wishes",
  condolences: "Condolence Message",
  
  // Sports
  gym: "Healthy Movement Habit",
  yoga: "Yoga & Balance Flow",
  soccer: "Team Sports Energy",
};

// 🚫 PALABRAS QUE SON OBJETOS (no categorías)
export const OBJECT_KEYWORDS = new Set([
  'zombie', 'zombies', 'ghost', 'ghosts', 
  'pumpkin', 'pumpkins', 'turkey', 'turkeys',
  'santa', 'reindeer', 'snowman', 'snowmen',
  'bunny', 'bunnies', 'egg', 'eggs',
  'heart', 'hearts', 'rose', 'roses',
  'cake', 'cakes', 'balloon', 'balloons',
  'turtle', 'turtles', 'fish', 'shark',
  'cow', 'horse', 'pig', 'bird', 'eagle',
  'lion', 'tiger', 'bear',
  'leprechaun', 'shamrock', 'clover',
]);
