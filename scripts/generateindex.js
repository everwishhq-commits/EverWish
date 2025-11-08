/**
 * 🧩 Everwish Smart Index Generator - AUTOMÁTICO
 * Lee nombres de archivos y clasifica automáticamente EN TIEMPO REAL
 * Formato: object_categoria1_categoria2_subcategoria_variante.mp4
 * 
 * Se ejecuta automáticamente:
 * 1. Durante build (npm run build)
 * 2. Durante dev (npm run dev)
 * 3. Desde /api/videos en cada request
 */

import fs from "fs";
import path from "path";

const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");

// 📚 Mapeo completo de palabras → categorías principales
const CATEGORY_MAP = {
  // Seasonal & Holidays
  halloween: "Seasonal & Global Celebrations",
  christmas: "Seasonal & Global Celebrations",
  xmas: "Seasonal & Global Celebrations",
  thanksgiving: "Seasonal & Global Celebrations",
  easter: "Seasonal & Global Celebrations",
  july4: "Seasonal & Global Celebrations",
  independence: "Seasonal & Global Celebrations",
  newyear: "Seasonal & Global Celebrations",
  "new-year": "Seasonal & Global Celebrations",
  holiday: "Seasonal & Global Celebrations",
  
  // Love & Romance
  love: "Love, Weddings & Anniversaries",
  valentine: "Love, Weddings & Anniversaries",
  valentines: "Love, Weddings & Anniversaries",
  wedding: "Love, Weddings & Anniversaries",
  anniversary: "Love, Weddings & Anniversaries",
  romance: "Love, Weddings & Anniversaries",
  
  // Birthdays
  birthday: "Birthdays & Celebrations",
  bday: "Birthdays & Celebrations",
  celebration: "Birthdays & Celebrations",
  party: "Birthdays & Celebrations",
  
  // Family & Friendship
  mother: "Family & Friendship",
  mom: "Family & Friendship",
  father: "Family & Friendship",
  dad: "Family & Friendship",
  family: "Family & Friendship",
  friend: "Family & Friendship",
  friendship: "Family & Friendship",
  
  // Babies
  baby: "Babies & Parenting",
  newborn: "Babies & Parenting",
  shower: "Babies & Parenting",
  
  // Pets & Animals
  pet: "Pets & Animal Lovers",
  pets: "Pets & Animal Lovers",
  dog: "Pets & Animal Lovers",
  cat: "Pets & Animal Lovers",
  turtle: "Pets & Animal Lovers",
  fish: "Pets & Animal Lovers",
  bird: "Pets & Animal Lovers",
  animal: "Pets & Animal Lovers",
  animals: "Pets & Animal Lovers",
  
  // Support & Care
  condolence: "Support, Healing & Care",
  sympathy: "Support, Healing & Care",
  getwell: "Support, Healing & Care",
  healing: "Support, Healing & Care",
  
  // Everyday
  thank: "Everyday & Appreciation",
  thanks: "Everyday & Appreciation",
  congrats: "Everyday & Appreciation",
  congratulations: "Everyday & Appreciation",
  general: "Everyday & Appreciation",
  
  // Creativity
  art: "Creativity & Expression",
  music: "Creativity & Expression",
  design: "Creativity & Expression",
  
  // Diversity
  unity: "Diversity & Connection",
  diversity: "Diversity & Connection",
  
  // Kids
  kids: "Kids & Teens",
  teen: "Kids & Teens",
  cartoon: "Kids & Teens",
  
  // Wellness
  wellness: "Wellness & Mindful Living",
  meditation: "Wellness & Mindful Living",
  peace: "Wellness & Mindful Living",
  nature: "Wellness & Mindful Living",
  
  // Life Journeys
  graduation: "Life Journeys & Transitions",
  travel: "Life Journeys & Transitions",
  retirement: "Life Journeys & Transitions",
  home: "Life Journeys & Transitions",
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

// 🔍 Función: Buscar recursivamente archivos .mp4
function getAllMp4Files(dir) {
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

// 🧠 Función: Detectar categorías desde palabras
function detectCategories(words) {
  const categories = new Set();
  
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    if (CATEGORY_MAP[normalized]) {
      categories.add(CATEGORY_MAP[normalized]);
    }
  }
  
  // Si no encuentra ninguna, usar "Everyday & Appreciation"
  if (categories.size === 0) {
    categories.add("Everyday & Appreciation");
  }
  
  return Array.from(categories);
}

// 🎯 Función: Detectar subcategoría desde palabras
function detectSubcategory(words) {
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    if (SUBCATEGORY_MAP[normalized]) {
      return SUBCATEGORY_MAP[normalized];
    }
  }
  return "General";
}

// 🔧 Función: Normalizar texto
function normalize(str) {
  return str
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "";
}

// 🪄 Función principal: Generar index.json
function generateIndex() {
  console.log("⚙️ Generando index.json...");

  if (!fs.existsSync(videosRoot)) {
    console.error("❌ No existe la carpeta public/videos/");
    return;
  }

  const files = getAllMp4Files(videosRoot);
  console.log(`📹 Encontrados ${files.length} archivos .mp4`);

  const videos = files.map((filePath) => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const basename = path.basename(filePath, ".mp4");
    
    // Separar por guión bajo
    const parts = basename.split("_");
    
    // Extraer componentes
    const object = normalize(parts[0] || "Unknown");
    const categories = detectCategories(parts);
    const subcategory = detectSubcategory(parts);
    const variant = parts[parts.length - 1]?.match(/\d+[A-Z]+/i)?.[0] || "1A";
    
    // Tags para búsqueda
    const tags = Array.from(
      new Set([
        ...parts.map(p => p.toLowerCase()),
        object.toLowerCase(),
        ...categories.map(c => c.toLowerCase()),
        subcategory.toLowerCase(),
      ])
    );

    const video = {
      name: basename,
      file: `/videos/${relative}`,
      object,
      category: categories[0], // categoría principal
      categories, // todas las categorías detectadas
      subcategory,
      variant,
      slug: basename.toLowerCase().replace(/\s+/g, "-"),
      tags,
    };

    console.log(`✅ ${basename}`);
    console.log(`   Categories: ${categories.join(", ")}`);
    console.log(`   Subcategory: ${subcategory}`);

    return video;
  });

  // Guardar
  const output = { videos };
  fs.writeFileSync(indexFile, JSON.stringify(output, null, 2), "utf-8");
  
  console.log(`\n✅ Index actualizado con ${videos.length} videos.`);
  console.log(`📂 Guardado en: ${indexFile}`);
}

generateIndex();
