// ✅ Forzar ejecución dinámica en Vercel
export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

// 🧠 Detecta categoría según el nombre del archivo
function detectCategory(filename) {
  const s = filename.toLowerCase();

  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas") || s.includes("xmas")) return "christmas";
  if (s.includes("easter")) return "easter";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("mothers")) return "mothers-day";
  if (s.includes("fathers")) return "fathers-day";
  if (s.includes("baby")) return "baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("autumn") || s.includes("fall")) return "autumn";
  if (s.includes("winter")) return "winter";
  if (s.includes("summer")) return "summer";
  if (s.includes("spring")) return "spring";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("sorry") || s.includes("apology")) return "apology";
  if (s.includes("missyou") || s.includes("thinking")) return "emotions";
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return "pets";

  return "general";
}

// 🧩 Agrupa por categoría
function groupByCategory(videos) {
  return videos.reduce((acc, video) => {
    const category = video.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(video);
    return acc;
  }, {});
}

// 📦 Endpoint principal
export async function GET() {
  try {
    const videosDir = path.join(process.cwd(), "public/videos");

    // ⚠️ Si la carpeta no existe, devolvemos vacío
    if (!fs.existsSync(videosDir)) {
      console.warn("⚠️ Carpeta /public/videos no encontrada");
      return new Response(JSON.stringify({ categories: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔹 Leer archivos MP4
    const files = fs
      .readdirSync(videosDir)
      .filter((file) => file.endsWith(".mp4"));

    // 🔸 Crear lista de videos
    const videos = files.map((filename) => ({
      title: filename.replace(".mp4", ""),
      category: detectCategory(filename),
      src: `/videos/${filename}`,
    }));

    // 🔸 Agrupar por categoría
    const grouped = groupByCategory(videos);

    // ✅ Respuesta en formato JSON
    return new Response(JSON.stringify({ categories: grouped }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error al cargar videos:", error);
    return new Response(
      JSON.stringify({ error: "Error al cargar videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
                          }
