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
  if (s.includes("baby")) return "new-baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("newyear")) return "new-year";
  if (s.includes("autumn") || s.includes("fall")) return "autumn";
  if (s.includes("winter")) return "winter";
  if (s.includes("summer")) return "summer";
  if (s.includes("spring")) return "spring";
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");

    // ✅ Verifica carpeta
    if (!fs.existsSync(dir)) {
      console.warn("⚠️ Carpeta /public/videos no encontrada");
      return new Response(JSON.stringify({ all: [], categories: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔹 Lee los archivos MP4 de la carpeta
    const files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".mp4"))
      .map((file) => {
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
        };
      });

    // 🔸 Agrupa por categoría
    const grouped = files.reduce((acc, video) => {
      if (!acc[video.category]) acc[video.category] = [];
      acc[video.category].push(video);
      return acc;
    }, {});

    // ✅ Devuelve todo organizado
    return new Response(
      JSON.stringify(
        { all: files, categories: grouped, updated: new Date().toISOString() },
        null,
        2
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error en /api/videodata:", error);
    return new Response(
      JSON.stringify({ error: "Error al cargar videos por categorías" }),
      { status: 500 }
    );
  }
  }
