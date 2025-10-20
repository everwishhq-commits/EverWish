import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const videoDir = path.join(process.cwd(), "public/videos");

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
      uploadedAt: fs.statSync(path.join(videoDir, file)).mtimeMs,
    };
  });

  videos.sort((a, b) => b.uploadedAt - a.uploadedAt);

  return NextResponse.json({
    all: videos,
    top10: videos.slice(0, 10),
  });
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
