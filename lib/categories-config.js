/**
 * 📋 CONFIGURACIÓN COMPLETA DE CATEGORÍAS V4.0
 * ✅ Búsqueda flexible con palabras parciales
 * ✅ Múltiples categorías/subcategorías por video
 * ✅ TODAS las subcategorías (aunque estén vacías)
 * ✅ Variantes 1A, 2A, 3A = mismo contenido, diferente diseño
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

// 📂 GRUPOS DE SUBCATEGORÍAS POR CATEGORÍA (TODAS - COMPLETAS)
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Major Holidays": [
      "Halloween",
      "Thanksgiving", 
      "Christmas",
      "Hanukkah",
      "Easter",
      "New Year"
    ],
    "National & Patriotic Days": [
      "Independence Day",
      "Veterans Day",
      "Memorial Day",
      "Labor Day",
      "Flag Day",
      "Constitution Day",
      "Martin Luther King Jr Day"
    ],
    "Cultural & International Celebrations": [
      "St Patrick's Day",
      "Cinco de Mayo",
      "Diwali",
      "Ramadan",
      "Eid al-Fitr",
      "Eid al-Adha",
      "Passover",
      "Rosh Hashanah",
      "Yom Kippur",
      "Day of the Dead",
      "Kwanzaa",
      "Oktoberfest",
      "Lunar New Year",
      "Chinese New Year",
      "Mardi Gras",
      "Carnival"
    ],
    "Special Days": [
      "Valentine's Day",
      "Mother's Day",
      "Father's Day",
      "Grandparents Day",
      "Earth Day",
      "Teacher Appreciation Day",
      "Boss's Day",
      "Administrative Professionals Day"
    ],
    "Seasonal": [
      "Spring",
      "Summer",
      "Fall",
      "Autumn",
      "Winter"
    ]
  },
  
  "birthdays-celebrations": {
    "Birthday Milestones": [
      "Birthday Celebration",
      "First Birthday",
      "Sweet 16",
      "18th Birthday",
      "21st Birthday",
      "30th Birthday",
      "40th Birthday",
      "50th Birthday",
      "60th Birthday",
      "70th Birthday",
      "80th Birthday",
      "90th Birthday",
      "100th Birthday",
      "Quinceañera",
      "Bar Mitzvah",
      "Bat Mitzvah"
    ],
    "Special Celebrations": [
      "Party Celebration",
      "Surprise Party",
      "Baby Shower",
      "Bridal Shower Celebration",
      "Gender Reveal",
      "Housewarming Party",
      "Farewell Party",
      "Welcome Party",
      "Reunion Celebration"
    ]
  },
  
  "love-weddings-anniversaries": {
    "Romance & Love": [
      "Love & Affection",
      "Warm Hugs",
      "Romantic Moments",
      "I Love You Message",
      "Missing You",
      "Thinking of You",
      "Long Distance Love",
      "Date Night"
    ],
    "Wedding Celebrations": [
      "Wedding Celebration",
      "Engagement Moment",
      "Proposal Moment",
      "Bridal Shower",
      "Bachelor Party",
      "Bachelorette Party",
      "Rehearsal Dinner",
      "Wedding Anniversary"
    ],
    "Anniversaries": [
      "Anniversary Celebration",
      "1st Anniversary",
      "5th Anniversary",
      "10th Anniversary",
      "Silver Anniversary Celebration",
      "Golden Anniversary Celebration",
      "Dating Anniversary"
    ]
  },
  
  "family-friendship": {
    "Family Celebrations": [
      "Mother's Day Celebration",
      "Father's Day Celebration",
      "Family Time Together",
      "Grandparents Day Celebration",
      "Siblings Day",
      "Family Reunion",
      "Family Vacation",
      "Family Dinner"
    ],
    "Friendship": [
      "Friends Forever",
      "Best Friends Bond",
      "BFF Connection",
      "Friendship Day",
      "Thank You Friend",
      "Missing My Friend"
    ]
  },
  
  "work": {
    "Career Milestones": [
      "New Job Celebration",
      "Promotion Celebration",
      "Retirement Celebration",
      "Work Anniversary",
      "Employee Recognition",
      "Boss Appreciation",
      "Coworker Thank You",
      "Team Success"
    ],
    "Education & Learning": [
      "Graduation Celebration",
      "High School Graduation",
      "College Graduation",
      "Master's Graduation",
      "PhD Graduation",
      "First Day of School",
      "Last Day of School",
      "Back to School",
      "Scholarship Award"
    ]
  },
  
  "babies-parenting": {
    "Baby Milestones": [
      "Newborn Arrival",
      "New Baby Celebration",
      "Baby Shower Celebration",
      "Pregnancy Announcement",
      "Gender Reveal Moment",
      "Baby's First Christmas",
      "Baby's First Birthday",
      "Baby's First Steps",
      "Baby's First Word"
    ],
    "Parenting Moments": [
      "Mom Life Moment",
      "Dad Life Moment",
      "New Parents Celebration",
      "Adoption Celebration",
      "Foster Parent Appreciation",
      "Single Parent Support"
    ]
  },
  
  "pets-animal-lovers": {
    "Beloved Companions": [
      "Furry Companions",
      "Household Friends",
      "Loyal Sidekicks",
      "Pet Birthday",
      "Pet Adoption",
      "Pet Memorial",
      "New Pet Welcome"
    ],
    "Farm & Barn": [
      "Barnyard Companions",
      "Farm Animals",
      "Horses",
      "Cows",
      "Pigs",
      "Chickens"
    ],
    "Ocean & Aquatic": [
      "Underwater Universe",
      "Sea Animals",
      "Fish",
      "Dolphins",
      "Whales",
      "Turtles"
    ],
    "Birds & Sky": [
      "Wings in Motion",
      "Flying Animals",
      "Birds",
      "Eagles",
      "Parrots",
      "Owls"
    ],
    "Wildlife & Nature": [
      "Amazing Life",
      "Wild Animals",
      "Safari Animals",
      "Bears",
      "Lions",
      "Elephants"
    ]
  },
  
  "support-healing-care": {
    "Health & Wellness": [
      "Get Well Wishes",
      "Feel Better Soon",
      "Surgery Recovery",
      "Hospital Stay",
      "Cancer Support",
      "Chronic Illness Support"
    ],
    "Emotional Support": [
      "Thinking of You Message",
      "Stay Strong Motivation",
      "Encouragement",
      "You Got This",
      "Mental Health Support",
      "Anxiety Support",
      "Depression Support"
    ],
    "Sympathy & Loss": [
      "Condolence Message",
      "Loss & Healing",
      "In Loving Memory",
      "Sympathy & Support",
      "Pet Loss",
      "Grief Support"
    ]
  },
  
  "hear-every-heart": {
    "Diversity & Inclusion": [
      "Inclusivity & Belonging",
      "Pride Celebration",
      "LGBTQ+ Support",
      "Black History Month",
      "Hispanic Heritage Month",
      "Asian Pacific American Heritage Month",
      "Women's History Month"
    ],
    "Emotions & Feelings": [
      "I'm Sorry Message",
      "Missing You Moment",
      "You're Special Message",
      "Thank You",
      "Congratulations",
      "Proud of You"
    ],
    "Mental Health Awareness": [
      "Mental Health Awareness",
      "Self Care Reminder",
      "You Matter",
      "Break the Stigma"
    ]
  },
  
  "sports": {
    "Team Sports": [
      "Team Sports Energy",
      "Championship Moment",
      "Victory Celebration",
      "Soccer",
      "Basketball",
      "Baseball",
      "Football",
      "Hockey",
      "Volleyball"
    ],
    "Individual Sports": [
      "Tennis",
      "Golf",
      "Swimming",
      "Track and Field",
      "Gymnastics",
      "Martial Arts"
    ],
    "Fitness & Active Living": [
      "Fitness & Training Journey",
      "Healthy Movement Habit",
      "Gym Motivation",
      "Running Achievement",
      "Yoga Practice",
      "Marathon Completion"
    ]
  },
  
  "wellness-mindful-living": {
    "Wellness Practices": [
      "Self-Care Routine",
      "Meditation Practice",
      "Mindfulness Moment",
      "Spa Day",
      "Relaxation Time",
      "Digital Detox"
    ],
    "Healthy Living": [
      "Healthy Lifestyle Choice",
      "Fitness Journey Path",
      "Nutrition Goals",
      "Weight Loss Journey",
      "Sobriety Milestone",
      "Quit Smoking"
    ],
    "Personal Growth": [
      "New Year Resolutions",
      "Goal Achievement",
      "Personal Milestone",
      "Self Improvement"
    ]
  },
  
  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home Celebration",
      "Moving to a New Place",
      "New Chapter Beginning",
      "New City Adventure",
      "Fresh Start"
    ],
    "Life Changes": [
      "Divorce Support",
      "Empty Nest",
      "Midlife Milestone",
      "Career Change",
      "Becoming an Adult"
    ],
    "Gratitude & Kindness": [
      "Thank You Message",
      "Just Because Moment",
      "Random Act of Kindness",
      "Appreciation Note"
    ],
    "Achievements": [
      "Congratulations Celebration",
      "Personal Achievement",
      "Dream Come True",
      "Bucket List Item"
    ],
    "Nature & Travel": [
      "Outdoor Adventure Moment",
      "Beautiful Landscape Scene",
      "Travel Adventure",
      "Road Trip",
      "Beach Vacation",
      "Mountain Hiking"
    ]
  }
};

// 🔑 MAPEO DE PALABRAS CLAVE → CATEGORÍAS
export const KEYWORD_TO_CATEGORY = {
  // ========== HOLIDAYS ==========
  halloween: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  thanks: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  navidad: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  pascua: "seasonal-global-celebrations",
  newyear: "seasonal-global-celebrations",
  newyears: "seasonal-global-celebrations",
  
  // St Patrick's Day - TODAS las variaciones
  stpatrick: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  stpatricksday: "seasonal-global-celebrations",
  stpatrickday: "seasonal-global-celebrations",
  saintpatrick: "seasonal-global-celebrations",
  saintpatricks: "seasonal-global-celebrations",
  patrick: "seasonal-global-celebrations",
  patrickday: "seasonal-global-celebrations",
  patricks: "seasonal-global-celebrations",
  
  // Veterans Day - TODAS las variaciones
  veteransday: "seasonal-global-celebrations",
  veterans: "seasonal-global-celebrations",
  veteranday: "seasonal-global-celebrations",
  veteran: "seasonal-global-celebrations",
  
  // Independence Day - TODAS las variaciones
  independenceday: "seasonal-global-celebrations",
  independence: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  july4th: "seasonal-global-celebrations",
  fourthofjuly: "seasonal-global-celebrations",
  
  cincodemayo: "seasonal-global-celebrations",
  cinco: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  valentinesday: "seasonal-global-celebrations",
  mothersday: "seasonal-global-celebrations",
  motherday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  fatherday: "seasonal-global-celebrations",
  hanukkah: "seasonal-global-celebrations",
  diwali: "seasonal-global-celebrations",
  
  // Seasonal
  spring: "seasonal-global-celebrations",
  summer: "seasonal-global-celebrations",
  fall: "seasonal-global-celebrations",
  autumn: "seasonal-global-celebrations",
  winter: "seasonal-global-celebrations",
  
  // ========== CELEBRATIONS ==========
  birthday: "birthdays-celebrations",
  birthdays: "birthdays-celebrations",
  bday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  
  // ========== LOVE & ROMANCE ==========
  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  romantic: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  
  // ========== FAMILY & FRIENDSHIP ==========
  family: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  mother: "family-friendship",
  father: "family-friendship",
  
  // ========== WORK ==========
  work: "work",
  job: "work",
  graduation: "work",
  graduate: "work",
  career: "work",
  
  // ========== BABIES ==========
  baby: "babies-parenting",
  babies: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  shower: "babies-parenting",
  
  // ========== PETS & ANIMALS ==========
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  
  // ========== SUPPORT ==========
  support: "support-healing-care",
  getwell: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  
  // ========== CONNECTION ==========
  diversity: "hear-every-heart",
  pride: "hear-every-heart",
  sorry: "hear-every-heart",
  
  // ========== SPORTS ==========
  sports: "sports",
  sport: "sports",
  gym: "sports",
  fitness: "sports",
  
  // ========== WELLNESS ==========
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
  
  // ========== LIFE JOURNEYS ==========
  newhome: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  travel: "life-journeys-transitions",
  trip: "life-journeys-transitions",
};

// 🏷️ MAPEO DE PALABRAS CLAVE → SUBCATEGORÍAS
export const KEYWORD_TO_SUBCATEGORY = {
  // ========== HOLIDAYS ==========
  halloween: "Halloween",
  christmas: "Christmas",
  xmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  newyear: "New Year",
  newyears: "New Year",
  
  // St Patrick's Day - TODAS las variaciones → MISMA subcategoría
  stpatrick: "St Patrick's Day",
  stpatricks: "St Patrick's Day",
  stpatricksday: "St Patrick's Day",
  stpatrickday: "St Patrick's Day",
  saintpatrick: "St Patrick's Day",
  saintpatricks: "St Patrick's Day",
  patrick: "St Patrick's Day",
  patrickday: "St Patrick's Day",
  patricks: "St Patrick's Day",
  
  // Veterans Day - TODAS las variaciones → MISMA subcategoría
  veteransday: "Veterans Day",
  veterans: "Veterans Day",
  veteranday: "Veterans Day",
  veteran: "Veterans Day",
  
  // Independence Day - TODAS las variaciones → MISMA subcategoría
  independenceday: "Independence Day",
  independence: "Independence Day",
  july4: "Independence Day",
  july4th: "Independence Day",
  fourthofjuly: "Independence Day",
  
  cincodemayo: "Cinco de Mayo",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  valentinesday: "Valentine's Day",
  mothersday: "Mother's Day",
  motherday: "Mother's Day",
  fathersday: "Father's Day",
  fatherday: "Father's Day",
  
  // Seasonal
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  autumn: "Autumn",
  winter: "Winter",
  
  // ========== CELEBRATIONS ==========
  birthday: "Birthday Celebration",
  birthdays: "Birthday Celebration",
  
  // ========== LOVE ==========
  love: "Love & Affection",
  hugs: "Warm Hugs",
  romance: "Romantic Moments",
  romantic: "Romantic Moments",
  wedding: "Wedding Celebration",
  anniversary: "Anniversary Celebration",
  
  // ========== PETS ==========
  pets: "Furry Companions",
  pet: "Furry Companions",
  dogs: "Household Friends",
  dog: "Household Friends",
  cats: "Loyal Sidekicks",
  cat: "Loyal Sidekicks",
  seaanimals: "Underwater Universe",
  farmanimals: "Barnyard Companions",
  flyinganimals: "Wings in Motion",
  wildanimals: "Amazing Life",
  
  // ========== LIFE JOURNEYS ==========
  newhome: "New Home Celebration",
  moving: "Moving to a New Place",
  newbeginning: "New Chapter Beginning",
  thankyou: "Thank You Message",
  nature: "Beautiful Landscape Scene",
  travel: "Travel Adventure",
  trip: "Travel Adventure",
  
  // ========== WORK ==========
  graduation: "Graduation Celebration",
  graduate: "Graduation Celebration",
  newjob: "New Job Celebration",
  
  // ========== SUPPORT ==========
  getwell: "Get Well Wishes",
  condolences: "Condolence Message",
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
  'soldier', 'flag', 'yeti', 'octopus',
  'mother', 'couple',
]);
