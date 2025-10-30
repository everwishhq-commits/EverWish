import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES CON COLORES, EMOJIS Y PALABRAS CLAVE
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🎄",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas","halloween","thanksgiving","easter","newyear",
      "independenceday","july4th","fourthofjuly","fireworks",
      "memorialday","veteransday","presidentsday","laborday",
      "mlkday","columbusday","flagday","patriotsday","cinco","cincodemayo",
      "oktoberfest","stpatrick","stpatricksday","earthday","kindnessday",
      "friendshipday","womensday","workersday","heritagemonth",
      "dayofthedead","holiday","holidayseason","diwali","hanukkah",
      "boxingday","carnival","thankful","turkeyday","pumpkin","santa",
      // 🆕 Añadidos para Halloween
      "zombie","ghost","spooky","witch","monster","boo","skeleton",
      "vampire","haunted","candy","costume","trick","treat"
    ],
  },
  love: {
    mainName: "Love",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine","romance","anniversary","wedding","engagement",
      "proposal","couple","relationship","heart","kiss","marriage","love",
      "partner","girlfriend","boyfriend","crush","affection","date","forever",
      "sweetheart"
    ],
  },
  celebrations: {
    mainName: "Celebrations",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday","graduation","babyshower","mothersday","fathersday",
      "retirement","party","event","achievement","success","promotion",
      "newjob","newhome","moving","bridalshower","babyarrival","genderreveal",
      "welcome","farewell","anniversaryparty"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets","pet","dog","cat","puppy","kitten","horse","bird",
      "wildlife","eagle","forest","nature","butterfly","fish","turtle","bunny",
      "elephant","lion","tiger","bear","rabbit","dolphin","animal","zoo","sea",
      "flower","tree","bee","sunflower"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFFBE5",
    keywords: [
      "spring","summer","autumn","fall","winter","season","rainy","rain","snow",
      "cold","heat","beach","sunny","sunset","leaves","flowers","vacation",
      "travel","mountain"
    ],
  },
  appreciation: {
    mainName: "Condolences & Support",
    mainEmoji: "🕊️",
    mainColor: "#FDE6E6",
    keywords: [
      "thankyou","appreciation","condolences","healing","getwell","support",
      "care","teacher","nurse","doctor","gratitude","friendship","help",
      "motivational","inspiration","encouragement","thank","hero","community",
      "worker","mentor","helper","volunteer","thanks"
    ],
  },
  inspirational: {
    mainName: "Inspirational & Friendship",
    mainEmoji: "🌟",
    mainColor: "#FFFBE5",
    keywords: [
      "inspire","motivation","dream","hope","believe","smile","kindness",
      "encourage","positive","friend","team","goal"
    ],
  },
  work: {
    mainName: "Work & Professional Life",
    mainEmoji: "💼",
    mainColor: "#EAF4FF",
    keywords: [
      "job","career","work","office","promotion","success","achievement",
      "coworker","boss","professional","meeting","goal"
    ],
  },
};

// 🔹 Normaliza texto
function normalize(str) {
  return str?.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and").replace(/[^a-z0-9-]/g, "").trim();
}

// 📦 API GET
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");
    const object = parts[0] || "unknown";

    // Analizar todas las palabras del nombre
    const words = parts.map((p) => normalize(p));
    const textToMatch = words.join(" ").toLowerCase();

    // Detectar todos los grupos principales que coinciden
    const matchedGroups = Object.entries(MAIN_GROUPS)
      .filter(([_, g]) => g.keywords.some((kw) => textToMatch.includes(kw)))
      .map(([key, group]) => ({
        key,
        ...group,
      }));

    // Si no hay coincidencias, usar “appreciation” como fallback
    const mainGroups = matchedGroups.length
      ? matchedGroups
      : [{ key: "appreciation", ...MAIN_GROUPS.appreciation }];

    // Determinar categoría y subcategoría según orden del nombre
    const category = words[1] || "general";
    const subcategory = words[2] || "general";

    // Crear una entrada por cada grupo principal detectado
    return mainGroups.map((group) => {
      const fullCategoryName = `${group.mainName} — ${
        subcategory !== "general" ? subcategory : category
      }`.replace(/-/g, " ");

      return {
        mainName: group.mainName,
        mainEmoji: group.mainEmoji,
        mainColor: group.mainColor,
        object,
        category,
        subcategory,
        combinedName: fullCategoryName,
        src: `/cards/${file}`,
        mainSlug: group.key,
      };
    });
  });

  // Aplanar arrays anidados (para casos de múltiples categorías)
  const flattenedVideos = videos.flat();

  return NextResponse.json({ videos: flattenedVideos });
    }
