import { NextResponse } from "next/server";

// 🧠 Simplemente agrega aquí los nombres de los archivos MP4
const filenames = [
  "pumpkin_halloween_general_1A.mp4",
  "ghost_halloween_love_1A.mp4",
  "turkey_thanksgiving_general_1A.mp4",
  "turtle_christmas_general_1A.mp4",
  "yeti_christmas_general_1A.mp4",
  "bunny_easter_general_1A.mp4",
  "dogcat_petsandanimals_appreciationday_1A.mp4",
  "mother_mothersday_celebration_1A.mp4",
  "mother_mothersday_general_1A.mp4",
  "hugs_anniversary_love_1A.mp4",
  "eagle_july4th_independenceday_1A.mp4",
  "zombie_halloween_birthday_1A.mp4",
];

// 🪄 Función que convierte nombre → objeto
function parseVideo(filename) {
  const name = filename.replace(".mp4", "");
  const parts = name.split("_");
  const [main, cat1, cat2] = parts;

  // 🔤 Título bonito automático
  const title = parts
    .slice(0, -1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  return {
    title,
    src: `/videos/${filename}`,
    slug: name,
    categories: [cat1?.toLowerCase(), cat2?.toLowerCase()].filter(Boolean),
  };
}

// 🚀 GET
export async function GET() {
  const videos = filenames.map(parseVideo);
  return NextResponse.json(videos);
}
