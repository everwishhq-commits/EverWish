import fs from "fs";
import path from "path";

/** Detecta categoría por nombre del archivo */
function detectCategory(filename) {
  const s = filename.toLowerCase();
  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("easter")) return "easter";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("mothers")) return "mothers-day";
  if (s.includes("fathers")) return "fathers-day";
  if (s.includes("baby")) return "new-baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "new-year";
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");

    if (!fs.existsSync(dir)) {
      console.warn("⚠️ Carpeta /public/videos no encontrada");
      return new Response(JSON.stringify({ all: [], categories: {}, updated: new Date().toISOString() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mp4"))
      .map((file) => {
        const baseName = path.parse(file).name;
        const title = baseName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return {
          title,
          src: `/videos/${file}`,
          slug: baseName,
          category: detectCategory(file),
        };
      });

    const categories = files.reduce((acc, v) => {
      (acc[v.category] ||= []).push(v);
      return acc;
    }, {});

    return new Response(
      JSON.stringify({ all: files, categories, updated: new Date().toISOString() }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return new Response(JSON.stringify({ error: "Error al cargar videos" }), { status: 500 });
  }
           }
