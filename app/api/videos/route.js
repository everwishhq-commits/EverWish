import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS PRINCIPALES — sincronizadas con /lib/categories.js
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🥳",
    mainColor: "#FFF4E0",
    keywords: [
      "holiday", "holidays", "christmas", "xmas", "santa",
      "halloween", "spooky", "pumpkin", "ghost", "zombie", "boo",
      "thanksgiving", "turkeyday", "autumn", "fall", "easter", "bunny", "egg", "spring",
      "independenceday", "july4th", "4thofjuly", "fireworks", "newyear",
      "celebration", "party", "carnival", "diwali", "hanukkah",
      "stpatricksday", "oktoberfest", "veteransday", "memorialday", "laborday",
      "mlkday", "columbusday", "presidentsday", "dayofthedead", "cincodemayo"
    ],
  },
  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine", "romance", "anniversary", "wedding", "engagement",
      "proposal", "couple", "relationship", "sweetheart", "heart",
      "kiss", "forever", "date", "affection", "together", "love"
    ],
  },
  celebrations: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFE7FF",
    keywords: [
      "birthday", "graduation", "mothersday", "fathersday",
      "babyshower", "newbaby", "retirement", "congratulations",
      "genderreveal", "newhome", "newjob", "promotion", "success", "party"
    ],
  },
  work: {
    mainName: "Work & Professional Life",
    mainEmoji: "💼",
    mainColor: "#EAF4FF",
    keywords: [
      "work", "career", "job", "employee", "promotion", "bossday",
      "achievement", "teamwork", "goal", "dedication", "mentor", "leader",
      "teacher", "doctor", "nurse", "engineer", "artist", "coach",
      "athlete", "volunteer", "entrepreneur", "retirement", "colleague", "motivation"
    ],
  },
  condolences: {
    mainName: "Condolences & Support",
    mainEmoji: "🕊️",
    mainColor: "#F8F8F8",
    keywords: [
      "condolence", "sympathy", "getwell", "healing", "encouragement",
      "appreciation", "thankyou", "remembrance", "gratitude", "support",
      "recovery", "loss", "memory", "hope", "care", "empathy", "thanks"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets", "pet", "wildlife", "oceanlife", "forest", "farm",
      "bird", "birds", "turtle", "turtles", "elephant", "elephants",
      "butterfly", "butterflies", "dolphin", "dolphins", "cat", "cats",
      "dog", "dogs", "nature", "green", "planet", "eco", "flora", "fauna", "garden", "yeti", "animal", "animals", "zoo"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#E5EDFF",
    keywords: [
      "spring", "summer", "autumn", "fall", "winter", "rainy", "sunny",
      "snow", "beach", "mountain", "forest", "sunset", "travel", "vacation",
      "breeze", "bloom", "cold", "warm"
    ],
  },
  inspirational: {
    mainName: "Inspirational & Friendship",
    mainEmoji: "🌟",
    mainColor: "#FFFBE5",
    keywords: [
      "inspiration", "motivation", "hope", "faith", "dream", "success",
      "happiness", "peace", "friendship", "teamwork", "goal", "believe",
      "gratitude", "mindfulness", "positivity", "kindness", "community", "respect"
    ],
  },
};

// 🧩 Normaliza texto (quita caracteres y unifica)
function normalize(str) {
  return str?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "")
    .trim();
}

// 📘 Función para comparar con variantes (plural/singular)
function keywordMatch(name, keyword) {
  const pattern = new RegExp(`\\b${keyword}s?\\b`, "i");
  return pattern.test(name);
}

// 🚀 Endpoint principal
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = files.flatMap((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");
    const object = parts[0] || "unknown";
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");

    // 📍 Detecta todas las categorías posibles (con plurales y sinónimos)
    const matchedGroups = Object.entries(MAIN_GROUPS).filter(([_, g]) =>
      g.keywords.some((kw) => keywordMatch(cleanName, kw))
    );

    // 🪶 Si no encontró ninguna coincidencia, asigna “inspirational”
    if (matchedGroups.length === 0)
      matchedGroups.push(["inspirational", MAIN_GROUPS.inspirational]);

    // 📦 Devuelve una copia por coincidencia
    return matchedGroups.map(([key, g]) => ({
      mainName: g.mainName,
      mainEmoji: g.mainEmoji,
      mainColor: g.mainColor,
      mainSlug: key,
      object,
      category,
      subcategory,
      src: `/cards/${file}`,
    }));
  });

  // 🧹 Limpia duplicados exactos
  const uniqueVideos = Array.from(
    new Map(videos.map((v) => [v.src + v.mainSlug, v])).values()
  );

  return NextResponse.json({ videos: uniqueVideos });
    }
