import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

const SYNONYMS = {
  zombies: "zombie", ghosts: "ghost", pumpkins: "pumpkin",
  dogs: "dog", puppies: "dog", cats: "cat", kittens: "cat",
  turkeys: "turkey", hearts: "heart", flowers: "flower",
  tortugas: "turtle", gatos: "cat", calabazas: "pumpkin",
  cumpleaños: "birthday", amor: "love", pareja: "couple",
  boda: "wedding", aniversario: "anniversary", fiesta: "party",
  diversidad: "diversity", orgullo: "diversity", gay: "diversity",
};

const PHRASES = {
  "feliz cumpleaños": "birthday", "happy birthday": "birthday",
  "feliz navidad": "christmas", "día del amor": "valentine’s day",
  "día del padre": "father’s day", "día de la madre": "mother’s day",
  "día de los muertos": "day of the dead", "día de independencia": "independence day",
};

function normalize(str = "") {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const logDir = path.join(process.cwd(), "public/logs");
  const logFile = path.join(logDir, "video_read_log.json");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  const videos = [];

  for (const file of files) {
    const clean = file.replace(".mp4", "");
    const parts = clean.split("_");
    const normalized = normalize(clean);

    let [object, categorySlug, subcategory] = ["unknown", "general", "general"];
    let mainSlug = "inspirational";

    if (parts.length >= 3) {
      [object, categorySlug, subcategory] = parts;
    } else {
      const tokens = normalized.split(/\s+/).map((t) => SYNONYMS[t] || t);
      const text = tokens.join(" ");
      const matched = Object.entries(MAIN_GROUPS).find(([k, g]) =>
        g.keywords.some((kw) => text.includes(normalize(kw)))
      );
      if (matched) {
        mainSlug = matched[0];
        categorySlug = matched[0];
        const foundSub = matched[1].subcategories.find((s) =>
          text.includes(normalize(s))
        );
        subcategory = foundSub || "general";
      }
    }

    // Validar subcategoría
    const validSubs = Object.values(MAIN_GROUPS).flatMap((g) => g.subcategories);
    if (!validSubs.includes(subcategory)) subcategory = "general";

    const group = MAIN_GROUPS[mainSlug] || MAIN_GROUPS.inspirational;

    videos.push({
      slug: clean,
      src: `/cards/${file}`,
      object,
      mainSlug,
      categorySlug,
      subcategory,
      mainName: group.mainName,
      mainEmoji: group.mainEmoji,
      mainColor: group.mainColor,
    });
  }

  // 🔍 Guardar lectura previa para comparar
  fs.writeFileSync(
    logFile,
    JSON.stringify(
      videos.map((v) => ({
        file: v.slug,
        mainSlug: v.mainSlug,
        categorySlug: v.categorySlug,
        subcategory: v.subcategory,
      })),
      null,
      2
    )
  );

  console.log("🧩 API /videos loaded", videos.length, "videos");
  return NextResponse.json({ videos });
          }
