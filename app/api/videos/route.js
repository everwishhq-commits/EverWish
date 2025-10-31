import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 👉 Lee desde la carpeta correcta
    const dir = path.join(process.cwd(), "public/cards");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");
      const object = parts[0] || "unknown";
      const category = parts[1] || "general";
      const subcategory = parts[2] || "general";
      const value = parts[3] || "1A";

      return {
        src: `/cards/${filename}`,
        slug: clean,
        object,
        category,
        subcategory,
        value,
      };
    });

    // 🔥 Devuelve un array plano (como antes)
    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error leyendo /public/cards:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
