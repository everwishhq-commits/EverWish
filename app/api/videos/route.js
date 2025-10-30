// /app/api/videos/route.js
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

  const videos = files
    .map((file) => {
      const cleanName = file.replace(".mp4", "");
      const parts = cleanName.split("_");

      // --------------------------------------------------
      // CASO 1: nombre CON formato (4 partes)
      // object_category_subcategory_value.mp4
      // --------------------------------------------------
      if (parts.length >= 3) {
        const [object, categoryRaw, subcategoryRaw, value] = parts;

        const categoryKey = categoryRaw?.toLowerCase();
        const group = MAIN_GROUPS[categoryKey];

        // categoría no existe en lib -> lo mandamos igual pero lo loggeamos
        if (!group) {
          unrecognized.push({
            file: cleanName,
            issue: `Unknown category: ${categoryRaw}`,
            date: new Date().toISOString(),
          });

          return {
            // lo dejamos vivo para que el carrusel NO se rompa
            mainName: "Inspirational & Friendship",
            mainEmoji: "🌟",
            mainColor: "#FFFBE5",
            mainSlug: "inspirational",
            object: object || "unknown",
            category: "inspirational",
            subcategory: "General",
            value: value || null,
            src: `/cards/${file}`,
            // para que los componentes que hacen /edit/${video.slug} no fallen
            slug: cleanName,
          };
        }

        // sub válida dentro del lib?
        const validSubs =
          group.subcategories?.map((s) =>
            s.toLowerCase().replace(/\s+/g, "")
          ) || [];

        const normalizedSub = subcategoryRaw
          ? subcategoryRaw.toLowerCase().replace(/\s+/g, "")
          : "general";

        const finalSub = validSubs.includes(normalizedSub)
          ? subcategoryRaw
          : "General";

        return {
          mainName: group.name,
          mainEmoji: group.emoji,
          mainColor: group.color,
          mainSlug: categoryKey, // 👈 lo que usa tu carrusel
          object: object || "unknown",
          category: categoryKey,
          subcategory: finalSub,
          value: value || null,
          src: `/cards/${file}`,
          slug: cleanName, // 👈 compatibilidad con /edit/[slug]
        };
      }

      // --------------------------------------------------
      // CASO 2: nombre SIN formato (lo viejo)
      // tipo: pumpkin_halloween.mp4 o mother.mp4
      // para no dañar el home, lo mandamos a inspirational/general
      // --------------------------------------------------
      if (parts.length === 2) {
        const [object, maybeCat] = parts;
        return {
          mainName: "Inspirational & Friendship",
          mainEmoji: "🌟",
          mainColor: "#FFFBE5",
          mainSlug: "inspirational",
          object: object || "unknown",
          category: "inspirational",
          subcategory: "General",
          value: null,
          src: `/cards/${file}`,
          slug: cleanName,
          // lo registramos para que sepas que este no está con el formato nuevo
          _warning: `File ${file} has 2 parts only`,
        };
      }

      // 1 sola parte: más viejo todavía
      return {
        mainName: "Inspirational & Friendship",
        mainEmoji: "🌟",
        mainColor: "#FFFBE5",
        mainSlug: "inspirational",
        object: cleanName,
        category: "inspirational",
        subcategory: "General",
        value: null,
        src: `/cards/${file}`,
        slug: cleanName,
        _warning: `File ${file} has no parts`,
      };
    })
    .filter(Boolean);

  // guardamos log
  fs.writeFileSync(logFile, JSON.stringify(unrecognized, null, 2));

  return NextResponse.json({ videos });
}
