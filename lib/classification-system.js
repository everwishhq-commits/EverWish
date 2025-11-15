/**
 * 🎯 SISTEMA DE CLASIFICACIÓN EXPANDIDO V16.0
 * Categorías organizadas con nombres descriptivos completos
 */

export const BASE_CATEGORIES = [
  { name: "Holidays & Celebrations", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Birthdays & Parties", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Education", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Diversity & Unity", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports & Fitness", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindfulness", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": [
      "New Year", "New Year's Eve", "Lunar New Year", "Chinese New Year",
      "Halloween", "Thanksgiving", "Christmas", "Easter",
      "St Patrick's Day", "Mardi Gras", "Cinco de Mayo"
    ],
    "Cultural & Heritage Days": [
      "Valentine's Day", "Independence Day", "Mother's Day", "Father's Day",
      "Hanukkah", "Diwali", "Ramadan", "Eid", "Passover",
      "Day of the Dead", "Kwanzaa", "Oktoberfest"
    ],
    "Seasonal": [
      "Spring Season", "Summer Season",
      "Autumn Season", "Winter Season"
    ]
  },

  "birthdays-celebrations": {
    "Birthday Milestones": [
      "Birthday Celebration", "First Birthday", "Quinceañera",
      "Sweet 16", "18th Birthday", "21st Birthday",
      "30th Birthday", "40th Birthday", "50th Birthday"
    ],
    "Events": [
      "Party Celebration", "Surprise Party",
      "Baby Shower Celebration", "Bridal Shower Celebration",
      "Gender Reveal Celebration"
    ]
  },

  "love-weddings-anniversaries": {
    "Romance": [
      "Love & Affection", "Warm Hugs",
      "Romantic Moments", "I Love You Message",
      "First Date Memory"
    ],
    "Wedding": [
      "Wedding Celebration", "Engagement Moment",
      "Proposal Moment", "Bachelor Party Celebration",
      "Bachelorette Party Celebration"
    ],
    "Anniversaries": [
      "Anniversary Celebration",
      "Paper Anniversary Celebration",
      "Silver Anniversary Celebration",
      "Golden Anniversary Celebration"
    ]
  },

  "family-friendship": {
    "Family": [
      "Mother's Day Celebration", "Father's Day Celebration",
      "Parents Appreciation", "Family Time Together",
      "Family Love Moment", "Grandparents Day Celebration",
      "Siblings Day Celebration"
    ],
    "Friendship": [
      "Friends Forever", "Best Friends Bond",
      "Friendship Day Celebration",
      "Forever Friends Moment", "BFF Connection"
    ]
  },

  "work": {
    "Career": [
      "New Job Celebration", "Promotion Celebration",
      "Retirement Celebration", "Work Anniversary Celebration",
      "Career Success Moment", "Appreciation Day Tribute"
    ],
    "Education": [
      "Graduation Celebration", "School Achievement",
      "High School Graduation",
      "College Graduation",
      "Back to School Moment"
    ]
  },

  "babies-parenting": {
    "Baby": [
      "Newborn Arrival", "New Baby Celebration",
      "Baby Shower Celebration", "Pregnancy Announcement",
      "Gender Reveal Moment", "It's a Boy Announcement",
      "It's a Girl Announcement", "Twins Announcement"
    ],
    "Parenting": [
      "Mom Life Moment", "Dad Life Moment",
      "Adoption Journey", "Foster Care Love",
      "New Parents Celebration"
    ]
  },

  "pets-animal-lovers": {
    "Beloved Companions": [
      "Furry Companions",
      "Household Friends",
      "Loyal Sidekicks",
      "Pet Celebration Moments",
      "Adopted with Love"
    ],
    "Farm Life": [
      "Barnyard Companions"
    ],
    "Ocean Worlds": [
      "Underwater Universe"
    ],
    "Sky Creatures": [
      "Wings in Motion"
    ],
    "Wildlife Adventures": [
      "Amazing Life"
    ]
  },

  "support-healing-care": {
    "Support": [
      "Get Well Wishes", "Thinking of You Message",
      "Stay Strong Motivation", "Cheer Up Message",
      "You've Got This Inspiration"
    ],
    "Sympathy": [
      "Condolence Message", "Loss & Healing",
      "In Loving Memory", "With Deepest Sympathy"
    ]
  },

  "hear-every-heart": {
    "Diversity & Unity": [
      "Inclusivity & Belonging", 
      "Unity & Harmony",
      "Peace & Balance",
      "Pride Celebration",
      "Equality for All",
      "Acceptance & Respect",
      "Immigration Journey",
      "Disability Awareness Tribute",
      "Mobility Awareness Day",
      "Autism Awareness Day",
      "Mental Health Awareness",
      "Cancer Awareness",
      "Afro Heritage Pride",
      "Hispanic Heritage Pride"
    ],
    "Emotions": [
      "I'm Sorry Message", "Forgive Me Note",
      "Missing You Moment", "You're Special Message",
      "You Matter Reminder"
    ]
  },

  "sports": {
    "Team Spirit": [
      "Team Sports Energy", "Championship Moment",
      "Victory Celebration"
    ],
    "Active Lifestyle": [
      "Fitness & Training Journey", "Healthy Movement Habit",
      "Endurance Sports Challenge"
    ],
    "Mind & Body Motion": [
      "Yoga & Balance Flow", "Dance & Rhythm Energy",
      "Martial Arts Flow"
    ]
  },

  "wellness-mindful-living": {
    "Wellness": [
      "Self-Care Routine", "Meditation Practice",
      "Mindfulness Moment", "Inner Peace Journey",
      "Mental Health Balance", "Spa Day Relaxation"
    ],
    "Healthy Living": [
      "Healthy Lifestyle Choice", "Fitness Journey Path",
      "Weight Loss Success Story", "Quit Smoking Journey"
    ]
  },

  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home Celebration", "Moving to a New Place",
      "Housewarming Moment", "Fresh Start Journey",
      "New Chapter Beginning"
    ],
    "Everyday Moments": [
      "Thank You Message", "Just Because Moment",
      "Congratulations Celebration", "Good Luck Wish",
      "Safe Travels Message", "Warm Welcome Greeting"
    ],
    "Nature Moments": [
      "Outdoor Adventure Moment", "Beautiful Landscape Scene",
      "Nature Escape Journey"
    ]
  }
};

