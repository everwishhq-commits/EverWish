import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

import { classifyVideo } from "@/lib/classification-system"; // tu archivo real

export async function GET() {
  try {
    const videosDir = path.join(process.cwd(), "public/videos");

    if (!fs.existsSync(videosDir)) {
      return NextResponse.json(
        { error: "Videos folder missing", videos: [] },
        { status: 404 }
      );
    }

    // leer archivos .mp4 del folder
    const files = fs.readdirSync(videosDir)
      .filter((f) => f.toLowerCase().endsWith(".mp4"));

    const videos = files.map((file) => {
      const name = file.replace(/\.mp4$/i, "");
      const filePath = `/videos/${file}`;

      const classifications = classifyVideo(name);

      return {
        name,              // desert_teamsportsenergy_1A
        slug: name,        // slug igual al nombre
        file: filePath,    // /videos/desert_teamsportsenergy_1A.mp4
        categories: classifications.map(c => c.categorySlug),
        subcategories: classifications.flatMap(c => c.subcategories || []),
        variant: classifications[0]?.variant || "1A",
        object: classifications[0]?.object || ""
      };
    });

    return NextResponse.json(
      { videos },
      { headers: { "Cache-Control": "no-store" } }
    );

  } catch (err) {
    console.error("❌ Error in /api/videos:", err);
    return NextResponse.json(
      { error: err.message, videos: [] },
      { status: 500 }
    );
  }
}
