import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta correcta
    const dir = path.join(process.cwd(), "public/cards");

    // 📜 Leer todos los mp4
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    // 🧩 Estructura: object_category_subcategory_value
    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      return {
        src: `/cards/${filename}`,
        slug: clean,
        object: parts[0] || "unknown",
        category: parts[1] || "general",
        subcategory: parts[2] || "general",
        value: parts[3] || "1A",
      };
    });

    // ✅ Respuesta en el mismo formato que tu frontend esperaba
    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error leyendo /cards:", err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
