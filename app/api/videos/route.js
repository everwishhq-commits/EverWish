import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

// 🧠 Diccionario de sinónimos e inclusividad
const SYNONYMS = {
  zombies: "zombie", ghosts: "ghost", pumpkins: "pumpkin",
  dogs: "dog", puppies: "dog", cats: "cat", kittens: "cat",
  turkeys: "turkey", hearts: "heart", flowers: "flower",
  turtles: "turtle", lions: "lion", tigers: "tiger", bears: "bear",

  // español
  perro: "dog", perros: "dog", gato: "cat", gatos: "cat", tortuga: "turtle",
  tortugas: "turtle", conejo: "bunny", conejos: "bunny",
  fantasma: "ghost", fantasmas: "ghost", calabaza: "pumpkin",
  calabazas: "pumpkin", amor: "love", pareja: "couple",
  boda: "wedding", aniversario: "anniversary", cumpleaños: "birthday",
  cumple: "birthday", fiesta: "party", celebración: "celebration",
  logro: "achievement", éxito: "success", trabajo: "work", familia: "family",
  madre: "mother", padre: "father", bebé: "baby", bebe: "baby",
  amigo: "friend", amiga: "friend", amigos: "friend", amigas: "friend",
  profesor: "teacher", maestro: "teacher", jefa: "boss", jefe: "boss",
  empleado: "employee", empleada: "employee", voluntario: "volunteer",
  artista: "artist", ingeniero: "engineer", enfermera: "nurse", doctor: "doctor",

  // diversidad
  gay: "diversity", lesbian: "diversity", bisexual: "diversity",
  lgbt: "diversity", queer: "diversity", trans: "diversity",
  black: "diversity", african: "diversity", afro: "diversity",
  latino: "diversity", latina: "diversity", hispanic: "diversity",
  asian: "diversity", immigrant: "diversity", migrants: "diversity",
  inclusion: "diversity", equality: "diversity", pride: "diversity",
  respect: "diversity", unity: "diversity", cultural: "diversity",
  color: "diversity", diversity: "diversity"
};

// 🧹 Normalizador
function normalize(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// 🚀 API principal
export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), "public/cards");
    if (!fs.existsSync(baseDir)) {
      return NextResponse.json({ videos: [] });
    }

    let videos = [];

    // 🔍 Recorre todas las carpetas principales (categorías)
    const categoryFolders = fs.readdirSync(baseDir);

    for (const categoryFolder of categoryFolders) {
      const catPath = path.join(baseDir, categoryFolder);
      if (!fs.statSync(catPath).isDirectory()) continue;

      const files = fs.readdirSync(catPath).filter((f) => f.endsWith(".mp4"));

      for (const file of files) {
        const cleanName = file.replace(".mp4", "");
        const parts = cleanName.split("_");
        const normalizedName = normalize(cleanName);

        let [object, category, subcategory] = ["unknown", "general", "general"];

        // 📁 Detecta formato estándar object_category_subcategory_value
        if (parts.length >= 3) {
          [object, category, subcategory] = parts;
        } else {
          // Si no tiene estructura, detecta automáticamente
          const tokens = normalizedName.split(/\s+/).map((t) => SYNONYMS[t] || t);
          const text = tokens.join(" ");

          // Detectar categoría principal
          const matchedCat = Object.entries(MAIN_GROUPS).find(([key, group]) =>
            group.keywords?.some((kw) => text.includes(normalize(kw)))
          );
          category = matchedCat ? matchedCat[0] : categoryFolder;

          // Detectar subcategoría dentro del grupo
          const group = matchedCat ? matchedCat[1] : MAIN_GROUPS[categoryFolder];
          const foundSub =
            group?.subcategories?.find((s) => text.includes(normalize(s))) || "General";
          subcategory = foundSub;
        }

        // 📦 Agrega video detectado
        const group = MAIN_GROUPS[category] || MAIN_GROUPS.inspirational;

        videos.push({
          slug: cleanName,
          src: `/cards/${categoryFolder}/${file}`,
          object,
          mainSlug: categoryFolder,
          categorySlug: category,
          subcategory,
          mainName: group?.mainName || categoryFolder,
          mainEmoji: group?.mainEmoji || "💌",
          mainColor: group?.mainColor || "#FFF5F5",
          extraCategories: [category, subcategory].filter(Boolean),
        });
      }
    }

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("❌ Error loading videos:", error);
    return NextResponse.json({ videos: [] });
  }
             }
