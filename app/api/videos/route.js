/**
 * 📡 Everwish Dynamic Video API
 * Lee archivos .mp4 DIRECTAMENTE desde /public/videos en cada request
 * NO necesita index.json - todo es automático
 */

import fs from "fs";
import path from "path";

// 📚 Mapeo de palabras → categorías principales
// Basado en los nombres de archivos reales del proyecto
const CATEGORY_MAP = {
  // Holidays (Seasonal & Global Celebrations)
  holidays: "Seasonal & Global Celebrations",
  halloween: "Seasonal & Global Celebrations",
  christmas: "Seasonal & Global Celebrations",
  xmas: "Seasonal & Global Celebrations",
  thanksgiving: "Seasonal & Global Celebrations",
  easter: "Seasonal & Global Celebrations",
  independenceday: "Seasonal & Global Celebrations",
  july4: "Seasonal & Global Celebrations",
  newyear: "Seasonal & Global Celebrations",
  
  // Love & Romance
  love: "Love, Weddings & Anniversaries",
  valentine: "Love, Weddings & Anniversaries",
  valentines: "Love, Weddings & Anniversaries",
  wedding: "Love, Weddings & Anniversaries",
  anniversary: "Love, Weddings & Anniversaries",
  hugs: "Love, Weddings & Anniversaries",
  
  // Birthdays & Celebrations
  birthday: "Birthdays & Celebrations",
  bday: "Birthdays & Celebrations",
  celebration: "Birthdays & Celebrations",
  celebrations: "Birthdays & Celebrations",
  party: "Birthdays & Celebrations",
  
  // Family & Friendship
  mother: "Family & Friendship",
  mothers: "Family & Friendship",
  mom: "Family & Friendship",
  father: "Family & Friendship",
  dad: "Family & Friendship",
  family: "Family & Friendship",
  friend: "Family & Friendship",
  
  // Babies & Parenting
  baby: "Babies & Parenting",
  newborn: "Babies & Parenting",
  
  // Pets & Animals
  pet: "Pets & Animal Lovers",
  pets: "Pets & Animal Lovers",
  dog: "Pets & Animal Lovers",
  dogcat: "Pets & Animal Lovers",
  cat: "Pets & Animal Lovers",
  turtle: "Pets & Animal Lovers",
  fish: "Pets & Animal Lovers",
  bird: "Pets & Animal Lovers",
  animal: "Pets & Animal Lovers",
  animals: "Pets & Animal Lovers",
  animalsandnature: "Pets & Animal Lovers",
  
  // Support, Healing & Care
  condolence: "Support, Healing & Care",
  sympathy: "Support, Healing & Care",
  getwell: "Support, Healing & Care",
  
  // Everyday & Appreciation
  thank: "Everyday & Appreciation",
  thanks: "Everyday & Appreciation",
  congrats: "Everyday & Appreciation",
  general: "Everyday & Appreciation",
  
  // Creativity & Expression
  art: "Creativity & Expression",
  music: "Creativity & Expression",
  
  // Diversity & Connection
  unity: "Diversity & Connection",
  diversity: "Diversity & Connection",
  
  // Kids & Teens
  kids: "Kids & Teens",
  teen: "Kids & Teens",
  
  // Wellness & Mindful Living
  wellness: "Wellness & Mindful Living",
  meditation: "Wellness & Mindful Living",
  peace: "Wellness & Mindful Living",
  nature: "Wellness & Mindful Living",
  
  // Life Journeys & Transitions
  graduation: "Life Journeys & Transitions",
  travel: "Life Journeys & Transitions",
};

// 🎃 Mapeo de subcategorías
const SUBCATEGORY_MAP = {
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  july4: "Independence Day",
  newyear: "New Year",
  valentine: "Valentine's Day",
  birthday: "Birthday",
  wedding: "Wedding",
  anniversary: "Anniversary",
  baby: "Baby",
  pet: "Pets",
  love: "Love",
  scary: "Scary",
  funny: "Funny",
  cute: "Cute",
  zombie: "Zombie",
  ghost: "Ghost",
  general: "General",
};

// 🔍 Buscar recursivamente archivos .mp4
function getAllMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory()
      ? getAllMp4Files(fullPath)
      : entry.name.toLowerCase().endsWith(".mp4")
      ? [fullPath]
      : [];
  });
}

// 🧠 Detectar categorías desde palabras
function detectCategories(words) {
  const categories = new Set();
  
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    if (CATEGORY_MAP[normalized]) {
      categories.add(CATEGORY_MAP[normalized]);
    }
  }
  
  if (categories.size === 0) {
    categories.add("Everyday & Appreciation");
  }
  
  return Array.from(categories);
}

// 🎯 Detectar subcategoría desde palabras
function detectSubcategory(words) {
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    if (SUBCATEGORY_MAP[normalized]) {
      return SUBCATEGORY_MAP[normalized];
    }
  }
  return "General";
}

// 🔧 Normalizar texto
function normalize(str) {
  return str
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "";
}

// 🪄 Generar listado de videos
function generateVideoList() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  
  if (!fs.existsSync(videosRoot)) {
    console.error("❌ No existe /public/videos/");
    return [];
  }

  const files = getAllMp4Files(videosRoot);
  console.log(`📹 Encontrados ${files.length} archivos .mp4`);

  return files.map((filePath) => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    
    const parts = basename.split("_");
    
    const object = normalize(parts[0] || "Unknown");
    const categories = detectCategories(parts);
    const subcategory = detectSubcategory(parts);
    const variant = parts[parts.length - 1]?.match(/\d+[A-Z]+/i)?.[0] || "1A";
    
    const tags = Array.from(
      new Set([
        ...parts.map(p => p.toLowerCase()),
        object.toLowerCase(),
        ...categories.map(c => c.toLowerCase()),
        subcategory.toLowerCase(),
      ])
    );

    return {
      name: basename,
      file: `/videos/${relative}`,
      object,
      category: categories[0],
      categories,
      subcategory,
      variant,
      slug: basename.toLowerCase().replace(/\s+/g, "-"),
      tags,
    };
  });
}

// 📡 API Endpoint
export async function GET() {
  try {
    const videos = generateVideoList();
    
    console.log(`✅ API respondió con ${videos.length} videos`);
    
    return new Response(
      JSON.stringify({ videos }, null, 2),
      {
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        status: 200,
      }
    );
  } catch (err) {
    console.error("❌ Error en API /api/videos:", err);
    return new Response(
      JSON.stringify({ 
        error: "Failed to load videos", 
        details: err.message,
        videos: []
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
  }
