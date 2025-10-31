import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📂 Carpeta con las tarjetas
    const dir = path.join(process.cwd(), "public/cards");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    // 📦 Analiza los nombres: object_category1_category2_sub1_sub2_value
    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      const object = parts[0] || "unknown";
      const category1 = parts[1] || "general";
      const category2 = parts[2] || null;
      const sub1 = parts[3] || "general";
      const sub2 = parts[4] || null;
      const value = parts[5] || "1A";

      // Agrupa por clasificación (no por diseño)
      const categories = [category1, category2].filter(Boolean);
      const subcategories = [sub1, sub2].filter(Boolean);

      return {
        src: `/cards/${filename}`,
        slug: clean,
        object,
        categories,
        subcategories,
        design: value, // diseño (1A, 2A, etc.)
      };
    });

    // 🧠 Agrupa por combinación de object + categories + subcategories
    const grouped = {};
    videos.forEach(v => {
      const key = `${v.object}_${v.categories.join("-")}_${v.subcategories.join("-")}`;
      if (!grouped[key]) grouped[key] = { ...v, designs: [] };
      grouped[key].designs.push({
        design: v.design,
        src: v.src,
        slug: v.slug
      });
    });

    // 🔹 Lista final a devolver
    const result = Object.values(grouped).map(v => ({
      object: v.object,
      categories: v.categories,
      subcategories: v.subcategories,
      designs: v.designs
    }));

    // ✅ Devuelve con formato que tu carrusel entiende
    return new Response(
      JSON.stringify({ videos: result.flatMap(v => v.designs) }, null, 2),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("❌ Error leyendo /cards:", error);
    return new Response(JSON.stringify({ videos: [] }), { status: 500 });
  }
        }
