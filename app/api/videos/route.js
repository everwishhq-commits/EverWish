import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES — sincronizadas con Everwish
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "😊",
    mainColor: "#FFF4E0",
    keywords: [
      "holiday","holidays","christmas","xmas","santa","halloween","spooky","pumpkin",
      "ghost","zombie","boo","monster","trick","treat","thanksgiving","turkey",
      "autumn","fall","easter","bunny","egg","spring","newyear","fireworks","celebration",
      "party","independenceday","july4th","4thofjuly","carnival","hanukkah","diwali",
      "stpatricksday","oktoberfest","veteransday","memorialday","laborday","mlkday",
      "dayofthedead","cincodemayo"
    ],
  },
  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "love","valentine","romance","anniversary","wedding","engagement","proposal","couple",
      "sweetheart","kiss","heart","affection","date","together","forever","amor","pareja",
      "corazon","beso","sentimiento","cariño"
    ],
  },
  celebrations: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday","cumple","cumpleaños","feliz","happy","graduation","achievement",
      "mothersday","fathersday","babyshower","newbaby","retirement","congratulations",
      "genderreveal","newhome","promotion","success","party","celebracion","logro","fiesta"
    ],
  },
  work: {
    mainName: "Work & Professional Life",
    mainEmoji: "💼",
    mainColor: "#EAF4FF",
    keywords: [
      "work","career","job","employee","promotion","bossday","achievement","teamwork",
      "mentor","leader","teacher","doctor","nurse","engineer","artist","coach","volunteer",
      "entrepreneur","colleague","business","office","worker","team"
    ],
  },
  condolences: {
    mainName: "Condolences & Support",
    mainEmoji: "🕊️",
    mainColor: "#F8F8F8",
    keywords: [
      "condolence","sympathy","getwell","healing","encouragement","appreciation",
      "thankyou","remembrance","gratitude","support","recovery","loss","memory","hope",
      "care","empathy","thanks","peace","comfort","strength","repose","duelo","tristeza"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "animal","animals","pet","pets","dog","dogs","puppy","puppies","cat","cats","kitten",
      "kittens","bird","birds","parrot","parrots","turtle","turtles","elephant","elephants",
      "dolphin","dolphins","butterfly","butterflies","nature","forest","jungle","wildlife",
      "zoo","eco","planet","garden","flower","flowers","flor","perro","perros","gato","gatos",
      "conejo","conejo","pajaro","pájaros","tortuga","elefante"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#E5EDFF",
    keywords: [
      "spring","summer","autumn","fall","winter","rain","snow","beach","sunny","cold",
      "warm","vacation","holiday","travel","sunset","breeze","season","estacion","invierno",
      "verano","otoño","primavera","clima"
    ],
  },
  inspirational: {
    mainName: "Inspirational & Friendship",
    mainEmoji: "🌟",
    mainColor: "#FFFBE5",
    keywords: [
      "inspiration","motivational","hope","faith","dream","success","happiness","joy",
      "peace","friendship","teamwork","goal","believe","gratitude","mindfulness","positivity",
      "kindness","community","respect","spiritual","blessing","miracle","milagro","bendicion",
      "motivacion","alegria","felicidad","paz","esperanza","animo","suerte"
    ],
  },
};

// 🧩 Sinónimos universales (inglés/español, plurales, emociones)
const SYNONYMS = {
  // plural ↔ singular
  zombies: "zombie", ghosts: "ghost", pumpkins: "pumpkin", dogs: "dog", puppies: "dog",
  cats: "cat", kittens: "cat", turkeys: "turkey", fireworks: "firework", hearts: "heart",
  flowers: "flower", monsters: "monster", leaves: "leaf", butterflies: "butterfly",

  // español → inglés equivalentes
  perros: "dog", gato: "cat", gatos: "cat", tortugas: "turtle", conejos: "bunny",
  fantasmas: "ghost", monstruos: "monster", calabaza: "pumpkin", amor: "love",
  pareja: "couple", animales: "animal", naturaleza: "nature", navidad: "christmas",
  halloween: "halloween", cumple: "birthday", cumpleaños: "birthday", fiesta: "party",
  logro: "achievement", bendicion: "blessing", bendición: "blessing", milagro: "miracle",
  feliz: "happy", alegria: "joy", alegría: "joy", tristeza: "sadness", paz: "peace",
  esperanza: "hope", suerte: "luck", animo: "motivation", ánimo: "motivation",
  gracias: "thankyou", trabajo: "work", familia: "family", madre: "mother", padre: "father",
  bebe: "baby", bebé: "baby", doctor: "doctor", enfermera: "nurse", profesor: "teacher",
  maestro: "teacher", alumno: "student", amigo: "friend", amiga: "friend",
  amigos: "friend", amigas: "friend", jefe: "boss", jefea: "boss", jefeas: "boss",
  empleado: "employee", empleados: "employee", voluntario: "volunteer", artista: "artist",
  ingeniero: "engineer", motivacion: "motivation", motivación: "motivation",
  felicidad: "happiness", bendecido: "blessed", bendecida: "blessed",
};

// 🧩 Normalizador de texto
function normalizeText(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// 🚀 GET route
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = files.flatMap((file) => {
    const cleanName = file.replace(".mp4", "");
    const normalized = normalizeText(cleanName);

    // Sustituye sinónimos
    const tokens = normalized.split(/\s+/).map((w) => SYNONYMS[w] || w);
    const text = tokens.join(" ");

    const matchedGroups = [];
    for (const [key, g] of Object.entries(MAIN_GROUPS)) {
      const match = g.keywords.some((kw) => text.includes(normalizeText(kw)));
      if (match) matchedGroups.push([key, g]);
    }

    if (matchedGroups.length === 0)
      matchedGroups.push(["inspirational", MAIN_GROUPS.inspirational]);

    const extraCategories = matchedGroups.map(([key]) => key).slice(1);
    const parts = cleanName.split("_");
    const object = parts[0] || "unknown";
    const category = parts[1] || "general";
    const subcategory = parts[2] || "general";

    return matchedGroups.map(([key, g]) => ({
      mainName: g.mainName,
      mainEmoji: g.mainEmoji,
      mainColor: g.mainColor,
      mainSlug: key,
      object,
      category,
      subcategory,
      extraCategories,
      src: `/cards/${file}`,
    }));
  });

  return NextResponse.json({ videos });
}
