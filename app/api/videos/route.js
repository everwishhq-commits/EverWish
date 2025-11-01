/**
 * 📡 Everwish Dynamic Video Index API
 * Lee y devuelve /public/videos/index.json.
 * Si no existe, lo genera automáticamente desde /public/data/subcategories.json
 * y los videos en /public/videos/**.
 */

import fs from "fs";
import path from "path";

// 🔧 Evita cacheo de Vercel (muy importante para builds dinámicos)
export const dynamic = "force-dynamic";

// 📍 Rutas base
const videosRoot = path.join(process.cwd(), "public/videos");
const indexFile = path.join(videosRoot, "index.json");
const subcategoryMapPath = path.join(process.cwd(), "public/data/subcategories.json");

// 🧩 Función auxiliar para formatear nombres
function formatWord(word) {
  return word
    ? word.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
}

// 🧠 Detectar categoría/subcategoría
function detectCategory(words, subcategoryMap) {
  const lower = words.map((w) => w.toLowerCase());
  for (const [mainCat, subs] of Object.entries(subcategoryMap)) {
    for (const sub of subs) {
      const allTerms = [
        sub.name_en.toLowerCase(),
        sub.name_es.toLowerCase(),
        mainCat.replace(/-/g, " "),
      ];
      if (allTerms.some((term) => lower.some((w) => w.includes(term.split(" ")[0])))) {
        return [mainCat, sub.name_en];
      }
    }
  }
  return ["Just Because & Everyday", "General"];
}

// 🧮 Buscar recursivamente todos los .mp4
function getAllMp4Files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllMp4Files(fullPath);
    return entry.name.toLowerCase().endsWith(".mp4") ? [fullPath] : [];
  });
}

// ⚙️ Generar índice dinámico
function generateIndex() {
  console.log("⚙️ Generando index.json dinámicamente...");

  let subcategoryMap = {};
  try {
    if (fs.existsSync(subcategoryMapPath)) {
      subcategoryMap = JSON.parse(fs.readFileSync(subcategoryMapPath, "utf-8"));
    } else {
      console.warn("⚠️ No se encontró subcategories.json, usando categorías genéricas.");
    }
  } catch (err) {
    console.error("⚠️ No se pudo cargar subcategories.json:", err);
  }

  const files = getAllMp4Files(videosRoot);
  const index = files.map((filePath) => {
    const relative = path.relative(videosRoot, filePath).replace(/\\/g, "/");
    const name = path.basename(filePath, ".mp4");
    const parts = name.split("_");

    const object = formatWord(parts[0] || "Unknown");
    const [category, subcategory] = detectCategory(parts, subcategoryMap);
    const variant = parts[parts.length - 1]?.toUpperCase() || "";

    const tags = Array.from(
      new Set(
        [object, category, subcategory, variant, ...parts]
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      )
    );

    return {
      name,
      file: `/videos/${relative}`,
      object,
      category,
      subcategory,
      variant,
      categories: [category],
      tags,
    };
  });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");
  console.log(`✅ Index actualizado con ${index.length} archivos.`);
  return index;
}

// 📡 Endpoint principal
export async function GET() {
  try {
    if (fs.existsSync(indexFile)) {
      const data = fs.readFileSync(indexFile, "utf-8");
      const parsed = JSON.parse(data);

      return new Response(JSON.stringify({ videos: parsed }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const index = generateIndex();
    return new Response(JSON.stringify({ videos: index }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("❌ Error en API /api/videos:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to load or generate index",
        details: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
        }
