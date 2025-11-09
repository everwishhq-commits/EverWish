import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Mapeo de palabras a categorías
const CAT = {
  halloween: "Seasonal & Global Celebrations",
  christmas: "Seasonal & Global Celebrations",
  thanksgiving: "Seasonal & Global Celebrations",
  easter: "Seasonal & Global Celebrations",
  independenceday: "Seasonal & Global Celebrations",
  holidays: "Seasonal & Global Celebrations",
  love: "Love, Weddings & Anniversaries",
  hugs: "Love, Weddings & Anniversaries",
  birthday: "Birthdays & Celebrations",
  celebrations: "Birthdays & Celebrations",
  celebration: "Birthdays & Celebrations",
  mother: "Family & Friendship",
  mothers: "Family & Friendship",
  baby: "Babies & Parenting",
  pets: "Pets & Animal Lovers",
  animals: "Pets & Animal Lovers",
  animalsandnature: "Pets & Animal Lovers",
  dogcat: "Pets & Animal Lovers",
  turtle: "Pets & Animal Lovers",
};

// Mapeo de palabras a subcategorías
const SUB = {
  // Seasonal
  halloween: "Halloween",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  easter: "Easter",
  independenceday: "Independence Day",
  july4: "Independence Day",
  newyear: "New Year",

  // Love & Romance
  valentine: "Valentine's Day",
  love: "Love",
  hugs: "Hugs",

  // Celebrations
  birthday: "Birthday",
  celebration: "Celebrations",
  celebrations: "Celebrations",

  // Family
  mother: "Mother's Day",
  mothers: "Mother's Day",
  mothersday: "Mother's Day",
  father: "Father's Day",

  // Animals & Nature
  pets: "Pets",
  animals: "Animals",
  animalsandnature: "Animals & Nature",
  dogcat: "Dogs & Cats",
  turtle: "Turtle",

  // Moods
  scary: "Scary",
  funny: "Funny",
  cute: "Cute",

  // General
  general: "General",
  celebr: "Celebrations",
};

function findMp4(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const item of items) {
      const p = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(findMp4(p));
      } else if (item.name.endsWith(".mp4")) {
        files.push(p);
      }
    }
    return files;
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
}

export async function GET() {
  try {
    const root = path.join(process.cwd(), "public", "videos");
    const files = findMp4(root);

    const videos = files.map((file) => {
      const rel = path.relative(root, file).replace(/\\/g, "/");
      const base = path.basename(file, ".mp4");
      const parts = base.split("_");

      // 🧠 Detectar el value (1A, 2A, etc.)
      const value = parts.find((p) => /^[0-9]+[A-Za-z]*$/.test(p)) || "1A";

      // 🏷️ Detectar categorías
      const cats = [];
      for (const p of parts) {
        const key = p.toLowerCase();
        if (CAT[key] && !cats.includes(CAT[key])) {
          cats.push(CAT[key]);
        }
      }
      if (cats.length === 0) cats.push("Everyday & Appreciation");

      // 🗂️ Detectar subcategoría
      let sub = "General";
      for (const p of parts) {
        const key = p.toLowerCase();
        if (SUB[key]) {
          sub = SUB[key];
          break;
        }
      }

      // 🧍 Object (primera palabra)
      const obj = parts[0]
        ? parts[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Unknown";

      // 🪶 Tags
      const tags = Array.from(
        new Set([
          ...parts.map((p) => p.toLowerCase()),
          obj.toLowerCase(),
          ...cats.map((c) => c.toLowerCase()),
          sub.toLowerCase(),
          value.toLowerCase(),
        ])
      );

      return {
        name: base,
        file: `/videos/${rel}`,
        object: obj,
        category: cats[0],
        categories: cats,
        subcategory: sub,
        slug: base.toLowerCase(),
        value, // <-- agregado aquí
        tags,
      };
    });

    console.log(`✅ API responded with ${videos.length} videos`);

    return NextResponse.json(
      { videos },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("❌ Error in /api/videos:", err);
    return NextResponse.json(
      { error: err.message, videos: [] },
      { status: 500 }
    );
  }
    }
