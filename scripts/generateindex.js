/**
 * 🧩 everwish smart index generator (auto categories + subcategories)
 * busca todos los .mp4 en /public/videos/** y crea /public/videos/index.json
 */

import fs from "fs";
import path from "path";

const videos_root = path.join(process.cwd(), "public/videos");
const index_file = path.join(videos_root, "index.json");

// 📚 mapa de palabras clave -> categorías
const category_map = {
  // seasonal
  halloween: "seasonal & holidays",
  christmas: "seasonal & holidays",
  thanksgiving: "seasonal & holidays",
  easter: "seasonal & holidays",
  july4th: "seasonal & holidays",
  independence: "seasonal & holidays",
  newyear: "seasonal & holidays",

  // birthdays
  birthday: "birthdays & celebrations",

  // love
  love: "love, weddings & anniversaries",
  valentines: "love, weddings & anniversaries",
  wedding: "love, weddings & anniversaries",
  anniversary: "love, weddings & anniversaries",

  // family
  mother: "family & friendship",
  mothersday: "family & friendship",
  father: "family & friendship",
  fathersday: "family & friendship",
  family: "family & friendship",
  friend: "family & friendship",
  friendship: "family & friendship",

  // babies
  baby: "babies & parenting",
  newborn: "babies & parenting",

  // pets
  pet: "pets & animal lovers",
  dog: "pets & animal lovers",
  cat: "pets & animal lovers",
  turtle: "pets & animal lovers",
  fish: "pets & animal lovers",
  bird: "pets & animal lovers",

  // support
  condolence: "support, healing & care",
  sympathy: "support, healing & care",
  getwell: "support, healing & care",

  // everyday
  general: "everyday & appreciation",
  thank: "everyday & appreciation",
  motivational: "everyday & appreciation",
  congratulations: "everyday & appreciation",

  // creativity
  art: "creativity & expression",
  design: "creativity & expression",
  music: "creativity & expression",
  festival: "creativity & expression",

  // diversity
  unity: "diversity & connection",
  respect: "diversity & connection",
  humanity: "diversity & connection",

  // kids
  cartoon: "kids & teens",
  adventure: "kids & teens",
  fantasy: "kids & teens",
  learning: "kids & teens",

  // wellness
  faith: "wellness & mindful living",
  peace: "wellness & mindful living",
  meditation: "wellness & mindful living",
  healing: "wellness & mindful living",
  nature: "wellness & mindful living",

  // journeys
  graduation: "life journeys & transitions",
  travel: "life journeys & transitions",
  retirement: "life journeys & transitions",
  home: "life journeys & transitions"
};

// 🧠 normalizar texto
function normalize(str) {
  return str?.toLowerCase().replace(/_/g, " ").trim() || "";
}

// 🐾 buscar todos los mp4 recursivamente
function get_all_mp4_files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory()
      ? get_all_mp4_files(full)
      : entry.name.toLowerCase().endsWith(".mp4")
      ? [full]
      : [];
  });
}

// 🧩 detectar categoría automáticamente
function detect_category(words) {
  for (const w of words) {
    if (category_map[w]) return category_map[w];
  }
  return "everyday & appreciation";
}

// 🧩 detectar subcategoría automáticamente
function detect_subcategory(words) {
  return words
    .filter(w => !["mp4", "video"].includes(w))
    .slice(1)
    .join(" ") || "general";
}

// 🪄 generar index.json
function generate_index() {
  if (!fs.existsSync(videos_root)) {
    console.error("⚠️ no existe la carpeta public/videos/");
    return;
  }

  const files = get_all_mp4_files(videos_root);
  const data = files.map(file_path => {
    const relative = path.relative(videos_root, file_path).replace(/\\/g, "/");
    const base = path.basename(file_path, ".mp4");
    const parts = base.split("_").map(normalize);

    const object = parts[0] || "unknown";
    const category = detect_category(parts);
    const subcategory = detect_subcategory(parts);

    return {
      name: base,
      file: `/videos/${relative}`,
      object,
      category,
      subcategory,
      slug: base.toLowerCase().replace(/\s+/g, "-"),
      tags: Array.from(new Set([...parts, object, category, subcategory]))
    };
  });

  fs.writeFileSync(index_file, JSON.stringify({ videos: data }, null, 2));
  console.log(`✅ index.json actualizado con ${data.length} archivos.`);
}

generate_index();
