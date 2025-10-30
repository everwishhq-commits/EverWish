import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MAIN_CATEGORIES as MAIN_GROUPS } from "@/lib/categories.js";

export async function GET() {
  const dir = path.join(process.cwd(), "public/cards");
  const logDir = path.join(process.cwd(), "public/logs");
  const logFile = path.join(logDir, "unrecognized.json");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
    : [];

  let unrecognized = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, "utf-8") || "[]")
    : [];

  const videos = files.map((file) => {
    const cleanName = file.replace(".mp4", "");
    const parts = cleanName.split("_");

    // ✅ Formato esperado: object_category_subcategory_value
    const [object, category, subcategory, value] = parts;

    // Verificar si categoría existe en lib
    const categoryKey = category?.toLowerCase();
    const group = MAIN_GROUPS[categoryKey];

    // Si la categoría no existe, registrar en log
    if (!group) {
      unrecognized.push({
        file: cleanName,
        issue: `Unknown category: ${category}`,
        date: new Date().toISOString(),
      });
      return null;
    }

    // Verificar subcategoría válida
    const subList =
      group.subcategories?.map((s) =>
        s.toLowerCase().replace(/\s+/g, "")
      ) || [];
    const matchedSub = subList.includes(subcategory?.toLowerCase())
      ? subcategory
      : "General";

    // Crear objeto final
    return {
      mainName: group.name,
      mainEmoji: group.emoji,
      mainColor: group.color,
      mainSlug: categoryKey,
      object: object || "unknown",
      category: categoryKey,
      subcategory: matchedSub,
      value: value || null,
      src: `/cards/${file}`,
    };
  }).filter(Boolean);

  // Guardar log
  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));

  return NextResponse.json({ videos });
           }
