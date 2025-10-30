import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES Y PALABRAS CLAVE
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🥳",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas", "halloween", "thanksgiving", "easter", "newyear",
      "independenceday", "july4th", "fireworks", "memorialday",
      "holiday", "pumpkin", "turkey", "santa", "zombie", "ghost", "boo"
    ],
  },
  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine", "romance", "anniversary", "wedding", "engagement",
      "couple", "heart", "love", "kiss", "hug", "forever"
    ],
  },
  celebrations: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday", "baby", "graduation", "party", "mothersday", "fathersday",
      "retirement", "promotion", "newjob", "newhome", "moving", "success",
      "achievement", "farewell", "genderreveal", "bridal", "event"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "dog", "cat", "puppy", "kitten", "horse", "bird", "nature",
      "forest", "bunny", "elephant", "lion", "tiger", "bear",
      "rabbit", "dolphin", "fish", "zoo", "flower", "tree", "bee"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFF4E0",
    keywords: [
      "spring", "summer", "autumn", "fall", "winter", "rain",
      "snow", "beach", "vacation", "sunset", "mountain", "season"
    ],
  },
  appreciation: {
    mainName: "Appreciation & Support",
    mainEmoji: "💌",
    mainColor: "#FDE6E6",
    keywords: [
      "thank", "appreciation", "condolence", "healing", "getwell",
      "support", "care", "teacher", "nurse", "doctor", "friendship",
      "hero", "community", "volunteer"
    ],
  },
};

// 🔹 Normaliza texto
function normalize(str = "") {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .trim();
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🚀 API
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/cards");
    if (!fs.existsSync(dir)) return NextResponse.json({ videos: [] });

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));

    const videos = files.map((file) => {
      const clean = file.replace(".mp4", "");
      const parts = clean.split("_");

      const object = normalize(parts[0] || "card");
      const category = normalize(parts[1] || "general");
      const sub = normalize(parts[2] || "general");

      // 🧠 Identificación flexible de categoría
      let mainSlug = Object.keys(MAIN_GROUPS).find((key) =>
        [object, category, sub].some((txt) => txt.includes(key))
      );

      if (!mainSlug) {
        // Buscar coincidencia por palabras clave
        const match = Object.entries(MAIN_GROUPS).find(([_, g]) =>
          g.keywords.some((kw) => clean.includes(kw))
        );
        mainSlug = match ? match[0] : "appreciation";
      }

      const group = MAIN_GROUPS[mainSlug];

      // 🧩 Subcategoría más inteligente
      const subcategoryCandidates = clean.split("_");
      let subcategory =
        subcategoryCandidates.find(
          (p) =>
            p.length > 2 &&
            !["card", "general", "video", "everwish"].includes(p)
        ) || "general";

      subcategory = subcategory.replace(/[0-9]+[a-z]?/g, "");

      return {
        slug: normalize(clean),
        mainSlug,
        mainName: group.mainName,
        mainEmoji: group.mainEmoji,
        mainColor: group.mainColor,
        object: capitalize(object),
        category,
        subcategory,
        src: `/cards/${file}`,
      };
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("❌ Error leyendo videos:", error);
    return NextResponse.json({ videos: [] });
  }
                             }
