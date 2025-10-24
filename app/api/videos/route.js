import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta donde están los videos
    const videosDir = path.join(process.cwd(), "public/videos");

    // 📜 Leer los archivos que terminan en .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 📁 Mapa de detección rápida para categorías base
    const categoryMap = {
      halloween: "Seasonal & Holidays",
      christmas: "Seasonal & Holidays",
      thanksgiving: "Seasonal & Holidays",
      easter: "Seasonal & Holidays",
      independence: "Seasonal & Holidays",
      newyear: "Seasonal & Holidays",

      birthday: "Birthday",
      anniversary: "Weddings & Anniversaries",
      wedding: "Weddings & Anniversaries",

      love: "Love & Romance",
      valentine: "Love & Romance",
      valentines: "Love & Romance",

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

      condolence: "Sympathy & Remembrance",
      sympathy: "Sympathy & Remembrance",

      general: "Everyday",
    };

    // 🧠 Generar lista de videos automáticamente
    const videos = files.map((file) => {
      const name = file.replace(".mp4", "");

      // 🧩 Separar partes por "+"
      const parts = name.split("+").map((p) => p.trim().toLowerCase());
      const [object, ...categories] = parts;

      // 🧭 Detección de categoría principal y subcategoría
      const categorySlug = categories[0] || "general";
      const subcategorySlug = categories[1] || null;
      const extra = categories[2] || null;

      // 🧩 Variante (por ejemplo: bunny_2A)
      const variantMatch = object.match(/(\d+[a-z]*)$/i);
      const variant = variantMatch ? variantMatch[1] : null;

      // 🧭 Buscar nombre visible
      const foundCategory =
        Object.entries(categoryMap).find(([key]) => name.includes(key))?.[1] ||
        categoryMap[categorySlug] ||
        "Other";

      // 📦 Crear el objeto
      return {
        name: object,
        file: `/videos/${file}`,
        object: object.charAt(0).toUpperCase() + object.slice(1),
        category: foundCategory,
        categorySlug,
        subcategory: subcategorySlug,
        categories: categories.filter(Boolean),
        variant,
        tags: parts,
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
