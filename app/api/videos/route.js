import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

// 🧩 Sinónimos e inclusividad
const SYNONYMS = {
  // plurales y básicos
  zombies: "zombie", ghosts: "ghost", pumpkins: "pumpkin",
  dogs: "dog", puppies: "dog", cats: "cat", kittens: "cat",
  turkeys: "turkey", hearts: "heart", flowers: "flower",
  turtles: "turtle", lions: "lion", tigers: "tiger", bears: "bear",

  // español
  perro: "dog", perros: "dog", gato: "cat", gatos: "cat",
  tortuga: "turtle", tortugas: "turtle", conejo: "bunny", conejos: "bunny",
  fantasma: "ghost", fantasmas: "ghost", calabaza: "pumpkin", calabazas: "pumpkin",
  amor: "love", pareja: "couple", boda: "wedding", aniversario: "anniversary",
  cumpleaños: "birthday", cumple: "birthday", fiesta: "party", celebración: "celebration",
  logro: "achievement", éxito: "success", trabajo: "work", familia: "family",
  madre: "mother", padre: "father", bebé: "baby", bebe: "baby",
  amigo: "friend", amiga: "friend", amigos: "friend", amigas: "friend",
  profesor: "teacher", maestro: "teacher", jefa: "boss", jefe: "boss",
  empleado: "employee", empleada: "employee", voluntario: "volunteer",
  artista: "artist", ingeniero: "engineer", enfermera: "nurse", doctor: "doctor",

  // inclusividad y diversidad
  gay: "diversity", lesbian: "diversity", bisexual: "diversity",
  lgbt: "diversity", queer: "diversity", trans: "diversity",
  black: "diversity", african: "diversity", afro: "diversity",
  latino: "diversity", latina: "diversity", hispanic: "diversity",
  asian: "diversity", immigrant: "diversity", migrants: "diversity",
  inclusion: "diversity", equality: "diversity", pride: "diversity",
  respect: "diversity", unity: "diversity", cultural: "diversity",
  color: "diversity", diversity: "diversity",
};

// 🧩 Frases frecuentes (multiidioma)
const PHRASES = {
  "feliz cumpleaños": "birthday",
  "happy birthday": "birthday",
  "día de la madre": "mothersday",
  "dia de la madre": "mothersday",
  "día del padre": "fathersday",
  "día de san valentín": "valentine",
  "día del amor": "valentine",
  "feliz navidad": "christmas",
  "merry christmas": "christmas",
  "feliz año nuevo": "newyear",
  "día del trabajo": "laborday",
  "día de la independencia": "independenceday",
  "día de acción de gracias": "thanksgiving",
  "día de los muertos": "dayofthedead",
  "felices fiestas": "holiday",
  "feliz pascua": "easter",
  "unity and inclusion": "diversity",
  "celebrating diversity": "diversity",
  "black heritage": "diversity",
  "latino pride": "diversity",
  "african culture": "diversity",
  "love is love": "diversity",
  "cultural celebration": "diversity"
};

// 🧩 Normalizador universal
function normalizeText(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// 🚀 GET — Detecta, clasifica y enlaza categorías y subcategorías
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const logDir = path.join(process.cwd(), "public/logs");
  const logFile = path.join(logDir, "unrecognized.json");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  let unrecognized = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, "utf-8") || "[]")
    : [];

  const videos = files.flatMap((file) => {
    const cleanName = file.replace(".mp4", "");
    const normalized = normalizeText(cleanName);

    // 1️⃣ Frases completas
    let detected = [];
    for (const [phrase, mapped] of Object.entries(PHRASES)) {
      if (normalized.includes(normalizeText(phrase))) detected.push(mapped);
    }

    // 2️⃣ Palabras individuales + sinónimos
    const tokens = normalized.split(/\s+/).map((w) => SYNONYMS[w] || w);
    const text = tokens.concat(detected).join(" ");

    // 3️⃣ Coincidencias con categorías
    const matchedGroups = [];
    for (const [key, g] of Object.entries(MAIN_GROUPS)) {
      const match =
        g.keywords.some((kw) => text.includes(normalizeText(kw))) ||
        g.subcategories?.some((s) =>
          text.includes(normalizeText(s.toLowerCase()))
        );
      if (match) matchedGroups.push([key, g]);
    }

    // 4️⃣ Si no encontró nada, asignar “inspirational”
    if (matchedGroups.length === 0) {
      const unknownTokens = tokens.filter(
        (w) =>
          w.length > 3 &&
          !Object.values(SYNONYMS).includes(w) &&
          !Object.values(PHRASES).includes(w) &&
          !Object.values(MAIN_GROUPS).some((g) =>
            g.keywords.includes(w)
          )
      );
      if (unknownTokens.length > 0) {
        unrecognized.push({
          file: cleanName,
          tokens: unknownTokens,
          date: new Date().toISOString(),
        });
      }
      matchedGroups.push(["inspirational", MAIN_GROUPS.inspirational]);
    }

    // 5️⃣ Datos organizados
    const [object = "unknown", category = "general", subcategory = "general"] =
      cleanName.split("_");

    return matchedGroups.map(([key, g]) => ({
      mainName: g.name,
      mainEmoji: g.emoji,
      mainColor: g.color,
      mainSlug: key,
      object,
      category,
      subcategory,
      src: `/cards/${file}`,
    }));
  });

  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));
  return NextResponse.json({ videos });
  }
