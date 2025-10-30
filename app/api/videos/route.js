import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

// 🧩 Sinónimos globales (plurales, español/inglés)
const SYNONYMS = {
  zombies: "zombie", ghosts: "ghost", pumpkins: "pumpkin", dogs: "dog", puppies: "dog",
  cats: "cat", kittens: "cat", turkeys: "turkey", hearts: "heart", flowers: "flower",
  perros: "dog", gatos: "cat", tortugas: "turtle", conejos: "bunny", fantasmas: "ghost",
  monstruos: "monster", calabaza: "pumpkin", amor: "love", pareja: "couple",
  animales: "animal", naturaleza: "nature", navidad: "christmas", halloween: "halloween",
  cumple: "birthday", cumpleaños: "birthday", fiesta: "party", logro: "achievement",
  bendicion: "blessing", bendición: "blessing", milagro: "miracle", feliz: "happy",
  alegria: "joy", alegría: "joy", tristeza: "sadness", paz: "peace", esperanza: "hope",
  suerte: "luck", animo: "motivation", ánimo: "motivation", gracias: "thankyou",
  trabajo: "work", familia: "family", madre: "mother", padre: "father", bebe: "baby",
  bebé: "baby", doctor: "doctor", enfermera: "nurse", profesor: "teacher", maestro: "teacher",
  amigo: "friend", amiga: "friend", jefe: "boss", empleado: "employee",
  voluntario: "volunteer", artista: "artist", ingeniero: "engineer"
};

// 🧩 Frases compuestas (español / inglés)
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
  "feliz pascua": "easter"
};

// 🔤 Normalizador de texto
function normalizeText(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// 🚀 MAIN GET ROUTE
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

    // 1️⃣ Detectar frases conocidas
    let detected = [];
    for (const [phrase, mapped] of Object.entries(PHRASES)) {
      if (normalized.includes(normalizeText(phrase))) detected.push(mapped);
    }

    // 2️⃣ Tokenizar + aplicar sinónimos
    const tokens = normalized.split(/\s+/).map((w) => SYNONYMS[w] || w);
    const text = tokens.concat(detected).join(" ");

    // 3️⃣ Buscar coincidencias en categorías
    const matchedGroups = [];
    for (const [key, g] of Object.entries(MAIN_GROUPS)) {
      const match = g.keywords.some((kw) => text.includes(normalizeText(kw)));
      if (match) matchedGroups.push([key, g]);
    }

    // 4️⃣ Si no se encontró categoría → guardar en log
    if (matchedGroups.length === 0) {
      const unknownTokens = tokens.filter(
        (w) =>
          w.length > 3 &&
          !Object.values(SYNONYMS).includes(w) &&
          !Object.values(PHRASES).includes(w) &&
          !Object.values(MAIN_GROUPS).some((g) => g.keywords.includes(w))
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

    // 5️⃣ Construir respuesta
    const extra = matchedGroups.map(([key]) => key).slice(1);
    const [object = "unknown", category = "general", subcategory = "general"] =
      cleanName.split("_");

    return matchedGroups.map(([key, g]) => ({
      mainName: g.mainName,
      mainEmoji: g.mainEmoji,
      mainColor: g.mainColor,
      mainSlug: key,
      object,
      category,
      subcategory,
      extraCategories: extra,
      src: `/cards/${file}`,
    }));
  });

  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));

  // ✅ Devuelve JSON visible directamente en el navegador
  return NextResponse.json(
    { total: videos.length, videos },
    { status: 200 }
  );
}
