import fs from "fs";
import path from "path";

/**
 * 🧠 Detecta la categoría por el nombre del archivo
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

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");

    // ✅ Verifica que exista la carpeta de videos  
    if (!fs.existsSync(dir)) {
      console.warn("⚠️ Carpeta /public/videos no encontrada");
      return new Response(JSON.stringify([]), {
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
          category, // 👈 Nueva propiedad automática
        };
      });

    // 🔸 Si no hay videos, devuelve un placeholder  
    if (files.length === 0) {
      return new Response(
        JSON.stringify([
          { title: "Card Coming Soon ✨", src: "", slug: "placeholder" },
        ]),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Devuelve la lista de videos (misma estructura plana)
    return new Response(JSON.stringify(files, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return new Response(
      JSON.stringify({ error: "Error al cargar videos" }),
      { status: 500 }
    );
  }
          }
