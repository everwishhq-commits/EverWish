/**
 * 🧠 SISTEMA DE CLASIFICACIÓN AUTO-APRENDIZAJE V10 (sin "General")
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

// 🗂️ GRUPOS DE SUBCATEGORÍAS (sin "General")
export const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter"],
    "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day"],
    "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
  },
  "birthdays-celebrations": {
    "Birthday": ["Birthday", "Sweet 16", "21st Birthday"],
    "Celebrations": ["Party", "Surprise"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "Hugs", "Valentine's Day"],
    "Wedding": ["Wedding", "Anniversary"],
  },
  "family-friendship": {
    "Family": ["Mother's Day", "Father's Day", "Parents"],
    "Friendship": ["Friends", "Best Friends"],
  },
  "work": {
    "Career": ["New Job", "Promotion", "Retirement"],
    "Education": ["Graduation", "School"],
  },
  "babies-parenting": {
    "Baby": ["Newborn", "Baby Shower", "Pregnancy"],
    "Parenting": ["Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Companion Animals": ["Dogs", "Cats"],
    "Sea Animals": ["Sea Animals"],
    "Farm Animals": ["Farm Animals"],
    "Flying Animals": ["Flying Animals"],
    "Wild Animals": ["Wild Animals"],
  },
  "support-healing-care": {
    "Support": ["Get Well", "Thinking of You"],
    "Sympathy": ["Condolences", "Loss"],
  },
  "hear-every-heart": {
    "Diversity": ["Inclusivity", "Unity", "Peace"],
  },
  "sports": {
    "Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation"],
  },
  "life-journeys-transitions": {
    "New Beginnings": ["New Home", "Moving"],
    "Everyday": ["Thank You", "Just Because"],
  },
};

// 🔎 helper: primera subcategoría de una categoría
function getFirstSubcategory(categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug];
  if (!groups) return null;
  const groupNames = Object.keys(groups);
  if (groupNames.length === 0) return null;
  const firstGroup = groups[groupNames[0]];
  if (!firstGroup || firstGroup.length === 0) return null;
  return firstGroup[0]; // la primera sub de la primera lista
}

// 🎯 PALABRAS CLAVE MÍNIMAS (solo las esenciales para identificar categorías)
const CATEGORY_KEYWORDS = {
  // Holidays
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  holidays: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",

  // Celebrations
  birthday: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  party: "birthdays-celebrations",

  // Love
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",

  // Family
  family: "family-friendship",
  mother: "family-friendship",
  father: "family-friendship",
  parents: "family-friendship",

  // Work
  work: "work",
  graduation: "work",

  // Babies
  baby: "babies-parenting",

  // Animals (grupos)
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",

  // Support
  support: "support-healing-care",
  sympathy: "support-healing-care",

  // Connection
  diversity: "hear-every-heart",

  // Sports
  sports: "sports",

  // Wellness
  wellness: "wellness-mindful-living",

  // Nature & transitions
  nature: "life-journeys-transitions",
};

// 🏷️ SUBCATEGORÍAS MÍNIMAS (solo nombres finales, no objetos)
const SUBCATEGORY_KEYWORDS = {
  // holidays
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  valentine: "Valentine's Day",
  july4: "Independence Day",
  independence: "Independence Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",

  // celebrations
  birthday: "Birthday",
  party: "Party",
  surprise: "Surprise",
  "sweet16": "Sweet 16",
  "21st": "21st Birthday",

  // love
  love: "Love",
  hugs: "Hugs",
  wedding: "Wedding",
  anniversary: "Anniversary",

  // family
  parents: "Parents",
  friends: "Friends",
  "bestfriends": "Best Friends",

  // animals (grupos, no individuos)
  seaanimals: "Sea Animals",
  farmanimals: "Farm Animals",
  flyinganimals: "Flying Animals",
  wildanimals: "Wild Animals",
  "companionanimals": "Companion Animals",

  // support
  "getwell": "Get Well",
  "thinkingofyou": "Thinking of You",
  condolences: "Condolences",
  loss: "Loss",

  // sports
  soccer: "Soccer",
  basketball: "Basketball",
  football: "Football",

  // fitness
  gym: "Gym",
  yoga: "Yoga",

  // wellness
  "selfcare": "Self-Care",
  meditation: "Meditation",

  // life journeys
  "newhome": "New Home",
  moving: "Moving",
  "thankyou": "Thank You",
  "justbecause": "Just Because",
};

// 🧠 GLOSARIO AUTO-GENERADO
let LEARNED_GLOSSARY = {};

// normalizar
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// aprender desde filename
export function learnFromFilename(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);

  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const relevantParts = isVariant ? parts.slice(0, -1) : parts;

  const object = relevantParts[0];
  if (!object) return;

  const groups = relevantParts.slice(1).filter((part) => {
    const norm = normalize(part);
    return CATEGORY_KEYWORDS[norm] || SUBCATEGORY_KEYWORDS[norm];
  });

  if (groups.length > 0) {
    const normalizedObject = normalize(object);
    if (!LEARNED_GLOSSARY[normalizedObject]) {
      LEARNED_GLOSSARY[normalizedObject] = {
        object: object,
        categories: new Set(),
        subcategories: new Set(),
        appearances: 0,
      };
    }

    groups.forEach((group) => {
      const norm = normalize(group);
      if (CATEGORY_KEYWORDS[norm]) {
        LEARNED_GLOSSARY[normalizedObject].categories.add(
          CATEGORY_KEYWORDS[norm]
        );
      }
      if (SUBCATEGORY_KEYWORDS[norm]) {
        LEARNED_GLOSSARY[normalizedObject].subcategories.add(
          SUBCATEGORY_KEYWORDS[norm]
        );
      }
    });

    LEARNED_GLOSSARY[normalizedObject].appearances++;
  }
}

function findInGlossary(word) {
  const normalized = normalize(word);
  return LEARNED_GLOSSARY[normalized] || null;
}

// 📊 CLASIFICAR
export function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);

  // aprender
  learnFromFilename(filename);

  const lastPart = parts[parts.length - 1] || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
  const variant = isVariant ? lastPart.toUpperCase() : "1A";

  const object = parts[0] || "unknown";

  const classificationParts = isVariant ? parts.slice(1, -1) : parts.slice(1);

  const categoriesMap = new Map();

  // 1) categorías por palabra clave
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    if (CATEGORY_KEYWORDS[normalized]) {
      const categorySlug = CATEGORY_KEYWORDS[normalized];
      if (!categoriesMap.has(categorySlug)) {
        // no pongas "General", toma la primera sub de esa categoría
        const fallbackSub = getFirstSubcategory(categorySlug) || null;
        categoriesMap.set(categorySlug, fallbackSub);
      }
    }
  });

  // 2) categorías desde glosario
  const glossaryEntry = findInGlossary(object);
  if (glossaryEntry) {
    glossaryEntry.categories.forEach((catSlug) => {
      if (!categoriesMap.has(catSlug)) {
        const fallbackSub = getFirstSubcategory(catSlug) || null;
        categoriesMap.set(catSlug, fallbackSub);
      }
    });
  }

  // 3) subcategorías exactas detectadas en el nombre
  classificationParts.forEach((part) => {
    const normalized = normalize(part);
    if (SUBCATEGORY_KEYWORDS[normalized]) {
      const subcategory = SUBCATEGORY_KEYWORDS[normalized];
      // actualizar las que ya están
      categoriesMap.forEach((currentSub, categorySlug) => {
        const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
        for (const subs of Object.values(groups)) {
          if (subs.includes(subcategory)) {
            categoriesMap.set(categorySlug, subcategory);
            break;
          }
        }
      });
    }
  });

  // 4) subcategorías aprendidas del glosario
  if (glossaryEntry) {
    glossaryEntry.subcategories.forEach((subcategory) => {
      categoriesMap.forEach((currentSub, categorySlug) => {
        const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
        for (const subs of Object.values(groups)) {
          if (subs.includes(subcategory)) {
            categoriesMap.set(categorySlug, subcategory);
            break;
          }
        }
      });
    });
  }

  // 5) convertir
  const results = [];
  categoriesMap.forEach((subcategory, categorySlug) => {
    const categoryObj = BASE_CATEGORIES.find((c) => c.slug === categorySlug);
    // si todavía no hay sub, pon la primera de esa categoría
    const finalSub =
      subcategory || getFirstSubcategory(categorySlug) || "Unsorted";

    results.push({
      categorySlug,
      categoryName: categoryObj?.name || "Unsorted",
      subcategories: [finalSub],
      variant,
      object,
    });
  });

  // 6) default si no encontró nada
  if (results.length === 0) {
    const fallbackCat = "life-journeys-transitions";
    results.push({
      categorySlug: fallbackCat,
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallbackCat) || "Unsorted"],
      variant,
      object,
    });
  }

  return results;
}

// 💾 guardar glosario
export function getLearnedGlossary() {
  const glossary = {};
  Object.entries(LEARNED_GLOSSARY).forEach(([key, value]) => {
    glossary[key] = {
      object: value.object,
      categories: [...value.categories],
      subcategories: [...value.subcategories],
      appearances: value.appearances,
    };
  });
  return glossary;
}

// 📂 cargar glosario
export function loadGlossary(glossary) {
  if (!glossary) return;
  Object.entries(glossary).forEach(([key, value]) => {
    LEARNED_GLOSSARY[key] = {
      object: value.object,
      categories: new Set(value.categories || []),
      subcategories: new Set(value.subcategories || []),
      appearances: value.appearances || 0,
    };
  });
  console.log(
    `📚 Glosario cargado: ${Object.keys(LEARNED_GLOSSARY).length} objetos`
  );
}

// 🔎 búsqueda
export function searchVideos(videos, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return videos;
  const normalized = normalize(searchTerm);

  return videos.filter((video) => {
    const searchableText = [video.name, video.object, ...(video.tags || [])]
      .filter(Boolean)
      .join(" ");
    if (normalize(searchableText).includes(normalized)) return true;

    const glossaryEntry = findInGlossary(searchTerm);
    if (glossaryEntry) {
      const videoObject = normalize(
        video.object || video.name?.split("_")[0]
      );
      return videoObject === normalized;
    }

    return false;
  });
}

// agrupar
export function groupVideosByBaseCategory(videos) {
  const grouped = {};
  BASE_CATEGORIES.forEach((c) => (grouped[c.slug] = []));

  videos.forEach((video) => {
    if (video.categories && Array.isArray(video.categories)) {
      video.categories.forEach((catSlug) => {
        if (grouped[catSlug] && !grouped[catSlug].some((v) => v.name === video.name)) {
          grouped[catSlug].push(video);
        }
      });
    } else {
      const classifications = classifyVideo(video.name);
      classifications.forEach((classification) => {
        const slug = classification.categorySlug;
        if (grouped[slug] && !grouped[slug].some((v) => v.name === video.name)) {
          grouped[slug].push({
            ...video,
            contextSubcategories: classification.subcategories,
            contextCategory: classification.categoryName,
          });
        }
      });
    }
  });

  return grouped;
}

export function filterByCategory(videos, categorySlug) {
  return videos.filter((video) => {
    if (video.categories && Array.isArray(video.categories)) {
      return video.categories.includes(categorySlug);
    }
    const classifications = classifyVideo(video.name);
    return classifications.some((c) => c.categorySlug === categorySlug);
  });
}

export function getGroupsWithSubcategories(videos, categorySlug) {
  const groups = SUBCATEGORY_GROUPS[categorySlug] || {};
  const result = {};

  Object.entries(groups).forEach(([groupName, subcategories]) => {
    const subsWithVideos = [];
    subcategories.forEach((sub) => {
      const count = videos.filter((v) => {
        if (v.subcategory === sub) return true;
        if (v.contextSubcategories?.includes(sub)) return true;
        return false;
      }).length;
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

export function filterBySubcategory(videos, subcategory) {
  return videos.filter((video) => {
    if (video.subcategory === subcategory) return true;
    if (video.contextSubcategories?.includes(subcategory)) return true;
    return false;
  });
    }
