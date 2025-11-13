/**
 * 🧠 SISTEMA DE CLASIFICACIÓN SIMPLIFICADO V13
 * - Clasifica por nombre de archivo (más estable)
 * - Soporta múltiples categorías y subcategorías
 * - Usa variantes 1A, 2A, 3A automáticamente
 * - Evita ambigüedades (animal → pets, birthday → celebrations)
 * - NO depende de glosario cargado desde index.json
 */

/* ---------------------------------------------------------
   🗂 BASE CATEGORIES
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   🗂 SUBCATEGORY GROUPS
--------------------------------------------------------- */
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter", "St Patricks Day"],
    "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day"],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Birthday", "Milestone Birthday", "Sweet 16", "21st Birthday"],
    "Celebrations": ["Party", "Surprise", "Gender Reveal"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "Hugs", "Romantic"],
    "Wedding": ["Wedding", "Engagement", "Anniversary"],
  },
  "family-friendship": {
    "Family": ["Mother's Day", "Father's Day", "Parents"],
    "Friendship": ["Friends", "Best Friends"],
  },
  "work": {
    "Career": ["New Job", "Promotion", "Retirement", "Boss Day"],
    "Education": ["Graduation", "School", "Teacher Appreciation"],
  },
  "babies-parenting": {
    "Baby": ["Newborn", "Baby Shower", "Pregnancy", "Gender Reveal"],
    "Parenting": ["Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Beloved Pets": ["Companion Animals", "Furry Friends", "Exotic Pets"],
    "Sea Animals": ["Sea Animals", "Ocean Friends"],
    "Farm Animals": ["Farm Animals", "Barnyard Helpers"],
    "Flying Animals": ["Flying Animals", "Sky Creatures"],
    "Wild Animals": ["Wild Animals", "Safari Friends"],
  },
  "support-healing-care": {
    "Support": ["Get Well", "Thinking of You", "Recovery"],
    "Sympathy": ["Condolences", "Loss"],
  },
  "hear-every-heart": {
    "Diversity": ["Inclusivity", "Unity", "Peace", "For Everyone"],
  },
  "sports": {
    "Sports": ["Soccer", "Basketball", "Football", "Baseball"],
    "Fitness": ["Gym", "Yoga", "Running"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Mindfulness"],
  },
  "life-journeys-transitions": {
    "New Beginnings": ["New Home", "Moving", "Journey", "New Chapter"],
    "Everyday": ["Thank You", "Just Because", "Daily Moments"],
  },
};

/* ---------------------------------------------------------
   🧠 DIRECT MAPS (palabra → categoría/subcategoría)
--------------------------------------------------------- */
function normalize(t) {
  return t?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

const DIRECT_CATEGORY_MAP = {
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  stpatricksday: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",

  birthday: "birthdays-celebrations",
  milestone: "birthdays-celebrations",
  party: "birthdays-celebrations",
  genderreveal: "birthdays-celebrations",

  love: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  engagement: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",

  mother: "family-friendship",
  father: "family-friendship",
  family: "family-friendship",
  friends: "family-friendship",

  newborn: "babies-parenting",
  baby: "babies-parenting",
  pregnancy: "babies-parenting",
  parenting: "babies-parenting",

  pet: "pets-animal-lovers",
  animallovers: "pets-animal-lovers",

  getwell: "support-healing-care",
  condolences: "support-healing-care",

  diversity: "hear-every-heart",

  soccer: "sports",
  basketball: "sports",
  football: "sports",

  wellness: "wellness-mindful-living",

  newhome: "life-journeys-transitions",
  moving: "life-journeys-transitions",
};

const DIRECT_SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  easter: "Easter",
  thanksgiving: "Thanksgiving",
  stpatricksday: "St Patricks Day",

  birthday: "Birthday",
  milestone: "Milestone Birthday",
  genderreveal: "Gender Reveal",

  love: "Love",
  wedding: "Wedding",
  engagement: "Engagement",
  anniversary: "Anniversary",

  newborn: "Newborn",
  baby: "Baby Shower",
  pregnancy: "Pregnancy",

  seaanimals: "Sea Animals",
  oceanfriends: "Sea Animals",
  safari: "Safari Friends",

  getwell: "Get Well",
  condolences: "Condolences",

  soccer: "Soccer",
  basketball: "Basketball",
};

/* ---------------------------------------------------------
   🧩 CLASIFICAR VIDEO
--------------------------------------------------------- */
function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;

  const firstGroup = Object.values(groups)[0];
  return firstGroup?.[0] || null;
}

