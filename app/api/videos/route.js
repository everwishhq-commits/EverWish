import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MAIN_GROUPS = {
  holidays: {
    mainName: "Holidays",
    mainEmoji: "🥳",
    mainColor: "#FFF4E0",
    keywords: [
      "christmas","halloween","thanksgiving","easter","newyear",
      "independenceday","july4th","fourthofjuly","fireworks",
      "memorialday","veteransday","presidentsday","laborday",
      "mlkday","columbusday","flagday","patriotsday",
      "cinco","cincodemayo","oktoberfest","stpatrick","stpatricksday",
      "earthday","kindnessday","friendshipday","womensday","workersday",
      "heritagemonth","dayofthedead","holiday","holidayseason",
      "diwali","hanukkah","boxingday","carnival","thankful",
      "turkeyday","pumpkin","santa"
    ],
  },
  love: {
    mainName: "Love",
    mainEmoji: "❤️",
    mainColor: "#FFE8EE",
    keywords: [
      "valentine","romance","anniversary","wedding","engagement",
      "proposal","couple","relationship","heart","kiss",
      "marriage","love","partner","girlfriend","boyfriend",
      "crush","affection","date","forever","sweetheart"
    ],
  },
  celebrations: {
    mainName: "Celebrations",
    mainEmoji: "🎉",
    mainColor: "#FFF7FF",
    keywords: [
      "birthday","graduation","babyshower","mothersday","fathersday",
      "retirement","party","achievement","success",
      "promotion","newjob","newhome","moving","bridalshower",
      "babyarrival","genderreveal","welcome","farewell","anniversaryparty"
    ],
  },
  animals: {
    mainName: "Animals & Nature",
    mainEmoji: "🐾",
    mainColor: "#E8FFF3",
    keywords: [
      "pets","dog","cat","puppy","kitten","horse","bird","wildlife",
      "forest","nature","butterfly","fish","turtle","bunny","elephant",
      "lion","tiger","bear","rabbit","dolphin","zoo","flower","tree","bee","sunflower"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFF4E0",
    keywords: [
      "spring","summer","autumn","fall","winter","season",
      "rainy","rain","snow","cold","heat","beach","sunny",
      "sunset","leaves","flowers","vacation","travel","mountain"
    ],
  },
  appreciation: {
    mainName: "Appreciation & Support",
    mainEmoji: "💌",
    mainColor: "#FDE6E6",
    keywords: [
      "thankyou","appreciation","condolences","healing","getwell",
      "support","care","teacher","nurse","doctor","gratitude",
      "friendship","help","motivational","inspiration",
      "encouragement","thank","hero","community","worker",
      "mentor","volunteer","thanks"
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

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/cards");
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ videos: [] });
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));

    const videos = files.map((file) => {
      const clean = file.replace(".mp4", "");
      const parts = clean.split("_");

      const object = normalize(parts[0] || "card");
      const main = normalize(parts[1] || "general");
      const category = normalize(parts[2] || "general");
      const sub = normalize(parts[3] || "general");

      // 🔍 Detecta el grupo principal automáticamente
      const match = Object.entries(MAIN_GROUPS).find(([_, g]) =>
        g.keywords.some((kw) => clean.includes(kw))
      );

      const [mainSlug, group] = match || ["appreciation", MAIN_GROUPS.appreciation];

      return {
        slug: normalize(clean),
        mainSlug,
        mainName: group.mainName,
        mainEmoji: group.mainEmoji,
        mainColor: group.mainColor,
        object: object.charAt(0).toUpperCase() + object.slice(1),
        category,
        subcategory: sub.replace(/[0-9]+a?/g, ""),
        src: `/cards/${file}`,
      };
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("❌ Error reading videos:", error);
    return NextResponse.json({ videos: [] });
  }
                              }
