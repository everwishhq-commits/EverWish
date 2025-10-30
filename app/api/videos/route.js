import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES, normalize } from "@/lib/categories";

// 🚀 API principal Everwish — Lee automáticamente los videos desde /public/cards
export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  let files = [];

  try {
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"));
    }
  } catch (error) {
    console.error("⚠️ Error al leer /public/cards:", error);
  }

  if (files.length === 0) {
    return NextResponse.json({
      message: "⚠️ No se encontraron archivos .mp4 en /public/cards",
      videos: [],
    });
  }

  // 🧩 Mapeo: convierte nombre del archivo en estructura Everwish
  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");

    // 🧠 Estructura esperada: objeto_categoria_subcategoría_diseño
    const object = normalize(parts[0] || "unknown");
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");
    const version = normalize(parts[3] || "1a");

    // 🎨 Buscar grupo principal
    const match = MAIN_CATEGORIES.find((group) =>
      group.keywords.some((kw) =>
        cleanName.toLowerCase().includes(kw.toLowerCase())
      )
    );

    const mainSlug = match?.slug || "general";
    const mainName = match?.name || "General";
    const mainEmoji = match?.emoji || "✨";
    const mainColor = match?.color || "#FFFFFF";

    // 🧾 Generar nombre legible
    const fullCategoryName =
      subcategory !== "general"
        ? `${mainName} — ${subcategory}`
        : `${mainName} — ${category}`;

    return {
      object,
      slug: cleanName,
      src: `/cards/${file}`,
      category,
      subcategory,
      version,
      mainSlug,
      mainName,
      mainEmoji,
      mainColor,
      combinedName: fullCategoryName,
    };
  });

  // 🗂️ Agrupar por categoría principal (para tu vista Explore o listas ordenadas)
  const grouped = {};
  videos.forEach((v) => {
    if (!grouped[v.mainName]) grouped[v.mainName] = [];
    grouped[v.mainName].push(v);
  });

  // ✅ Respuesta final compatible con frontend Everwish y Everwish2
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: videos.length,
    categories: Object.keys(grouped),
    videos,
    grouped,
  });
}
