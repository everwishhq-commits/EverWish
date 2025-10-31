// app/api/videos/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// función de limpieza básica
function normalize(str = "") {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "")
    .trim();
}

// lee y clasifica nombres del tipo:
// object_categoria1_categoria2_subcategoria1_subcategoria2_value.mp4
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "cards");
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ videos: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".mp4"));

    const videos = files.map((file) => {
      const name = file.replace(".mp4", "");
      const parts = name.split("_");

      const object = parts[0] || "";
      const category1 = parts[1] || "";
      const category2 = parts[2] || "";
      const subcategory1 = parts[3] || "";
      const subcategory2 = parts[4] || "";
      const value = parts[5] || "";

      return {
        src: `/cards/${file}`,
        filename: name,
        object,
        category1,
        category2,
        subcategory1,
        subcategory2,
        value,
        slug: normalize(name),
        mainSlug: normalize(category1 || object),
      };
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("Error leyendo videos:", err);
    return NextResponse.json({ videos: [], error: err.message });
  }
}