export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/i, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);

  const last = parts.at(-1);
  const isVariant = /^[0-9]+[a-z]$/i.test(last);
  const variant = isVariant ? last.toUpperCase() : "1A";

  const nameParts = isVariant ? parts.slice(0, -1) : parts;

  const object = nameParts[0];

  const categoriesFound = new Map();

  for (const part of nameParts) {
    const n = normalize(part);

    if (DIRECT_CATEGORY_MAP[n]) {
      const catSlug = DIRECT_CATEGORY_MAP[n];
      if (!categoriesFound.has(catSlug)) categoriesFound.set(catSlug, []);
    }

    if (DIRECT_SUBCATEGORY_MAP[n]) {
      const sub = DIRECT_SUBCATEGORY_MAP[n];

      for (const [catSlug, groups] of Object.entries(SUBCATEGORY_GROUPS)) {
        const match = Object.values(groups).some((subs) => subs.includes(sub));
        if (match) {
          if (!categoriesFound.has(catSlug)) categoriesFound.set(catSlug, []);
          if (!categoriesFound.get(catSlug).includes(sub)) {
            categoriesFound.get(catSlug).push(sub);
          }
        }
      }
    }
  }

  if (categoriesFound.size === 0) {
    const fallback = "life-journeys-transitions";
    return [
      {
        categorySlug: fallback,
        categoryName: "Nature & Life Journeys",
        subcategories: [getFirstSubcategory(fallback)],
        variant,
        object,
      },
    ];
  }

  const results = [];
  for (const [slug, subs] of categoriesFound.entries()) {
    const cat = BASE_CATEGORIES.find((c) => c.slug === slug);

    if (subs.length === 0) {
      const first = getFirstSubcategory(slug);
      if (first) subs.push(first);
    }

    results.push({
      categorySlug: slug,
      categoryName: cat?.name || "Unsorted",
      subcategories: subs,
      variant,
      object,
    });
  }

  return results;
}

/* ---------------------------------------------------------
   🔍 SEARCH
--------------------------------------------------------- */
export function searchVideos(videos, term) {
  const n = normalize(term);
  if (!n) return videos;

  return videos.filter((v) => {
    const text = normalize(
      [v.name, v.object, ...(v.tags || [])].join(" ")
    );
    return text.includes(n);
  });
}

/* ---------------------------------------------------------
   📂 AGRUPAR POR CATEGORÍA
--------------------------------------------------------- */
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach((c) => (grouped[c.slug] = []));

  videos.forEach((v) => {
    const classifications = classifyVideo(v.name);
    classifications.forEach((c) => {
      if (!grouped[c.categorySlug].some((x) => x.name === v.name)) {
        grouped[c.categorySlug].push({
          ...v,
          contextSubcategories: c.subcategories,
        });
      }
    });
  });

  return grouped;
}

/* ---------------------------------------------------------
   🎯 FILTRAR POR CATEGORÍA
--------------------------------------------------------- */
export function filterByCategory(videos, categorySlug) {
  return videos.filter((v) => {
    const cl = classifyVideo(v.name);
    return cl.some((c) => c.categorySlug === categorySlug);
  });
}

/* ---------------------------------------------------------
   📊 OBTENER GRUPOS + SUBCATEGORÍAS
--------------------------------------------------------- */
export function getGroupsWithSubcategories(videos, slug) {
  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const result = {};

  Object.entries(groups).forEach(([groupName, subs]) => {
    const filtered = subs
      .map((sub) => ({
        name: sub,
        count: videos.filter((v) => {
          const cl = classifyVideo(v.name);

          const all = [];
          cl.forEach((c) => {
            all.push(...c.subcategories);
          });

          return all.includes(sub);
        }).length,
      }))
      .filter((s) => s.count > 0);

    if (filtered.length > 0) result[groupName] = filtered;
  });

  return result;
}

/* ---------------------------------------------------------
   🎯 FILTRAR POR SUBCATEGORÍA
--------------------------------------------------------- */
export function filterBySubcategory(videos, sub) {
  return videos.filter((v) => {
    const cl = classifyVideo(v.name);
    const allSubs = [];

    cl.forEach((c) => {
      allSubs.push(...c.subcategories);
    });

    return allSubs.includes(sub);
  });
    }
