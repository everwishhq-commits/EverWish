export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // 👈 Necesario para Vercel dinámico

import fs from "fs";
import path from "path";

/**
 * 🧠 Detecta la categoría por nombre del archivo
 */
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
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("newyear")) return "newyear";
  if (s.includes("autumn") || s.includes("fall")) return "autumn";
  if (s.includes("winter")) return "winter";
  if (s.includes("summer")) return "summer";
  if (s.includes("spring")) return "spring";
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

/**
 * 📦 Endpoint principal /api/videodata
 */
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");

    // Verifica que exista la carpeta
    if (!fs.existsSync(dir)) {
      return new Response(
        JSON.stringify({ error: "No videos folder found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Lee los archivos MP4
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mp4"))
      .map((file) => ({
        title: file.replace(/_/g, " ").replace(".mp4", ""),
        src: `/videos/${file}`,
        category: detectCategory(file),
      }));

    // Agrupa por categoría
    const grouped = files.reduce((acc, file) => {
      acc[file.category] = acc[file.category] || [];
      acc[file.category].push(file);
      return acc;
    }, {});

    // Devuelve JSON con todo
    return new Response(
      JSON.stringify({ all: files, categories: grouped }, null, 2),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
