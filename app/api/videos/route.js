export const runtime = "nodejs"; // Fuerza Node.js en Vercel

import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public", "videos");

    // 📜 Leer solo archivos .mp4
    const files = fs.readdirSync(videosDir).filter((file) =>
      file.toLowerCase().endsWith(".mp4")
    );

    // 📁 Categorías automáticas
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

    // 🧠 Generar lista de videos
    const videos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const title = slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const lower = slug.toLowerCase();
      const foundCategory =
        Object.entries(categoryMap).find(([key]) => lower.includes(key))?.[1] ||
        "Other";

      return {
        title,
        slug,
        category: foundCategory,
        src: `/videos/${file}`,
      };
    });

    // ✅ Devolver JSON ordenado
    const sorted = videos.sort((a, b) => a.title.localeCompare(b.title));

    return new Response(JSON.stringify(sorted, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error leyendo videos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load videos", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
