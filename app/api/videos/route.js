import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public/cards");

    // 📜 Leer los archivos que terminan en .mp4
    const files = fs
      .readdirSync(videosDir)
      .filter((file) => file.endsWith(".mp4"));

    // 📁 Mapa de categorías automáticas por palabra clave
    const categoryMap = {
      halloween: "Seasonal & Holidays",
      christmas: "Seasonal & Holidays",
      thanksgiving: "Seasonal & Holidays",
      july4th: "Seasonal & Holidays",
      easter: "Seasonal & Holidays",
      independence: "Seasonal & Holidays",

      birthday: "Birthdays",
      anniversary: "Weddings & Anniversaries",
      wedding: "Weddings & Anniversaries",

      love: "Love & Romance",
      valentines: "Love & Romance",

      mother: "Family & Relationships",
      mothersday: "Family & Relationships",
      father: "Family & Relationships",
      fathersday: "Family & Relationships",

      baby: "New Baby",
      newborn: "New Baby",

      pet: "Pets & Animal Lovers",
      dog: "Pets & Animal Lovers",
      cat: "Pets & Animal Lovers",

      condolence: "Condolences",
      sympathy: "Condolences",

      general: "Everyday",
    };

    // 🧠 Generar lista de videos automáticamente
    const videos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const title = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // 🔍 Detectar categoría automáticamente
      const lower = slug.toLowerCase();
      const foundCategory =
        Object.entries(categoryMap).find(([key]) => lower.includes(key))?.[1] ||
        "Other";

      return {
        title,
        src: `/videos/${file}`,
        slug,
        category: foundCategory,
      };
    });

    // ✅ Devolver respuesta JSON
    return new Response(JSON.stringify(videos, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error reading videos:", error);
    return new Response(JSON.stringify({ error: "Failed to load videos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
        }
