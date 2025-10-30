import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🌎 CATEGORÍAS Y SUBCATEGORÍAS COMBINADAS AUTOMÁTICAMENTE
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
      "boxingday","carnival","thankful","turkeyday","pumpkin","santa"
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
      "pets","petsandanimal","dog","cat","puppy","kitten","horse","bird",
      "wildlife","eagle","forest","nature","butterfly","fish","turtle","bunny",
      "elephant","lion","tiger","bear","rabbit","dolphin","animal","zoo","sea",
      "flower","tree","bee","sunflower"
    ],
  },
  seasons: {
    mainName: "Seasons",
    mainEmoji: "🍂",
    mainColor: "#FFF4E0",
    keywords: [
      "spring","summer","autumn","fall","winter","season","rainy","rain","snow",
      "cold","heat","beach","sunny","sunset","leaves","flowers","vacation",
      "travel","mountain"
    ],
  },
  appreciation: {
    mainName: "Appreciation & Support",
    mainEmoji: "💌",
    mainColor: "#FDE6E6",
    keywords: [
      "thankyou","appreciation","condolences","healing","getwell","support",
      "care","teacher","nurse","doctor","gratitude","friendship","help",
      "motivational","inspiration","encouragement","thank","hero","community",
      "worker","mentor","helper","volunteer","thanks"
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
    const cleanName = file.replace(".mp4", "").toLowerCase();
    const parts = cleanName.split("_");
    const object = parts[0] || "unknown";
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");
    const variant = parts[3] || ""; // ejemplo: 1a o 1b

    // 🧩 Busca si existe su par (1A ↔ 1B)
    const pairVariant =
      variant.toLowerCase().includes("1a") ? variant.replace("1a", "1b") :
      variant.toLowerCase().includes("1b") ? variant.replace("1b", "1a") : null;

    const pairFile = pairVariant
      ? files.find((f) =>
          f.toLowerCase().includes(`${object}_${category}_${subcategory}_${pairVariant}`.toLowerCase())
        )
      : null;

    // 🧠 Buscar TODAS las categorías coincidentes
    const allMatches = Object.entries(MAIN_GROUPS)
      .filter(([_, g]) =>
        g.keywords.some((kw) => cleanName.includes(kw.toLowerCase()))
      )
      .map(([key, g]) => ({
        mainSlug: key,
        mainName: g.mainName,
        mainEmoji: g.mainEmoji,
        mainColor: g.mainColor,
      }));

    const matches = allMatches.length
      ? allMatches
      : [
          {
            mainSlug: "appreciation",
            mainName: MAIN_GROUPS.appreciation.mainName,
            mainEmoji: MAIN_GROUPS.appreciation.mainEmoji,
            mainColor: MAIN_GROUPS.appreciation.mainColor,
          },
        ];

    // 🔸 Nombre combinado
    const combinedName = matches
      .map(
        (m) =>
          `${m.mainName} — ${
            subcategory !== "general" ? subcategory : category
          }`.replace(/-/g, " ")
      )
      .join(", ");

    return {
      object,
      category,
      subcategory,
      variant,
      pair: pairFile ? `/cards/${pairFile}` : null,
      combinedName,
      src: `/cards/${file}`,
      matches,
    };
  });

  return NextResponse.json({ videos });
    }
