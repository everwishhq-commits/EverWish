import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES Y PALABRAS CLAVE
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🎄",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas","halloween","thanksgiving","easter","newyear",
      "independence","july4","fireworks","memorial","veterans",
      "labor","columbus","presidents","mlk","stpatrick",
      "oktoberfest","pride","earth","womens","workers",
      "friendship","mothers","fathers","teachers","heritage",
      "dayofthedead","carnival","kindness","holiday","pumpkin","santa"
    ],
  },

  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine","romance","anniversary","wedding","engagement",
      "proposal","couple","relationship","sweetheart","heart",
      "kiss","forever","date","affection","together","partner","crush","love"
    ],
  },

  celebrations: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday","graduation","babyshower","genderreveal","newhome",
      "newjob","promotion","retirement","success","party",
      "congratulations","achievement","milestone","event","joy","welcome"
    ],
  },

  work: {
    mainName: "Work & Professional Life",
    mainEmoji: "💼",
    mainColor: "#EAF4FF",
    keywords: [
      "career","job","employee","boss","achievement","teamwork","goal",
      "mentor","teacher","doctor","nurse","engineer","artist","coach",
      "athlete","volunteer","entrepreneur","colleague","motivation","skill",
    ],
  },

  condolences: {
    mainName: "Condolences & Support",
    mainEmoji: "🕊️",
    mainColor: "#F8F8F8",
    keywords: [
      "condolence","sympathy","getwell","healing","encouragement",
      "appreciation","thankyou","remembrance","gratitude","support",
      "recovery","loss","memory","hope","care","empathy","thanks",
    ],
  },

  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets","wildlife","ocean","forest","farm","bird","turtle",
      "elephant","butterfly","dolphin","cat","dog","nature","flora","fauna",
    ],
  },

  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFFBE5",
    keywords: [
      "spring","summer","autumn","fall","winter","rainy","sunny",
      "snow","beach","mountain","forest","sunset","travel","vacation","breeze",
    ],
  },

  inspirational: {
    mainName: "Inspirational & Friendship",
    mainEmoji: "🌟",
    mainColor: "#FFFBE5",
    keywords: [
      "inspiration","motivation","hope","faith","dream","success","happiness",
      "peace","friendship","teamwork","goal","believe","gratitude","positivity",
    ],
  },
};

// 🧹 Normaliza texto
function normalize(str) {
  return str
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "")
    .trim();
}

// 🚀 Endpoint principal
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");

  if (!fs.existsSync(dir)) {
    console.warn("⚠️ No se encontró carpeta /public/cards");
    return NextResponse.json({ videos: [] });
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));

  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");

    const object = normalize(parts[0] || "unknown");
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");

    // 🔍 Encuentra grupo principal según coincidencia parcial
    const match = Object.entries(MAIN_GROUPS).find(([key, group]) =>
      group.keywords.some((kw) => cleanName.includes(kw))
    );

    const [selectedKey, selectedGroup] =
      match || ["celebrations", MAIN_GROUPS.celebrations];

    const slug = normalize(cleanName);
    const fullCategoryName = `${selectedGroup.mainName} — ${
      subcategory !== "general" ? subcategory : category
    }`.replace(/-/g, " ");

    return {
      slug,
      src: `/cards/${file}`,
      object,
      category,
      subcategory,
      combinedName: fullCategoryName,
      mainSlug: selectedKey,
      mainName: selectedGroup.mainName,
      mainEmoji: selectedGroup.mainEmoji,
      mainColor: selectedGroup.mainColor,
    };
  });

  // ✅ El endpoint devuelve la lista en formato estándar
  return NextResponse.json({ videos });
}
