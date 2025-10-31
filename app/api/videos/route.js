import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // ✅ Carpeta correcta según tu estructura
    const dir = path.join(process.cwd(), "public/cards");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    // ✅ Misma estructura que usabas antes
    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, ""); // quita extensión
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

    // ✅ Devuelve array plano
    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error leyendo /cards:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
