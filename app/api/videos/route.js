import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/cards");
    if (!fs.existsSync(dir)) {
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      const object = parts[0] || "unknown";
      const category = parts[1]?.toLowerCase() || "general";
      const subcategory = parts[2]?.toLowerCase() || "general";
      const value = parts[3] || "1A";

      // asignar categoría principal
      let mainSlug = "general";
      const holidays = ["halloween", "christmas", "thanksgiving", "easter", "newyear", "holiday"];
      const celebrations = ["birthday", "graduation", "baby", "wedding", "anniversary", "love"];

      if (holidays.includes(category) || holidays.includes(subcategory)) mainSlug = "holidays";
      else if (celebrations.includes(category) || celebrations.includes(subcategory))
        mainSlug = "celebrations";

      return {
        src: `/cards/${filename}`,
        slug: clean,
        object,
        category,
        subcategory,
        mainSlug,
        value,
      };
    });

    return new Response(JSON.stringify({ videos }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error leyendo /cards:", err);
    return new Response(
      JSON.stringify({ videos: [], error: err.message }),
      { status: 500 }
    );
  }
                      }
