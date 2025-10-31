import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES } from "@/lib/categories.js";

// 🔹 Normaliza texto para comparación
function normalize(str = "") {
  return str.toLowerCase().replace(/[^\w]+/g, "_").trim();
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/cards");
    if (!fs.existsSync(dir)) return NextResponse.json({ videos: [] });

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));
    const videos = [];

    for (const file of files) {
      const clean = file.replace(".mp4", "");
      const parts = clean.split("_").map(normalize);
      const object = parts[0] || "unknown";
      const tokens = parts.slice(1);

      // 🧠 Encontrar todas las categorías válidas en el nombre
      const foundCategories = Object.entries(MAIN_CATEGORIES)
        .filter(([key, cat]) => {
          const allKeywords = [key, ...cat.keywords.map(normalize)];
          return tokens.some((t) => allKeywords.includes(t));
        })
        .map(([key]) => key);

      // Si no se detecta categoría, asignar "inspirational" por defecto
      const categories = foundCategories.length
        ? [...new Set(foundCategories)]
        : ["inspirational"];

      for (const catKey of categories) {
        const catData = MAIN_CATEGORIES[catKey];

        // 🧩 Buscar subcategoría que pertenezca a esta categoría
        const foundSub =
          catData.subcategories.find((s) =>
            tokens.includes(normalize(s))
          ) || "General";

        videos.push({
          object,
          mainSlug: catKey,
          mainName: catData.mainName,
          mainEmoji: catData.mainEmoji,
          mainColor: catData.mainColor,
          subcategory: foundSub,
          src: `/cards/${file}`,
        });
      }
    }

    // ✂️ Eliminar duplicados exactos
    const unique = videos.filter(
      (v, i, arr) =>
        i ===
        arr.findIndex(
          (x) =>
            x.src === v.src &&
            x.mainSlug === v.mainSlug &&
            x.subcategory === v.subcategory
        )
    );

    return NextResponse.json({ videos: unique });
  } catch (error) {
    console.error("❌ Error reading videos:", error);
    return NextResponse.json({ videos: [] });
  }
}
