import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public/videos");

    // 📜 Leer los archivos que terminan en .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 🧭 Diccionario base para clasificar automáticamente
    const categoryMap = {
      halloween: "Seasonal & Holidays",
      christmas: "Seasonal & Holidays",
      thanksgiving: "Seasonal & Holidays",
      easter: "Seasonal & Holidays",
      independence: "Seasonal & Holidays",
      newyear: "Seasonal & Holidays",
      july4th: "Seasonal & Holidays",

      birthday: "Birthday",
      anniversary: "Weddings & Anniversaries",
      wedding: "Weddings & Anniversaries",

      love: "Love & Romance",
      valentine: "Love & Romance",

      mother: "Family & Relationships",
      mothersday: "Family & Relationships",
      father: "Family & Relationships",
      fathersday: "Family & Relationships",

      baby: "Babies & Parenting",
      newborn: "Babies & Parenting",

      pet: "Pets & Animal Lovers",
      dog: "Pets & Animal Lovers",
      cat: "Pets & Animal Lovers",
      animal: "Pets & Animal Lovers",
      octopus: "Pets & Animal Lovers",
      turtle: "Pets & Animal Lovers",

      condolence: "Sympathy & Remembrance",
      sympathy: "Sympathy & Remembrance",

      general: "Everyday"
    };

    // 🧠 Generar lista de videos automáticamente
    const videos = files.map((file) => {
      const slug = file.replace(".mp4", "");
      const parts = slug
        .replace(/_/g, "+")
        .split("+")
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);

      const [object, ...cats] = parts;
      const variantMatch = object.match(/(\d+[a-z]*)$/i);
      const variant = variantMatch ? variantMatch[1] : null;

      // Buscar categoría principal
      const foundCategory =
        Object.entries(categoryMap).find(([key]) => slug.includes(key))?.[1] ||
        "Other";

      // Subcategoría (si hay)
      const subcategory = cats.find(
        (c) => !["general", "1a", "2a", "v1", "v2"].includes(c)
      );

      // Lista completa de categorías
      const categories = cats.map((c) =>
        c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
      );

      return {
        object: object.replace(/\b\w/g, (ch) => ch.toUpperCase()),
        file: `/videos/${file}`,
        slug,
        category: foundCategory,
        categories,
        subcategory:
          subcategory?.replace(/\b\w/g, (ch) => ch.toUpperCase()) || "General",
        variant,
        tags: [object, ...cats],
      };
    });

    // ✅ Respuesta final JSON
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
