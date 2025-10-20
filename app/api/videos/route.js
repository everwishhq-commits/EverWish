import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Leer el JSON público con la lista de videos
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/videos_index.json`);
    const filenames = await res.json();

    // Crear los objetos automáticamente
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
  } catch (error) {
    console.error("Error loading videos:", error);
    return NextResponse.json([], { status: 500 });
  }
}
