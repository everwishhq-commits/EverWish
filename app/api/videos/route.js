import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const cardsDir = path.join(process.cwd(), "public", "cards");
    const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith(".mp4"));

    // ✅ Categorías oficiales (de tu bloque aprobado)
    const knownCategories = [
      "holidays",
      "love",
      "celebrations",
      "work",
      "condolences",
      "animals",
      "seasons",
      "inspirational",
    ];

    const videos = files.map((file) => {
      const name = file.replace(".mp4", "");
      const parts = name.split("_").map((p) => p.toLowerCase());

      const base = {
        object: "",
        categories: [],
        subcategories: [],
        mainSlug: "",
        categorySlug: "",
        subcategory: "",
        file: `/cards/${file}`,
        src: `/cards/${file}`,
        slug: name,
      };

      // 🧠 Extraer partes
      if (parts.length >= 2) {
        base.object = parts[0];

        // 🔍 Clasificar entre categorías y subcategorías
        for (const p of parts) {
          if (knownCategories.includes(p)) {
            base.categories.push(p);
          } else if (!["1a", "1b", "2a", "2b", "preview"].includes(p)) {
            base.subcategories.push(p);
          }
        }

        // 🎯 Lógica de asignación
        base.mainSlug = base.categories[0] || "holidays";
        base.categorySlug = base.categories[1] || base.mainSlug;

        // 🧩 Si no hay subcategoría → crear una “general” ligada a la categoría principal
        if (base.subcategories.length === 0) {
          base.subcategory = "General";
          base.subcategories = ["General"];
        } else {
          base.subcategory =
            base.subcategories[0].charAt(0).toUpperCase() +
            base.subcategories[0].slice(1);
        }
      } else {
        // 🪄 Si el nombre no tiene estructura completa
        base.object = name;
        base.mainSlug = "holidays";
        base.categorySlug = "holidays";
        base.subcategory = "General";
        base.subcategories = ["General"];
      }

      return base;
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("❌ Error reading cards folder:", err);
    return NextResponse.json({ error: "Failed to load videos" }, { status: 500 });
  }
}
