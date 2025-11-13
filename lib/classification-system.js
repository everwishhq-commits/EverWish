/**
 * 🧠 SISTEMA DE CLASIFICACIÓN V13 – FINAL
 * - Clasificación 100% basada en el nombre del archivo
 * - NO confunde "animallovers" con "love"
 * - Soporta 1 o 2 categorías por archivo
 * - Subcategorías sólo se asignan si están en SUBCATEGORY_GROUPS
 * - Fallback estable
 */

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
 * 🔥 NUEVAS SUBCATEGORÍAS MEJORADAS
 * – Version refinada y ampliada
 */
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": [
      "Halloween",
      "Thanksgiving",
      "Christmas",
      "Easter",
      "New Year's Eve",
      "New Year's Day",
      "Hanukkah",
      "Diwali",
      "St. Patrick's Day"
    ],
    "Cultural Celebrations": [
      "Valentine's Day",
      "Independence Day",
      "Mother's Day",
      "Father's Day",
      "Veterans Day",
      "Memorial Day",
      "Labor Day"
    ],
    "Seasonal Moments": [
      "Spring Season",
      "Summer Vibes",
      "Autumn Feelings",
      "Winter Wonderland"
    ],
  },

  "birthdays-celebrations": {
    "Birthday Milestones": [
      "Birthday",
      "Sweet 16",
      "21st Birthday",
      "30th Birthday",
      "40th Birthday",
      "50th Birthday"
    ],
    "Joyful Celebrations": [
      "Party",
      "Surprise",
      "Congratulations",
      "Achievement"
    ],
  },

  "love-weddings-anniversaries": {
    "Romantic Moments": [
      "Love",
      "Deep Affection",
      "Hugs",
      "Valentine's Day",
      "Couple's Day"
    ],
    "Commitment Celebrations": [
      "Wedding",
      "Anniversary",
      "Engagement",
      "Proposal"
    ],
  },

  "family-friendship": {
    "Family Bonds": [
      "Mother's Day",
      "Father's Day",
      "Parents",
      "Family Love",
      "Siblings"
    ],
    "Friendship & Connections": [
      "Best Friends",
      "Friendship",
      "True Companions"
    ],
  },

  "work": {
    "Career Milestones": [
      "New Job",
      "Promotion",
      "Retirement",
      "Achievement Award",
      "Boss's Day"
    ],
    "Education & Growth": [
      "Graduation",
      "School",
      "Teacher Appreciation",
      "Student Success"
    ],
  },

  "babies-parenting": {
    "Baby Moments": [
      "Newborn",
      "Baby Shower",
      "Pregnancy",
      "Gender Reveal",
      "First Steps"
    ],
    "Parenting Life": [
      "Mom Life",
      "Dad Life",
      "Family Growth"
    ],
  },

  "pets-animal-lovers": {
    "Beloved Pets": [
      "Pets",
      "Pet Companions",
      "Puppy Love",
      "Furry Friends"
    ],
    "Sea Creatures": [
      "Sea Animals",
      "Marine Life"
    ],
    "Farm Companions": [
      "Farm Animals",
      "Barnyard Friends"
    ],
    "Sky Creatures": [
      "Flying Animals",
      "Bird Companions"
    ],
    "Wildlife": [
      "Wild Animals",
      "Safari Creatures"
    ],
  },

  "support-healing-care": {
    "Care & Support": [
      "Get Well",
      "Thinking of You",
      "Sending Strength",
      "Encouragement"
    ],
    "Sympathy & Comfort": [
      "Condolences",
      "Loss",
      "Farewell Tribute"
    ],
  },

  "hear-every-heart": {
    "Unity & Inclusion": [
      "Inclusivity",
      "Unity",
      "Peace",
      "Equity"
    ],
  },

  "sports": {
    "Sports": [
      "Soccer",
      "Basketball",
      "Football",
      "Baseball",
      "Tennis"
    ],
    "Active Life": [
      "Gym",
      "Yoga",
      "Running",
      "Fitness"
    ],
  },

  "wellness-mindful-living": {
    "Mindful Living": [
      "Self-Care",
      "Meditation",
      "Positive Energy",
      "Calm Moments"
    ],
  },

  "life-journeys-transitions": {
    "New Beginnings": [
      "New Home",
      "Moving",
      "New Chapter",
      "Fresh Start"
    ],
    "Everyday Life": [
      "Thank You",
      "Just Because",
      "Daily Gratitude",
      "Life Moments"
    ],
  },
};

/**
 * 🎯 MAPAS DIRECTOS
 * — Ni glosario, ni IA: SOLO palabras claves
 */
