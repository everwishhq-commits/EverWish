import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // ✅ Carpeta correcta
    const dir = path.join(process.cwd(), "public/cards");
    const files = (await fs.readdir(dir)).filter(f => f.endsWith(".mp4"));

    if (!files.length) {
      console.warn("⚠️ No se encontraron archivos .mp4 en public/cards");
    }

    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      // 🧩 Formato: object_category_subcategory_value
      const object = parts[0] || "unknown";
      const category = parts[1] || "general";
      const subcategory = parts[2] || "general";
      const value = parts[3] || "1A";

      // 🗂️ Categorización principal
      const categories = [];
      if (
        [
          "halloween",
          "christmas",
          "thanksgiving",
          "easter",
          "independence",
          "newyear",
          "veterans",
          "winter",
          "dayofthedead",
          "labor",
          "memorial",
          "columbus",
        ].some(word => category.includes(word))
      ) {
        categories.push("holidays");
      }
      if (
        [
          "birthday",
          "anniversary",
          "graduation",
          "wedding",
          "promotion",
          "baby",
          "retirement",
          "achievement",
          "hugs",
          "love",
          "mothers",
          "fathers",
        ].some(word => category.includes(word))
      ) {
        categories.push("celebrations");
      }
      if (categories.length === 0) categories.push("general");

      return {
        object,
        category,
        subcategory,
        value,
        categories,
        src: `/cards/${filename}`, // ✅ Ruta pública correcta
        slug: clean,
      };
    });

    return new Response(JSON.stringify({ videos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error reading cards:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load cards", details: error.message }),
      { status: 500 }
    );
  }
  }
