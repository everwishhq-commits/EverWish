import fs from "fs";
import path from "path";

/**
 * 🧠 Detecta la categoría principal por nombre del archivo
 */
function detectCategory(filename) {
  const s = filename.toLowerCase();
  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("easter")) return "easter";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("baby")) return "baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear")) return "newyear";
  if (s.includes("autumn") || s.includes("fall")) return "autumn";
  if (s.includes("winter") || s.includes("snow")) return "winter";
  if (s.includes("summer") || s.includes("beach")) return "summer";
  if (s.includes("spring")) return "spring";
  if (s.includes("travel")) return "travel";
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

/**
 * 📦 GET /api/videos
 * Lee automáticamente los .mp4 en /public/videos,
 * los clasifica, y genera top10 + lista completa por categoría.
 */
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");

    // 🧩 Evita errores si no existe
    if (!fs.existsSync(dir)) {
      console.warn("⚠️ Carpeta /public/videos no encontrada");
      return new Response(JSON.stringify({ top10: [], categories: {} }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0", // 🔥 sin caché
        },
      });
    }

    // 🔹 Leer archivos MP4 con su fecha
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mp4"))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const baseName = path.parse(file).name;
        const title = baseName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const category = detectCategory(file);

        return {
          title,
          src: `/videos/${file}`,
          slug: baseName,
          category,
          createdAt: stats.birthtimeMs,
        };
      });

    if (files.length === 0) {
      return new Response(
        JSON.stringify({
          top10: [],
          categories: {},
          message: "No videos found in /public/videos",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    // 🔝 Ordenar por fecha (más recientes primero)
    const sorted = files.sort((a, b) => b.createdAt - a.createdAt);
    const top10 = sorted.slice(0, 10);

    // 🗂 Agrupar por categoría
    const grouped = sorted.reduce((acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category].push(v);
      return acc;
    }, {});

    // ✅ Respuesta final
    return new Response(
      JSON.stringify(
        {
          top10,
          categories: grouped,
          totalVideos: sorted.length,
          updated: new Date().toISOString(),
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0", // 🔥 sin caché → siempre actualizado
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return new Response(
      JSON.stringify({ error: "Error al cargar videos" }),
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
          }