// 🎯 MAPEO DIRECTO ACTUALIZADO (palabra → categoría)
const DIRECT_CATEGORY_MAP = {
  // Holidays & Celebrations
  newyear: "seasonal-global-celebrations",
  newyearseve: "seasonal-global-celebrations",
  lunarnewyear: "seasonal-global-celebrations",
  chinesenewyear: "seasonal-global-celebrations",
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  mardigras: "seasonal-global-celebrations",
  cincodemayo: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  mothersday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  hanukkah: "seasonal-global-celebrations",
  diwali: "seasonal-global-celebrations",
  ramadan: "seasonal-global-celebrations",
  eid: "seasonal-global-celebrations",
  passover: "seasonal-global-celebrations",
  dayofthedead: "seasonal-global-celebrations",
  kwanzaa: "seasonal-global-celebrations",
  oktoberfest: "seasonal-global-celebrations",
  spring: "seasonal-global-celebrations",
  summer: "seasonal-global-celebrations",
  autumn: "seasonal-global-celebrations",
  fall: "seasonal-global-celebrations",
  winter: "seasonal-global-celebrations",
  
  // Birthdays & Celebrations
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  surprise: "birthdays-celebrations",
  babyshower: "birthdays-celebrations",
  bridalshower: "birthdays-celebrations",
  genderreveal: "birthdays-celebrations",
  quinceanera: "birthdays-celebrations",
  sweet16: "birthdays-celebrations",
  
  // Love & Romance
  love: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  romantic: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  proposal: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  bachelor: "love-weddings-anniversaries",
  bachelorette: "love-weddings-anniversaries",
  
  // Family & Friendship
  family: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  parents: "family-friendship",
  grandparents: "family-friendship",
  siblings: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  bestfriends: "family-friendship",
  bff: "family-friendship",
  
  // Work & Education
  work: "work",
  job: "work",
  newjob: "work",
  promotion: "work",
  retirement: "work",
  graduation: "work",
  graduate: "work",
  school: "work",
  highschool: "work",
  college: "work",
  university: "work",
  backtoschool: "work",
  
  // Babies & Parenting
  baby: "babies-parenting",
  newborn: "babies-parenting",
  newbaby: "babies-parenting",
  pregnancy: "babies-parenting",
  pregnant: "babies-parenting",
  itsaboy: "babies-parenting",
  itsagirl: "babies-parenting",
  twins: "babies-parenting",
  adoption: "babies-parenting",
  fostercare: "babies-parenting",
  momlife: "babies-parenting",
  dadlife: "babies-parenting",
  
  // Pets & Animals
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  furry: "pets-animal-lovers",
  companions: "pets-animal-lovers",
  farm: "pets-animal-lovers",
  barnyard: "pets-animal-lovers",
  ocean: "pets-animal-lovers",
  sea: "pets-animal-lovers",
  marine: "pets-animal-lovers",
  underwater: "pets-animal-lovers",
  birds: "pets-animal-lovers",
  wings: "pets-animal-lovers",
  flying: "pets-animal-lovers",
  wildlife: "pets-animal-lovers",
  wild: "pets-animal-lovers",
  safari: "pets-animal-lovers",
  
  // Support & Care
  getwell: "support-healing-care",
  getwellsoon: "support-healing-care",
  thinkingofyou: "support-healing-care",
  staystrong: "support-healing-care",
  cheerup: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  loss: "support-healing-care",
  memory: "support-healing-care",
  
  // Diversity & Unity
  diversity: "hear-every-heart",
  inclusivity: "hear-every-heart",
  unity: "hear-every-heart",
  peace: "hear-every-heart",
  pride: "hear-every-heart",
  equality: "hear-every-heart",
  acceptance: "hear-every-heart",
  immigration: "hear-every-heart",
  disability: "hear-every-heart",
  autism: "hear-every-heart",
  mentalhealth: "hear-every-heart",
  cancer: "hear-every-heart",
  afro: "hear-every-heart",
  hispanic: "hear-every-heart",
  sorry: "hear-every-heart",
  forgive: "hear-every-heart",
  missyou: "hear-every-heart",
  special: "hear-every-heart",
  
  // Sports & Fitness
  sports: "sports",
  team: "sports",
  championship: "sports",
  victory: "sports",
  fitness: "sports",
  training: "sports",
  gym: "sports",
  yoga: "sports",
  dance: "sports",
  martialarts: "sports",
  
  // Wellness
  wellness: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  mindfulness: "wellness-mindful-living",
  innerpeace: "wellness-mindful-living",
  spa: "wellness-mindful-living",
  healthy: "wellness-mindful-living",
  weightloss: "wellness-mindful-living",
  quitsmoking: "wellness-mindful-living",
  
  // Life Journeys
  newhome: "life-journeys-transitions",
  moving: "life-journeys-transitions",
  housewarming: "life-journeys-transitions",
  freshstart: "life-journeys-transitions",
  newchapter: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",
  congratulations: "life-journeys-transitions",
  congrats: "life-journeys-transitions",
  goodluck: "life-journeys-transitions",
  safetravels: "life-journeys-transitions",
  welcome: "life-journeys-transitions",
  outdoor: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  landscape: "life-journeys-transitions",
};

