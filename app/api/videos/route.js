import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

// 🧠 Diccionario de sinónimos e inclusividad
const SYNONYMS = {
  // plurales y animales
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

// 🧩 Frases detectables
const PHRASES = {
  "feliz cumpleaños": "birthday", "happy birthday": "birthday",
  "día de la madre": "mother’s day", "dia de la madre": "mother’s day",
  "día del padre": "father’s day", "día de san valentín": "valentine’s day",
  "día del amor": "valentine’s day", "feliz navidad": "christmas",
  "merry christmas": "christmas", "feliz año nuevo": "new year’s eve",
  "día del trabajo": "labor day", "día de la independencia": "independence day",
  "día de acción de gracias": "thanksgiving", "día de los muertos": "day of the dead",
  "felices fiestas": "holidays", "feliz pascua": "easter",
  "unity and inclusion": "diversity", "celebrating diversity": "diversity",
  "black heritage": "diversity", "latino pride": "diversity",
  "love is love": "diversity", "cultural celebration": "diversity"
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

// 🚀 API principal híbrida
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const logDir = path.join(process.cwd(), "public/logs");
  const logFile = path.join(logDir, "unrecognized.json");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  let unrecognized = [];

  const videos = files.map((file) => {
    const clean = file.replace(".mp4", "");
    const parts = clean.split("_");
    const normalizedName = normalize(clean);

    let [object, category, subcategory] = ["unknown", "general", "general"];

    // 1️⃣ Si cumple el formato (object_category_subcategory_value)
    if (parts.length >= 3) {
      [object, category, subcategory] = parts;
    } else {
      // 2️⃣ Si no cumple formato, usar detección automática
      let detectedSub = null;
      for (const [phrase, mapped] of Object.entries(PHRASES)) {
        if (normalizedName.includes(normalize(phrase))) {
          detectedSub = mapped;
          break;
        }
      }

      const tokens = normalizedName.split(/\s+/).map((t) => SYNONYMS[t] || t);
      const text = tokens.join(" ");

      // Buscar categoría base
      const matchedCat = Object.entries(MAIN_GROUPS).find(([key, g]) =>
        g.keywords.some((kw) => text.includes(normalize(kw)))
      );
      category = matchedCat ? matchedCat[0] : "inspirational";

      // Buscar subcategoría dentro de esa categoría
      const group = matchedCat ? matchedCat[1] : MAIN_GROUPS.inspirational;
      const foundSub = group.subcategories.find((s) =>
        text.includes(normalize(s))
      );
      subcategory = foundSub || detectedSub || "General";
    }

    // 3️⃣ Validar subcategoría: si no existe en el lib, asignar “General”
    const validSubs = Object.values(MAIN_GROUPS).flatMap((g) => g.subcategories);
    if (!validSubs.includes(subcategory)) subcategory = "General";

    // 4️⃣ Extraer datos de grupo
    const group = MAIN_GROUPS[category] || MAIN_GROUPS.inspirational;

    return {
      mainName: group.mainName,
      mainEmoji: group.mainEmoji,
      mainColor: group.mainColor,
      mainSlug: category,
      object,
      category,
      subcategory,
      src: `/cards/${file}`,
    };
  });

  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));
  return NextResponse.json({ videos });
}
