import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌸 CATEGORÍAS FINALES EVERWISH (8 principales con subcategorías completas)
const MAIN_GROUPS = {
  love: {
    mainName: "Love & Romance",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "love", "romance", "anniversary", "valentine", "proposal", "wedding", "engagement",
      "couple", "relationship", "sweetheart", "date-night", "forever-love",
      "heart", "kiss", "passion", "together", "affection"
    ],
  },

  celebration: {
    mainName: "Celebrations & Special Moments",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday", "babyshower", "genderreveal", "graduation", "newhome",
      "newjob", "promotion", "retirement", "success", "mothersday",
      "fathersday", "teachersday", "friendshipday", "familyday",
      "anniversaryparty", "congratulations", "achievement", "milestone", "joy"
    ],
  },

  work: {
    mainName: "Work & Professional Life",
    mainEmoji: "💼",
    mainColor: "#EAF4FF",
    keywords: [
      "work", "career", "job", "employee", "promotion", "bossday", "achievement",
      "teamwork", "goal", "success", "dedication", "mentor", "leader",
      "teacher", "doctor", "nurse", "engineer", "artist", "coach", "athlete",
      "volunteer", "entrepreneur", "retirement", "colleague", "respect",
      "motivation", "skill", "effort"
    ],
  },

  condolences: {
    mainName: "Condolences & Support",
    mainEmoji: "🕊️",
    mainColor: "#F8F8F8",
    keywords: [
      "condolence", "sympathy", "getwellsoon", "healing", "encouragement",
      "appreciation", "thankyou", "remembrance", "gratitude", "support",
      "recovery", "loss", "memory", "hope", "care", "empathy", "thanks"
    ],
  },

  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets", "wildlife", "oceanlife", "forest", "farm", "bird", "turtle",
      "elephant", "butterfly", "dolphin", "cat", "dog", "naturelove",
      "green", "planet", "eco", "flora", "fauna", "garden"
    ],
  },

  holidays: {
    mainName: "Holidays",
    mainEmoji: "🎄",
    mainColor: "#FFF4E0",
    keywords: [
      "holiday", "christmas", "halloween", "thanksgiving", "easter",
      "newyear", "independenceday", "july4th", "fireworks", "pumpkin",
      "turkey", "santa", "snowman", "memorialday", "veteransday",
      "laborday", "columbusday", "presidentsday", "mlkday", "stpatricksday",
      "oktoberfest", "pridemonth", "earthday", "womensday", "workersday",
      "friendshipday", "mothersday", "fathersday", "teachersday",
      "heritagemonth", "dayofthedead", "carnival", "kindnessday"
    ],
  },

  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFFBE5",
    keywords: [
      "season", "spring", "summer", "autumn", "fall", "winter", "rainy",
      "sunny", "snow", "beach", "mountain", "forest", "sunset",
      "travel", "vacation", "breeze", "bloom", "cold", "warm"
    ],
  },

  inspirational: {
    mainName: "Inspirational & Friendship",
    mainEmoji: "🌟",
    mainColor: "#FFFBE5",
    keywords: [
      "inspiration", "motivation", "hope", "faith", "dream", "success",
      "happiness", "peace", "friendship", "teamwork", "goal",
      "encouragement", "believe", "gratitude", "mindfulness",
      "positivity", "kindness", "community", "respect"
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
  const dir = path.join(process.cwd(), "public/videos");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");

    const object = parts[0] || "unknown";
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");

    const match = Object.entries(MAIN_GROUPS).find(([key, group]) =>
      group.keywords.some((kw) => cleanName.includes(kw))
    );

    const [selectedKey, selectedGroup] = match || ["inspirational", MAIN_GROUPS.inspirational];

    const fullCategoryName = `${selectedGroup.mainName} — ${
      subcategory !== "general" ? subcategory : category
    }`.replace(/-/g, " ");

    return {
      mainName: selectedGroup.mainName,
      mainEmoji: selectedGroup.mainEmoji,
      mainColor: selectedGroup.mainColor,
      object,
      category,
      subcategory,
      combinedName: fullCategoryName,
      src: `/videos/${file}`,
      mainSlug: selectedKey,
    };
  });

  return NextResponse.json({ videos });
    }