// 🎯 MAPEO DE SUBCATEGORÍAS ACTUALIZADO
const DIRECT_SUBCATEGORY_MAP = {
  // Holiday Seasons
  newyear: "New Year",
  newyearseve: "New Year's Eve",
  lunarnewyear: "Lunar New Year",
  chinesenewyear: "Chinese New Year",
  halloween: "Halloween",
  thanksgiving: "Thanksgiving",
  christmas: "Christmas",
  easter: "Easter",
  stpatricks: "St Patrick's Day",
  mardigras: "Mardi Gras",
  cincodemayo: "Cinco de Mayo",
  
  // Cultural & Heritage
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  july4: "Independence Day",
  independenceday: "Independence Day",
  mothersday: "Mother's Day Celebration",
  fathersday: "Father's Day Celebration",
  hanukkah: "Hanukkah",
  diwali: "Diwali",
  ramadan: "Ramadan",
  eid: "Eid",
  passover: "Passover",
  dayofthedead: "Day of the Dead",
  kwanzaa: "Kwanzaa",
  oktoberfest: "Oktoberfest",
  
  // Seasonal
  spring: "Spring Season",
  summer: "Summer Season",
  autumn: "Autumn Season",
  fall: "Autumn Season",
  winter: "Winter Season",
  
  // Birthdays
  birthday: "Birthday Celebration",
  party: "Party Celebration",
  surprise: "Surprise Party",
  babyshower: "Baby Shower Celebration",
  bridalshower: "Bridal Shower Celebration",
  genderreveal: "Gender Reveal Celebration",
  
  // Love & Romance
  love: "Love & Affection",
  hugs: "Warm Hugs",
  romance: "Romantic Moments",
  romantic: "Romantic Moments",
  wedding: "Wedding Celebration",
  engagement: "Engagement Moment",
  proposal: "Proposal Moment",
  anniversary: "Anniversary Celebration",
  
  // Family & Friendship
  family: "Family Time Together",
  parents: "Parents Appreciation",
  grandparents: "Grandparents Day Celebration",
  siblings: "Siblings Day Celebration",
  friends: "Friends Forever",
  bestfriends: "Best Friends Bond",
  friendship: "Friendship Day Celebration",
  bff: "BFF Connection",
  
  // Work & Education
  newjob: "New Job Celebration",
  promotion: "Promotion Celebration",
  retirement: "Retirement Celebration",
  graduation: "Graduation Celebration",
  school: "School Achievement",
  backtoschool: "Back to School Moment",
  
  // Babies & Parenting
  baby: "Newborn Arrival",
  newborn: "Newborn Arrival",
  newbaby: "New Baby Celebration",
  babyshower: "Baby Shower Celebration",
  pregnancy: "Pregnancy Announcement",
  genderreveal: "Gender Reveal Moment",
  itsaboy: "It's a Boy Announcement",
  itsagirl: "It's a Girl Announcement",
  twins: "Twins Announcement",
  momlife: "Mom Life Moment",
  dadlife: "Dad Life Moment",
  adoption: "Adoption Journey",
  fostercare: "Foster Care Love",
  
  // Pets & Animals
  pets: "Furry Companions",
  furry: "Furry Companions",
  companions: "Household Friends",
  farm: "Barnyard Companions",
  barnyard: "Barnyard Companions",
  ocean: "Underwater Universe",
  sea: "Underwater Universe",
  underwater: "Underwater Universe",
  birds: "Wings in Motion",
  wings: "Wings in Motion",
  wildlife: "Amazing Life",
  wild: "Amazing Life",
  
  // Support & Care
  getwell: "Get Well Wishes",
  thinkingofyou: "Thinking of You Message",
  staystrong: "Stay Strong Motivation",
  cheerup: "Cheer Up Message",
  sympathy: "Condolence Message",
  condolences: "Condolence Message",
  loss: "Loss & Healing",
  memory: "In Loving Memory",
  
  // Diversity & Unity
  inclusivity: "Inclusivity & Belonging",
  unity: "Unity & Harmony",
  peace: "Peace & Balance",
  pride: "Pride Celebration",
  equality: "Equality for All",
  acceptance: "Acceptance & Respect",
  sorry: "I'm Sorry Message",
  forgive: "Forgive Me Note",
  missyou: "Missing You Moment",
  special: "You're Special Message",
  
  // Sports & Fitness
  sports: "Team Sports Energy",
  team: "Team Sports Energy",
  championship: "Championship Moment",
  victory: "Victory Celebration",
  fitness: "Fitness & Training Journey",
  training: "Fitness & Training Journey",
  gym: "Fitness & Training Journey",
  yoga: "Yoga & Balance Flow",
  dance: "Dance & Rhythm Energy",
  
  // Wellness
  wellness: "Self-Care Routine",
  selfcare: "Self-Care Routine",
  meditation: "Meditation Practice",
  mindfulness: "Mindfulness Moment",
  innerpeace: "Inner Peace Journey",
  spa: "Spa Day Relaxation",
  healthy: "Healthy Lifestyle Choice",
  
  // Life Journeys
  newhome: "New Home Celebration",
  moving: "Moving to a New Place",
  housewarming: "Housewarming Moment",
  freshstart: "Fresh Start Journey",
  newchapter: "New Chapter Beginning",
  thankyou: "Thank You Message",
  justbecause: "Just Because Moment",
  congratulations: "Congratulations Celebration",
  congrats: "Congratulations Celebration",
  goodluck: "Good Luck Wish",
  safetravels: "Safe Travels Message",
  welcome: "Warm Welcome Greeting",
  outdoor: "Outdoor Adventure Moment",
  nature: "Nature Escape Journey",
  landscape: "Beautiful Landscape Scene",
};

// 🔍 FUNCIÓN DE BÚSQUEDA
export function searchVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  
  const q = query.toLowerCase().trim();
  const variations = [q];
  
  if (q.endsWith('s')) {
    variations.push(q.slice(0, -1));
  } else {
    variations.push(q + 's');
  }
  
  return videos.filter(video => {
    const searchable = [
      video.name,
      video.object,
      video.subcategory,
      ...(video.categories || []),
      ...(video.subcategories || []),
      ...(video.tags || []),
    ].filter(Boolean).join(" ").toLowerCase();
    
    return variations.some(v => searchable.includes(v));
  });
}

// 🗂️ AGRUPAR POR CATEGORÍA BASE
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  
  videos.forEach(video => {
    if (!video.categories || !Array.isArray(video.categories)) return;
    
    video.categories.forEach(cat => {
      if (!grouped[cat]) grouped[cat] = [];
      if (!grouped[cat].find(v => v.name === video.name)) {
        grouped[cat].push(video);
      }
    });
  });
  
  return grouped;
    }
