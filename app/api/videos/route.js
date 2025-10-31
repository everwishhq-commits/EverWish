import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");
    const files = (await fs.readdir(dir)).filter(f => f.endsWith(".mp4"));

    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      // 🧩 Estructura: object_category_subcategory_value
      const object = parts[0] || "unknown";
      const category = parts[1] || "general";
      const subcategory = parts[2] || "general";
      const value = parts[3] || "1A";

      // 🎯 Detección de categorías principales
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

      const subcategories = [subcategory];

      return {
        object,
        src: `/videos/${filename}`,
        categories,
        subcategories,
        value,
        slug: clean,
      };
    });

    return new Response(JSON.stringify({ videos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error reading videos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load videos" }),
      { status: 500 }
    );
  }
}
