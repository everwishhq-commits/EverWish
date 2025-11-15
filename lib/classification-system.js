/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V18.0 - NOMBRES DESCRIPTIVOS COMPLETOS
 * Actualizado con subcategorías con nombres completos y significativos
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
      "Halloween Celebration", 
      "Thanksgiving Celebration", 
      "Christmas Celebration", 
      "Easter Celebration",
      "New Year Celebration",
      "Valentine's Day Celebration"
    ],
    "Cultural Days": [
      "Independence Day Celebration", 
      "Mother's Day Celebration", 
      "Father's Day Celebration",
      "St Patrick's Day Celebration"
    ],
    "Seasonal": [
      "Spring Season", 
      "Summer Season", 
      "Fall Season", 
      "Winter Season"
    ],
  },
  "birthdays-celebrations": {
    "Birthday Milestones": [
      "Birthday Celebration", 
      "Sweet 16 Celebration", 
      "21st Birthday Celebration"
    ],
    "Party Events": [
      "Party Celebration", 
      "Surprise Party Celebration"
    ],
  },
  "love-weddings-anniversaries": {
    "Romance": [
      "Love & Affection", 
      "Warm Hugs", 
      "Romantic Moments"
    ],
    "Wedding": [
      "Wedding Celebration", 
      "Anniversary Celebration"
    ],
  },
  "family-friendship": {
    "Family": [
      "Mother's Day Celebration", 
      "Father's Day Celebration", 
      "Parents Appreciation"
    ],
    "Friendship": [
      "Friends Forever", 
      "Best Friends Bond"
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
      "School Achievement"
    ],
  },
  "babies-parenting": {
    "Baby": [
      "Newborn Arrival", 
      "Baby Shower Celebration", 
      "Pregnancy Announcement"
    ],
    "Parenting": [
      "Mom Life Moment", 
      "Dad Life Moment"
    ],
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
    ],
  },
  "support-healing-care": {
    "Support": [
      "Get Well Wishes", 
      "Thinking of You Message"
    ],
    "Sympathy": [
      "Condolence Message", 
      "Loss & Healing"
    ],
  },
  "hear-every-heart": {
    "Diversity": [
      "Inclusivity & Belonging", 
      "Unity & Harmony", 
      "Peace & Balance"
    ],
  },
  "sports": {
    "Team Sports": [
      "Team Sports Energy", 
      "Championship Moment"
    ],
    "Fitness": [
      "Gym & Training", 
      "Yoga & Balance"
    ],
  },
  "wellness-mindful-living": {
    "Wellness": [
      "Self-Care Routine", 
      "Meditation Practice"
    ],
  },
  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home Celebration", 
      "Moving to a New Place",
      "Housewarming Moment",
      "Fresh Start Journey",
      "New Chapter Beginning"
    ],
    "Everyday": [
      "Thank You Message", 
      "Just Because Moment"
    ],
    "Nature": [
      "Outdoor Adventure Moment",
      "Nature Escape Journey",
      "Beautiful Landscape Scene"
    ],
  },
};

// 🎯 MAPA DIRECTO: palabra → categoría
const DIRECT_CATEGORY_MAP = {
  // Holidays (PRIORIDAD MÁXIMA)
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  newyear: "seasonal-global-celebrations",
  mothersday: "seasonal-global-celebrations",
  fathersday: "seasonal-global-celebrations",
  stpatricks: "seasonal-global-celebrations",
  
  // Animals (ANTES que otros)
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  furry: "pets-animal-lovers",
  companions: "pets-animal-lovers",
  
  // Life Journeys (ANTES que general)
  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  newbeginnings: "life-journeys-transitions",
  housewarming: "life-journeys-transitions",
  freshstart: "life-journeys-transitions",
  newchapter: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  outdoor: "life-journeys-transitions",
  landscape: "life-journeys-transitions",
  
  // Celebrations
  birthday: "birthdays-celebrations",
  party: "birthdays-celebrations",
  surprise: "birthdays-celebrations",
  
  // Love & Romance
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  
  // Family & Friendship
  family: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  parents: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  
  // Work
  work: "work",
  graduation: "work",
  career: "work",
  job: "work",
  newjob: "work",
  promotion: "work",
  retirement: "work",
  school: "work",
  
  // Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  babyshower: "babies-parenting",
  momlife: "babies-parenting",
  dadlife: "babies-parenting",
  
  // Support
  support: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  getwell: "support-healing-care",
  thinkingofyou: "support-healing-care",
  
  // Diversity
  diversity: "hear-every-heart",
  inclusivity: "hear-every-heart",
  unity: "hear-every-heart",
  peace: "hear-every-heart",
  
  // Sports
  sports: "sports",
  gym: "sports",
  fitness: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  yoga: "sports",
  
  // Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
};

