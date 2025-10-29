import { NextResponse } from "next/server";
import { MAIN_CATEGORIES, normalize } from "@/lib/categories";

// ✅ Ejemplo de data (se puede expandir después)
const VIDEOS = [
  {
    object: "Ghost Halloween Love 1A",
    slug: "ghost_halloween_love_1A",
    src: "/videos/ghost_halloween_love_1A.mp4",
    category: "Holidays",
    subcategory: "halloween",
  },
  {
    object: "Mother Mothers-Day Celebration 1A",
    slug: "mother_mothers-day_celebration_1A",
    src: "/videos/mother_mothers-day_celebration_1A.mp4",
    category: "Celebrations & Special Moments",
    subcategory: "mothersday",
  },
  {
    object: "Dogcat Petsandanimals Appreciationday",
    slug: "dogcat_petsandanimals_appreciationday",
    src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
    category: "Animals & Nature",
    subcategory: "general",
  },
  {
    object: "Hugs Anniversary Love A1",
    slug: "hugs_anniversary_love_A1",
    src: "/videos/hugs_anniversary_love_A1.mp4",
    category: "Love & Romance",
    subcategory: "anniversary",
  },
  {
    object: "Eagle July4th Independenceday 1A",
    slug: "eagle_July4th_independenceday_1A",
    src: "/videos/eagle_July4th_independenceday_1A.mp4",
    category: "Holidays",
    subcategory: "independenceday",
  },
  {
    object: "Mother Mothers-Day General 2A",
    slug: "mother_mothers-day_general_2A",
    src: "/videos/mother_mothers-day_general_2A.mp4",
    category: "Celebrations & Special Moments",
    subcategory: "mothersday",
  },
  {
    object: "Octopus Petsandanimals General 1A",
    slug: "octopus_petsandanimals_general_1A",
    src: "/videos/octopus_petsandanimals_general_1A.mp4",
    category: "Animals & Nature",
    subcategory: "general",
  },
  {
    object: "Bunny Easter General",
    slug: "bunny_easter_general",
    src: "/videos/bunny_easter_general.mp4",
    category: "Holidays",
    subcategory: "easter",
  },
];

// 🧠 Asigna mainSlug correcto basándose en tus categorías de lib/categories.js
const ENRICHED_VIDEOS = VIDEOS.map((v) => {
  const found = MAIN_CATEGORIES.find((c) =>
    c.keywords.some((k) =>
      v.subcategory?.toLowerCase().includes(k.toLowerCase())
    )
  );
  return {
    ...v,
    mainSlug: found?.slug || "general",
    mainName: found?.name || "General",
    mainEmoji: found?.emoji || "✨",
    updatedAt: Date.now(),
  };
});

// 🚀 API Response
export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: ENRICHED_VIDEOS.length,
    videos: ENRICHED_VIDEOS,
  });
}
