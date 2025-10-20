import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  let filenames = [];

  try {
    // 🧠 1️⃣ En desarrollo (local)
    const dir = path.join(process.cwd(), "public/videos");
    filenames = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));
  } catch (err) {
    // 🚀 2️⃣ En producción (Vercel): usa archivo puente
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    try {
      const res = await fetch(`${base}/videos_index.json`);
      filenames = await res.json();
    } catch {
      filenames = []; // por si no existe el archivo
    }
  }

  // 🪄 3️⃣ Generar automáticamente el objeto de cada video
  const videos = filenames.map((filename) => {
    const name = filename.replace(".mp4", "");
    const parts = name.split("_");

    const title = parts
      .slice(0, -1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");

    const categories = parts.slice(1, -1).map((p) => p.toLowerCase());

    return {
      title,
      slug: name,
      src: `/videos/${filename}`,
      categories,
    };
  });

  return NextResponse.json(videos);
}