// 🎯 SUBCATEGORÍAS CON NOMBRES DESCRIPTIVOS
const DIRECT_SUBCATEGORY_MAP = {
  // Holidays
  halloween: "Halloween Celebration",
  christmas: "Christmas Celebration",
  xmas: "Christmas Celebration",
  thanksgiving: "Thanksgiving Celebration",
  easter: "Easter Celebration",
  valentine: "Valentine's Day Celebration",
  valentines: "Valentine's Day Celebration",
  july4: "Independence Day Celebration",
  newyear: "New Year Celebration",
  mothersday: "Mother's Day Celebration",
  fathersday: "Father's Day Celebration",
  stpatricks: "St Patrick's Day Celebration",
  spring: "Spring Season",
  summer: "Summer Season",
  fall: "Fall Season",
  autumn: "Fall Season",
  winter: "Winter Season",
  
  // Celebrations
  birthday: "Birthday Celebration",
  anniversary: "Anniversary Celebration",
  party: "Party Celebration",
  surprise: "Surprise Party Celebration",
  sweet16: "Sweet 16 Celebration",
  
  // Animals - NOMBRES DESCRIPTIVOS COMPLETOS
  pets: "Furry Companions",
  pet: "Furry Companions",
  dog: "Furry Companions",
  dogs: "Furry Companions",
  cat: "Furry Companions",
  cats: "Furry Companions",
  furry: "Furry Companions",
  companions: "Household Friends",
  loyal: "Loyal Sidekicks",
  petcelebration: "Pet Celebration Moments",
  adopted: "Adopted with Love",
  farmanimals: "Barnyard Companions",
  farm: "Barnyard Companions",
  seaanimals: "Underwater Universe",
  sea: "Underwater Universe",
  ocean: "Underwater Universe",
  marine: "Underwater Universe",
  flyinganimals: "Wings in Motion",
  flying: "Wings in Motion",
  birds: "Wings in Motion",
  wildanimals: "Amazing Life",
  wild: "Amazing Life",
  wildlife: "Amazing Life",
  
  // Love
  love: "Love & Affection",
  hugs: "Warm Hugs",
  romance: "Romantic Moments",
  romantic: "Romantic Moments",
  wedding: "Wedding Celebration",
  
  // Sports
  gym: "Gym & Training",
  fitness: "Gym & Training",
  yoga: "Yoga & Balance",
  soccer: "Team Sports Energy",
  basketball: "Team Sports Energy",
  football: "Team Sports Energy",
  championship: "Championship Moment",
  
  // Life Journeys - NOMBRES DESCRIPTIVOS COMPLETOS
  moving: "Moving to a New Place",
  newhome: "New Home Celebration",
  newbeginning: "New Chapter Beginning",
  newbeginnings: "New Chapter Beginning",
  housewarming: "Housewarming Moment",
  freshstart: "Fresh Start Journey",
  newchapter: "New Chapter Beginning",
  thankyou: "Thank You Message",
  justbecause: "Just Because Moment",
  outdoor: "Outdoor Adventure Moment",
  nature: "Nature Escape Journey",
  landscape: "Beautiful Landscape Scene",
  
  // Work
  graduation: "Graduation Celebration",
  newjob: "New Job Celebration",
  promotion: "Promotion Celebration",
  retirement: "Retirement Celebration",
  school: "School Achievement",
  
  // Support
  getwell: "Get Well Wishes",
  thinkingofyou: "Thinking of You Message",
  condolences: "Condolence Message",
  sympathy: "Condolence Message",
  
  // Baby
  newborn: "Newborn Arrival",
  baby: "Newborn Arrival",
  babyshower: "Baby Shower Celebration",
  pregnancy: "Pregnancy Announcement",
  momlife: "Mom Life Moment",
  dadlife: "Dad Life Moment",
  
  // Family
  mother: "Mother's Day Celebration",
  mothers: "Mother's Day Celebration",
  father: "Father's Day Celebration",
  fathers: "Father's Day Celebration",
  parents: "Parents Appreciation",
  friends: "Friends Forever",
  bestfriends: "Best Friends Bond",
  
  // Wellness
  wellness: "Self-Care Routine",
  selfcare: "Self-Care Routine",
  meditation: "Meditation Practice",
  
  // Diversity
  inclusivity: "Inclusivity & Belonging",
  unity: "Unity & Harmony",
  peace: "Peace & Balance",
};

// ⚠️ PALABRAS QUE NO SON CATEGORÍAS (objetos específicos)
const OBJECT_KEYWORDS = new Set([
  'zombie', 'zombies', 'ghost', 'ghosts', 'pumpkin', 'pumpkins',
  'turkey', 'turkeys', 'santa', 'reindeer', 'snowman', 'snowmen',
  'bunny', 'bunnies', 'egg', 'eggs', 'chick', 'chicks',
  'heart', 'hearts', 'rose', 'roses', 'ring', 'rings',
  'cake', 'cakes', 'balloon', 'balloons', 'gift', 'gifts',
  'turtle', 'turtles', 'fish', 'shark', 'sharks',
  'cow', 'cows', 'horse', 'horses', 'pig', 'pigs',
  'bird', 'birds', 'eagle', 'eagles', 'parrot', 'parrots',
  'lion', 'lions', 'tiger', 'tigers', 'bear', 'bears',
]);

function normalize(t) {
  return t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\da-z]/g, "").trim();
}

