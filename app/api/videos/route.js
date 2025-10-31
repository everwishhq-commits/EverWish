import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 🗂️ Leer los archivos desde public/cards (ya no public/videos)
    const dir = path.join(process.cwd(), "public/cards");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    // 🧩 Analizar nombres: object_category_subcategory_value.mp4
    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, ""); // sin extensión
      const parts = clean.split("_"); // separa por "_"

      // Estructura: object_category_subcategory_value
      const object = parts[0] || "unknown";
      const category = parts[1] || "general";
      const subcategory = parts[2] || "general";
      const value = parts[3] || "1A";

      // Detectar categorías cruzadas (puede pertenecer a 2 principales)
      const categories = [];
      if (["halloween", "christmas", "thanksgiving", "easter", "newyear", "4thofjuly"].includes(category.toLowerCase())) {
        categories.push("holidays");
      }
      if (["birthday", "anniversary", "graduation", "baby", "love", "mother", "wedding"].includes(category.toLowerCase()) ||
          ["birthday", "anniversary", "graduation", "baby", "love", "mother", "wedding"].includes(subcategory.toLowerCase())) {
        categories.push("celebrations");
      }
      if (categories.length === 0) categories.push("general");

      return {
        name: clean,
        file: `/cards/${filename}`,
        object,
        category,
        subcategory,
        value,
        categories,
      };
    });

    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error reading cards:", error);
    return new Response(
      JSON.stringify({ error: "Error reading cards", details: error.message }),
      { status: 500 }
    );
  }
}
