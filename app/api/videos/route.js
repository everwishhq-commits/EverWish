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
  perro: "dog", perros: "dog", gato: "cat", gatos: "cat",
  tortuga: "turtle", tortugas: "turtle", conejo: "bunny", conejos: "bunny",
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
function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// 🚀 API principal
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const logDir = path.join(process.cwd(), "public/logs");
  const logFile = path.join(logDir, "unrecognized.json");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const unrecognized = [];
  const videos = [];

  for (const file of files) {
    const clean = file.replace(".mp4", "");
    const parts = clean.split("_");
    const normalizedName = normalize(clean);

    let [object, categorySlug, subcategory] = ["unknown", "general", "general"];
    let mainSlug = "inspirational";

    // 1️⃣ Formato correcto: object_category_subcategory_value
    if (parts.length >= 3) {
      [object, categorySlug, subcategory] = parts;
    } else {
      // 2️⃣ Detectar automáticamente
      let detectedSub = null;
      for (const [phrase, mapped] of Object.entries(PHRASES)) {
        if (normalizedName.includes(normalize(phrase))) {
          detectedSub = mapped;
          break;
        }
      }

      const tokens = normalizedName
        .split(/\s+/)
        .map((t) => SYNONYMS[t] || t);
      const text = tokens.join(" ");

      const matchedCat = Object.entries(MAIN_GROUPS).find(([key, g]) =>
        g.keywords.some((kw) => text.includes(normalize(kw)))
      );

      if (matchedCat) {
        mainSlug = matchedCat[0];
        categorySlug = matchedCat[0];
        const foundSub = matchedCat[1].subcategories.find((s) =>
          text.includes(normalize(s))
        );
        subcategory = foundSub || detectedSub || "general";
      } else {
        mainSlug = "inspirational";
        categorySlug = "general";
        subcategory = detectedSub || "general";
      }
    }

    // 3️⃣ Validar subcategoría
    const validSubs = Object.values(MAIN_GROUPS).flatMap((g) => g.subcategories);
    if (!validSubs.includes(subcategory)) subcategory = "general";

    // 4️⃣ Buscar grupo
    const group = MAIN_GROUPS[mainSlug] || MAIN_GROUPS.inspirational;

    videos.push({
      slug: clean,
      src: `/cards/${file}`,
      object,
      mainSlug,
      categorySlug,
      subcategory,
      mainName: group.mainName,
      mainEmoji: group.mainEmoji,
      mainColor: group.mainColor,
    });
  }

  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));
  return NextResponse.json({ videos });
}