function isObjectKeyword(word) {
  const n = normalize(word);
  return OBJECT_KEYWORDS.has(n);
}

function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

let LEARNED_GLOSSARY = {};

// 📊 CLASIFICAR
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  const lastPart = parts.at(-1) || "";
  const isVariant = /^\d+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";
  
  let object = parts[0];
  for (const part of parts) {
    const n = normalize(part);
    if (isObjectKeyword(part)) {
      object = part;
      continue;
    }
    if (!DIRECT_CATEGORY_MAP[n] && !DIRECT_SUBCATEGORY_MAP[n] && part !== lastPart) {
      object = part;
      break;
    }
  }
  
  const categoriesFound = new Map();
  const allParts = isVariant ? parts.slice(0, -1) : parts;
  
  for (const part of allParts) {
    const n = normalize(part);
    
    if (isObjectKeyword(part)) continue;
    
    if (DIRECT_CATEGORY_MAP[n]) {
      const catSlug = DIRECT_CATEGORY_MAP[n];
      if (!categoriesFound.has(catSlug)) {
        categoriesFound.set(catSlug, []);
      }
    }
    
    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];
      
      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const subs of Object.values(groups)) {
          if (subs.includes(sub)) {
            if (!categoriesFound.has(catSlug)) {
              categoriesFound.set(catSlug, []);
            }
            if (!categoriesFound.get(catSlug).includes(sub)) {
              categoriesFound.get(catSlug).push(sub);
            }
            break;
          }
        }
      }
    }
  }
  
  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find(c => c.slug === slug);
    
    if (subs.length === 0) {
      const firstSub = getFirstSubcategory(slug);
      if (firstSub) subs.push(firstSub);
    }
    
    results.push({
      categorySlug: slug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subs,
      variant,
      object,
    });
  }
  
  if (results.length === 0) {
    const fallback = "life-journeys-transitions";
    results.push({
      categorySlug: fallback,
      categoryName: "Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    });
  }
  
  return results;
}

// 🔍 BÚSQUEDA
export function searchVideos(videos, term) {
  if (!term?.trim()) return videos;
  const n = normalize(term);
  
  const variations = [n];
  if (n.endsWith('s')) variations.push(n.slice(0, -1));
  else variations.push(n + 's');
  if (n.endsWith('ies')) variations.push(n.slice(0, -3) + 'y');
  
  return videos.filter(v => {
    const allText = [v.name, v.object, v.subcategory, v.category, ...(v.tags || []), ...(v.categories || [])]
      .filter(Boolean).join(" ");
    const normalizedText = normalize(allText);
    return variations.some(variant => normalizedText.includes(variant));
  });
}

// 📂 AGRUPAR
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  for (const c of BASE_CATEGORIES) grouped[c.slug] = [];
  
  for (const v of videos) {
    const classifications = classifyVideo(v.name);
    for (const c of classifications) {
      if (!grouped[c.categorySlug].some(x => x.name === v.name)) {
        grouped[c.categorySlug].push({
          ...v,
          contextSubcategories: c.subcategories,
          contextCategory: c.categoryName,
        });
      }
    }
  }
  
  return grouped;
}

// 🎯 FILTRAR POR CATEGORÍA
export function filterByCategory(videos, categorySlug) {
  return videos.filter((video) => {
    if (video.categories?.includes(categorySlug)) return true;
    
    const classifications = classifyVideo(video.name);
    const matches = classifications.some((c) => c.categorySlug === categorySlug);
    
    if (matches && categorySlug === "life-journeys-transitions") {
      const hasAnimalClass = classifications.some(c => c.categorySlug === "pets-animal-lovers");
      if (hasAnimalClass && !video.name.toLowerCase().match(/moving|newhome|newbeginning/)) {
        return false;
      }
    }
    
    return matches;
  });
}

// 📊 OBTENER GRUPOS CON SUBCATEGORÍAS
export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};
  
  for (const [group, subs] of Object.entries(groups)) {
    const subsWithVideos = subs
      .map(s => ({
        name: s,
        count: videos.filter(v => {
          const classifications = classifyVideo(v.name);
          const allSubs = [];
          for (const c of classifications) {
            if (c.subcategories) allSubs.push(...c.subcategories);
          }
          
          const videoSubs = [v.subcategory, ...(v.contextSubcategories || []), ...(v.subcategories || []), ...allSubs].filter(Boolean);
          return videoSubs.includes(s);
        }).length,
      }))
      .filter(s => s.count > 0);
    
    if (subsWithVideos.length > 0) result[group] = subsWithVideos;
  }
  
  return result;
}

// 🎯 FILTRAR POR SUBCATEGORÍA
export function filterBySubcategory(videos, sub) {
  return videos.filter(v => {
    const classifications = classifyVideo(v.name);
    const allSubs = [];
    for (const c of classifications) {
      if (c.subcategories) allSubs.push(...c.subcategories);
    }
    
    const all = [v.subcategory, ...(v.contextSubcategories || []), ...(v.subcategories || []), ...allSubs].filter(Boolean);
    return all.includes(sub);
  });
    }
