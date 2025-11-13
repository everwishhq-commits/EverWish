/**
 * 🧠 GENERADOR CON PROTECCIÓN CONTRA CONTAMINACIÓN V4 - COMPLETO
 * - Evita que "zombie" contamine "New Beginning"
 * - Detecta contextos correctos
 * - Limpia clasificaciones erróneas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== SISTEMA DE CLASIFICACIÓN COMPLETO =====

const BASE_CATEGORIES = [
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

const SUBCATEGORY_GROUPS = {
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

const DIRECT_CATEGORY_MAP = {
  halloween: "seasonal-global-celebrations",
  christmas: "seasonal-global-celebrations",
  xmas: "seasonal-global-celebrations",
  thanksgiving: "seasonal-global-celebrations",
  easter: "seasonal-global-celebrations",
  july4: "seasonal-global-celebrations",
  valentine: "seasonal-global-celebrations",
  valentines: "seasonal-global-celebrations",
  seaanimals: "pets-animal-lovers",
  farmanimals: "pets-animal-lovers",
  flyinganimals: "pets-animal-lovers",
  wildanimals: "pets-animal-lovers",
  animallovers: "pets-animal-lovers",
  pets: "pets-animal-lovers",
  pet: "pets-animal-lovers",
  dog: "pets-animal-lovers",
  dogs: "pets-animal-lovers",
  cat: "pets-animal-lovers",
  cats: "pets-animal-lovers",
  moving: "life-journeys-transitions",
  newhome: "life-journeys-transitions",
  newbeginning: "life-journeys-transitions",
  newbeginnings: "life-journeys-transitions",
  transition: "life-journeys-transitions",
  thankyou: "life-journeys-transitions",
  justbecause: "life-journeys-transitions",
  nature: "life-journeys-transitions",
  birthday: "birthdays-celebrations",
  celebration: "birthdays-celebrations",
  party: "birthdays-celebrations",
  love: "love-weddings-anniversaries",
  wedding: "love-weddings-anniversaries",
  romance: "love-weddings-anniversaries",
  hugs: "love-weddings-anniversaries",
  anniversary: "love-weddings-anniversaries",
  family: "family-friendship",
  mother: "family-friendship",
  mothers: "family-friendship",
  mothersday: "family-friendship",
  father: "family-friendship",
  fathers: "family-friendship",
  fathersday: "family-friendship",
  parents: "family-friendship",
  friends: "family-friendship",
  friendship: "family-friendship",
  work: "work",
  graduation: "work",
  career: "work",
  job: "work",
  baby: "babies-parenting",
  newborn: "babies-parenting",
  pregnancy: "babies-parenting",
  support: "support-healing-care",
  sympathy: "support-healing-care",
  condolences: "support-healing-care",
  getwell: "support-healing-care",
  diversity: "hear-every-heart",
  inclusivity: "hear-every-heart",
  sports: "sports",
  gym: "sports",
  fitness: "sports",
  soccer: "sports",
  basketball: "sports",
  football: "sports",
  running: "sports",
  yoga: "sports",
  wellness: "wellness-mindful-living",
  meditation: "wellness-mindful-living",
  selfcare: "wellness-mindful-living",
};

const DIRECT_SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  xmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  valentine: "Valentine's Day",
  valentines: "Valentine's Day",
  july4: "Independence Day",
  mothersday: "Mother's Day",
  fathersday: "Father's Day",
  birthday: "Birthday",
  anniversary: "Anniversary",
  party: "Party",
  seaanimals: "Sea Animals",
  farmanimals: "Farm Animals",
  flyinganimals: "Flying Animals",
  wildanimals: "Wild Animals",
  companionanimals: "Companion Animals",
  dogs: "Dogs",
  cats: "Cats",
  love: "Love",
  hugs: "Hugs",
  wedding: "Wedding",
  gym: "Gym",
  yoga: "Yoga",
  soccer: "Soccer",
  basketball: "Basketball",
  football: "Football",
  moving: "Moving",
  newhome: "New Home",
  newbeginning: "New Home",
  newbeginnings: "New Home",
  thankyou: "Thank You",
  justbecause: "Just Because",
  graduation: "Graduation",
  newjob: "New Job",
  getwell: "Get Well",
  condolences: "Condolences",
};

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
  return t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
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

function classifyVideo(filename) {
  const basename = filename.replace(/\.(mp4|MP4)$/, "");
  const parts = basename.toLowerCase().split(/[_\s-]+/);
  
  const lastPart = parts.at(-1) || "";
  const isVariant = /^[0-9]+[a-z]$/i.test(lastPart);
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
  
  const glossary = LEARNED_GLOSSARY[normalize(object)];
  if (glossary && !isObjectKeyword(object)) {
    glossary.categories.forEach(slug => {
      if (slug === "pets-animal-lovers" && categoriesFound.size > 0) {
        const hasNonPetCategory = [...categoriesFound.keys()].some(s => s !== "pets-animal-lovers");
        if (hasNonPetCategory) return;
      }
      
      if (!categoriesFound.has(slug)) {
        categoriesFound.set(slug, []);
      }
    });
    
    glossary.subcategories.forEach(sub => {
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
    });
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
      categoryName: "Nature & Life Journeys",
      subcategories: [getFirstSubcategory(fallback)].filter(Boolean),
      variant,
      object,
    });
  }
  
  const key = normalize(object);
  if (!isObjectKeyword(object)) {
    if (!LEARNED_GLOSSARY[key]) {
      LEARNED_GLOSSARY[key] = {
        object,
        categories: new Set(),
        subcategories: new Set(),
        appearances: 0,
      };
    }
    
    results.forEach(r => {
      LEARNED_GLOSSARY[key].categories.add(r.categorySlug);
      r.subcategories.forEach(sub => LEARNED_GLOSSARY[key].subcategories.add(sub));
    });
    LEARNED_GLOSSARY[key].appearances++;
  }
  
  return results;
}

// ===== GENERACIÓN =====

function getAllMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory()
      ? getAllMp4Files(fullPath)
      : entry.name.endsWith(".mp4")
      ? [fullPath]
      : [];
  });
}

function capitalize(str) {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generateIndex() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  console.log("🧠 Generando index.json con protección anti-contaminación...\n");
  console.log(`📁 Buscando en: ${videosRoot}\n`);
  
  if (!fs.existsSync(videosRoot)) {
    console.error(`❌ ERROR: La carpeta ${videosRoot} no existe`);
    process.exit(1);
  }
  
  const mp4Files = getAllMp4Files(videosRoot);
  console.log(`📹 Archivos encontrados: ${mp4Files.length}\n`);
  
  if (mp4Files.length === 0) {
    console.warn("⚠️  No se encontraron archivos .mp4");
    return;
  }
  
  const videos = mp4Files.map(filePath => {
    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    const urlPath = "/" + relativePath.replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    
    const classifications = classifyVideo(basename);
    
    const cleanedClassifications = classifications.filter(c => {
      const isNewBeginning = basename.toLowerCase().includes("newbeginning") || 
                             basename.toLowerCase().includes("newhome") ||
                             basename.toLowerCase().includes("moving");
      
      if (isNewBeginning && c.categorySlug === "pets-animal-lovers") {
        console.log(`   🧹 LIMPIEZA: Removiendo "pets-animal-lovers" de "${basename}"`);
        return false;
      }
      
      return true;
    });
    
    const mainClassification = cleanedClassifications[0] || classifications[0];
    const allCategorySlugs = cleanedClassifications.map(c => c.categorySlug);
    const allCategoryNames = cleanedClassifications.map(c => c.categoryName);
    
    const allSubcategories = [];
    cleanedClassifications.forEach(c => {
      if (c.subcategories && c.subcategories.length > 0) {
        c.subcategories.forEach(sub => {
          if (!allSubcategories.includes(sub)) {
            allSubcategories.push(sub);
          }
        });
      }
    });
    
    const tags = [
      basename.toLowerCase(),
      mainClassification.object.toLowerCase(),
      ...allCategorySlugs,
      ...allSubcategories.map(s => s.toLowerCase()),
    ];
    
    const videoData = {
      name: basename,
      file: urlPath,
      object: capitalize(mainClassification.object),
      category: mainClassification.categoryName,
      categories: allCategorySlugs,
      subcategory: allSubcategories[0],
      subcategories: allSubcategories,
      value: mainClassification.variant,
      slug: basename.toLowerCase(),
      tags: [...new Set(tags)],
    };
    
    console.log(`✅ ${videoData.name}`);
    console.log(`   🎨 Object: ${videoData.object}`);
    console.log(`   📂 Categories: [${allCategoryNames.join(", ")}]`);
    console.log(`   🏷️  Subcategories: [${allSubcategories.join(", ")}]`);
    
    if (allSubcategories.length === 0) {
      console.log(`   ⚠️  WARNING: No subcategories detected!`);
    } else if (allSubcategories.length > 1) {
      console.log(`   ✨ Multiple subcategories: ${allSubcategories.join(", ")}`);
    }
    console.log("");
    
    return videoData;
  });
  
  const glossary = {};
  Object.entries(LEARNED_GLOSSARY).forEach(([k, v]) => {
    if (isObjectKeyword(v.object)) {
      console.log(`   🧹 SKIP glosario: "${v.object}" (objeto específico)`);
      return;
    }
    
    glossary[k] = {
      object: v.object,
      categories: [...v.categories],
      subcategories: [...v.subcategories],
      appearances: v.appearances,
    };
  });
  
  const indexData = {
    videos,
    glossary,
    generated: new Date().toISOString(),
    total: videos.length,
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`\n✅ Index generado: ${indexFile}`);
  console.log(`📊 Total de videos: ${videos.length}`);
  console.log(`📚 Objetos en glosario: ${Object.keys(glossary).length}\n`);
}

try {
  generateIndex();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
  }
