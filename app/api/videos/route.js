import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// 📂 Ruta de tus videos en /public/videos
const VIDEOS_DIR = path.join(process.cwd(), "public/videos");

// 🧩 Palabras clave y agrupación automática por categorías
const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🎄",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas", "halloween", "thanksgiving", "easter", "newyear",
      "valentine", "independence", "july4", "memorial", "veterans",
      "labor", "mlk", "carnival", "diwali", "hanukkah", "turkey", "pumpkin"
    ],
  },
  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "love", "romance", "anniversary", "wedding", "engagement",
      "couple", "relationship", "heart", "kiss"
    ],
  },
  celebrations: {
    mainName: "Celebrations",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday", "graduation", "baby", "congratulations", "party",
      "success", "promotion", "retirement"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "animal", "dog", "cat", "turtle", "bird", "elephant", "nature",
      "yeti", "bunny", "forest", "wildlife"
    ],
  },
  seasons: {
    mainName: "Seasons & Adventure",
    mainEmoji: "🍂",
    mainColor: "#EAF4FF",
    keywords: [
      "spring", "summer", "autumn", "fall", "winter", "season",
      "travel", "adventure", "vacation", "sun", "snow"
    ],
  },
  appreciation: {
    mainName: "Appreciation & Support",
    mainEmoji: "💌",
    mainColor: "#FDE6E6",
    keywords: [
      "thank", "appreciation", "support", "condolence", "getwell",
      "motivation", "encouragement", "healing"
    ],
  },
};

// 🔠 Normalizador
function normalize(str = "") {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 🧩 Lógica de clasificación de videos
function classifyVideo(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const lowerName = normalize(nameWithoutExt);

  // Encuentra grupo por palabra clave
  const match = Object.entries(MAIN_GROUPS).find(([_, g]) =>
    g.keywords.some((kw) => lowerName.includes(kw))
  );

  const [key, group] = match || ["appreciation", MAIN_GROUPS.appreciation];

  return {
    slug: nameWithoutExt,
    src: `/videos/${filename}`,
    mainSlug: key,
    mainName: group.mainName,
    mainEmoji: group.mainEmoji,
    mainColor: group.mainColor,
  };
}

// 🧠 API principal
export async function GET() {
  try {
    if (!fs.existsSync(VIDEOS_DIR)) {
      return NextResponse.json({ videos: [], message: "No videos folder found" });
    }

    const files = fs
      .readdirSync(VIDEOS_DIR)
      .filter((f) => f.toLowerCase().endsWith(".mp4"));

    const videos = files.map((file) => classifyVideo(file));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("❌ Error loading videos:", err);
    return NextResponse.json(
      { error: "Error loading videos", details: err.message },
      { status: 500 }
    );
  }
}