const DIRECT_CATEGORY_MAP = {
  // Holidays
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  independenceday: "seasonal-global-celebrations",
  stpatrick: "seasonal-global-celebrations",
  hanukkah: "seasonal-global-celebrations",
  diwali: "seasonal-global-celebrations",
  veterans: "seasonal-global-celebrations",

  // Birthday
  birthday: "birthdays-celebrations",
  sweet16: "birthdays-celebrations",
  party: "birthdays-celebrations",
  celebration: "birthdays-celebrations",

  // Love
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  proposal: "love-weddings-anniversaries",

  // Family
  family: "family-friendship",
  mothersday: "family-friendship",
  fathersday: "family-friendship",
  parents: "family-friendship",
  siblings: "family-friendship",

  // Work
  newjob: "work",
  promotion: "work",
  retirement: "work",
  graduation: "work",

  // Babies
  baby: "babies-parenting",
  newborn: "babies-parenting",
  genderreveal: "babies-parenting",

  // Animals (ya NO confundido con love)
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",

  // Support
  getwell: "support-healing-care",
  condolences: "support-healing-care",

  // Diversity
  inclusivity: "hear-every-heart",
  unity: "hear-every-heart",

  // Sports
  soccer: "sports",
  basketball: "sports",
  gym: "sports",

  // Wellness
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",

  // Life journeys
  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
};

const DIRECT_SUBCATEGORY_MAP = {};
Object.values(SUBCATEGORY_GROUPS).forEach((groups) => {
  Object.values(groups).flat().forEach((s) => {
    DIRECT_SUBCATEGORY_MAP[s.toLowerCase().replace(/[^a-z0-9]/g, "")] = s;
  });
});

// Normalizador
function normalize(t) {
  return t?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
}

/**
 * 🧠 CLASIFICACIÓN PRINCIPAL
 */
export function classifyVideo(filename) {
  const name = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = name.toLowerCase().split(/[_\s-]+/);

  // Detectar variant
  const last = parts.at(-1);
  const isVar = /^[0-9]+[a-z]$/i.test(last);
  const variant = isVar ? last.toUpperCase() : "1A";

  const words = isVar ? parts.slice(0, -1) : parts;

  const foundCategories = new Map();

  words.forEach((p) => {
    const n = normalize(p);

    // Buscar categoría directa
    if (DIRECT_CATEGORY_MAP[n]) {
      const slug = DIRECT_CATEGORY_MAP[n];
      if (!foundCategories.has(slug)) foundCategories.set(slug, []);
    }

    // Buscar subcategoría dentro de grupos
    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];

      for (const [slug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        for (const list of Object.values(groups)) {
          if (list.includes(sub)) {
            if (!foundCategories.has(slug)) foundCategories.set(slug, []);
            if (!foundCategories.get(slug).includes(sub)) {
              foundCategories.get(slug).push(sub);
            }
          }
        }
      }
    }
  });

  // Si no encontró nada → fallback
  if (foundCategories.size === 0) {
    const fallback = "life-journeys-transitions";
    return [
      {
        categorySlug: fallback,
        categoryName: "Nature & Life Journeys",
        subcategories: ["Life Moments"],
        variant,
        object: parts[0],
      },
    ];
  }

  // Construir resultados
  const results = [];
  foundCategories.forEach((subs, slug) => {
    const cat = BASE_CATEGORIES.find((c) => c.slug === slug);
    results.push({
      categorySlug: slug,
      categoryName: cat?.name ?? "Unknown",
      subcategories: subs.length ? subs : ["General"],
      variant,
      object: parts[0],
    });
  });

  return results;
}

/**
 * 🔍 Búsqueda
 */
export function searchVideos(videos, term) {
  const n = normalize(term);
  return videos.filter((v) =>
    normalize(v.name + " " + v.object).includes(n)
  );
}

/**
 * Agrupar
 */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach((c) => (grouped[c.slug] = []));

  videos.forEach((v) => {
    classifyVideo(v.name).forEach((cls) => {
      if (!grouped[cls.categorySlug].some((x) => x.name === v.name)) {
        grouped[cls.categorySlug].push({
          ...v,
          contextSubcategories: cls.subcategories,
        });
      }
    });
  });

  return grouped;
}

/**
 * Subcategoría
 */
export function filterBySubcategory(videos, sub) {
  return videos.filter((v) => {
    const subs = classifyVideo(v.name).flatMap((c) => c.subcategories);
    return subs.includes(sub);
  });
}

export function filterByCategory(videos, slug) {
  return videos.filter((v) =>
    classifyVideo(v.name).some((c) => c.categorySlug === slug)
  );
}
