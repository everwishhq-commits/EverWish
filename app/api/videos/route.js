import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 🗂️ Carpeta correcta (tus videos reales)
    const dir = path.join(process.cwd(), "public/cards");

    // 🚨 Si no existe, devolvemos lista vacía (evita error 404 en Vercel)
    if (!fs.existsSync(dir)) {
      console.warn("⚠️ Carpeta public/cards no encontrada");
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 🔍 Leer sólo archivos mp4
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

    // 🧩 Analizar nombres de archivo
    const videos = files.map(filename => {
      const clean = filename.replace(/\.[^/.]+$/, "");
      const parts = clean.split("_");

      // 📄 Estructura: object_category_subcategory_value
      const object = parts[0] || "unknown";
      const category = parts[1] || "general";
      const subcategory = parts[2] || "general";
      const value = parts[3] || "1A";

      // 🧠 Detección de categoría principal
      let mainSlug = "general";

      const holidaySet = [
        "halloween", "christmas", "easter", "thanksgiving", "newyear",
        "independenceday", "4thofjuly", "holiday"
      ];

      const celebrationSet = [
        "birthday", "graduation", "baby", "wedding", "anniversary",
        "love", "mother", "father", "celebration"
      ];

      if (holidaySet.includes(category.toLowerCase()) || holidaySet.includes(subcategory.toLowerCase())) {
        mainSlug = "holidays";
      } else if (celebrationSet.includes(category.toLowerCase()) || celebrationSet.includes(subcategory.toLowerCase())) {
        mainSlug = "celebrations";
      }

      // 🔗 Si pertenece a más de una categoría (ej. halloween + birthday)
      const extraCategories = [];
      if (holidaySet.includes(category.toLowerCase()) || holidaySet.includes(subcategory.toLowerCase()))
        extraCategories.push("holidays");
      if (celebrationSet.includes(category.toLowerCase()) || celebrationSet.includes(subcategory.toLowerCase()))
        extraCategories.push("celebrations");

      return {
        src: `/cards/${filename}`,
        slug: clean,
        object,
        category,
        subcategory,
        value,
        mainSlug,
        extraCategories,
      };
    });

    // 🧾 Devuelve el mismo formato que usa tu frontend (¡clave!)
    return new Response(JSON.stringify({ videos }, null, 2), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error leyendo /cards:", error);
    return new Response(
      JSON.stringify({ error: "Error leyendo videos", details: error.message }),
      { status: 500 }
    );
  }
    }
