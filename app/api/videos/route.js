import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES Y SUS PALABRAS CLAVE
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🥳",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas", "halloween", "thanksgiving", "easter", "newyear",
      "independenceday", "july4th", "fourthofjuly", "fireworks",
      "memorialday", "veteransday", "presidentsday", "laborday",
      "mlkday", "columbusday", "flagday", "patriotsday",
      "cinco", "cincodemayo", "oktoberfest", "stpatrick", "stpatricksday",
      "earthday", "kindnessday", "friendshipday", "womensday", "workersday",
      "heritagemonth", "dayofthedead", "holiday", "holidayseason",
      "diwali", "hanukkah", "boxingday", "carnival", "thankful",
      "turkeyday", "pumpkin", "santa"
    ],
  },
  love: {
    mainName: "Love",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine", "romance", "anniversary", "wedding", "engagement",
      "proposal", "couple", "relationship", "heart", "kiss",
      "marriage", "love", "partner", "girlfriend", "boyfriend",
      "crush", "affection", "date", "forever", "sweetheart"
    ],
  },
  celebrations: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday", "graduation", "babyshower", "mothersday", "fathersday",
      "retirement", "party", "event", "achievement", "success",
      "promotion", "newjob", "newhome", "moving", "bridalshower",
      "babyarrival", "genderreveal", "welcome", "farewell", "anniversaryparty"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets", "dog", "cat", "puppy", "kitten", "horse", "bird",
      "wildlife", "eagle", "forest", "nature", "butterfly", "fish",
      "turtle", "bunny", "elephant", "lion", "tiger", "bear", "rabbit",
      "dolphin", "animal", "zoo", "sea", "flower", "tree", "bee", "sunflower"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFF4E0",
    keywords: [
      "spring", "summer", "autumn", "fall", "winter", "season", "rain",
      "snow", "cold", "heat", "beach", "sunny", "sunset", "vacation"
    ],
  },
  appreciation: {
    mainName: "Appreciation & Support",
    mainEmoji: "💌",
    mainColor: "#FDE6E6",
    keywords: [
      "thankyou", "appreciation", "condolences", "healing", "getwell",
      "support", "care", "teacher", "nurse", "doctor", "gratitude",
      "friendship", "help", "motivational", "inspiration",
      "encouragement", "hero", "community", "volunteer", "thanks"
    ],
  },
};

// 🔹 Normaliza texto
function normalize(str) {
  return str
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "")
    .trim();
}

export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");

    // Estructura: object_category_subcategory_value
    const object = parts[0] || "unknown";
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");
    const design = parts[3] || "1A"; // 🎨 ahora lee 1A, 2A, etc.

    // 🔍 Busca grupo principal por keywords
    const match = Object.entries(MAIN_GROUPS).find(([key, group]) =>
      group.keywords.some((kw) => cleanName.includes(kw))
    );
    const [selectedKey, selectedGroup] =
      match || ["appreciation", MAIN_GROUPS.appreciation];

    // 🧠 Nombre combinado legible
    const fullCategoryName = `${selectedGroup.mainName} — ${subcategory !== "general" ? subcategory : category}`.replace(/-/g, " ");

    return {
      mainName: selectedGroup.mainName,
      mainEmoji: selectedGroup.mainEmoji,
      mainColor: selectedGroup.mainColor,
      object,
      category,
      subcategory,
      design, // 🎨 versión o variación del mismo tipo
      combinedName: fullCategoryName,
      src: `/cards/${file}`,
      mainSlug: selectedKey,
    };
  });

  // ✅ Compatible con tu carrusel
  return NextResponse.json({ videos });
      }
