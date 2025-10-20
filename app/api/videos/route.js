import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const videoDir = path.join(process.cwd(), "public/videos");

    // Si la carpeta no existe o no se puede leer
    if (!fs.existsSync(videoDir)) {
      console.warn("⚠️ Folder /public/videos not found on server");
      return NextResponse.json({ all: [], top10: [] });
    }

    const files = fs
      .readdirSync(videoDir)
      .filter((f) => f.toLowerCase().endsWith(".mp4"));

    const videos = files.map((file) => {
      const base = file.replace(".mp4", "");
      const parts = base.split("_");
      const [subject, category1, category2, code] = parts;

      const title = [subject, category1, category2]
        .filter(Boolean)
        .map(capitalize)
        .join(" ");

      return {
        title,
        src: `/videos/${file}`,
        slug: base.toLowerCase(),
        categories: [category1?.toLowerCase(), category2?.toLowerCase()].filter(
          Boolean
        ),
      };
    });

    videos.sort((a, b) => b.title.localeCompare(a.title));

    return NextResponse.json({
      all: videos,
      top10: videos.slice(0, 10),
    });
  } catch (error) {
    console.error("❌ Error loading videos:", error);
    return NextResponse.json({ all: [], top10: [] });
  }
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
