export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

// 🧠 Detecta la categoría por nombre del archivo
function detectCategory(filename) {
  const s = filename.toLowerCase();
  const cats = [];

  if (s.includes("halloween")) cats.push("halloween");
  if (s.includes("christmas") || s.includes("xmas")) cats.push("christmas");
  if (s.includes("easter")) cats.push("easter");
  if (s.includes("valentine") || s.includes("love")) cats.push("valentines");
  if (s.includes("birthday")) cats.push("birthday");
  if (s.includes("mothers")) cats.push("mothers-day");
  if (s.includes("fathers")) cats.push("fathers-day");
  if (s.includes("baby")) cats.push("new-baby");
  if (s.includes("graduation")) cats.push("graduation");
  if (s.includes("wedding")) cats.push("wedding");
  if (s.includes("getwell")) cats.push("getwell");
  if (s.includes("anniversary")) cats.push("anniversary");
  if (s.includes("thanksgiving")) cats.push("thanksgiving");
  if (s.includes("newyear")) cats.push("new-year");
  if (s.includes("autumn") || s.includes("fall")) cats.push("autumn");
  if (s.includes("winter")) cats.push("winter");
  if (s.includes("summer")) cats.push("summer");
  if (s.includes("spring")) cats.push("spring");
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) cats.push("pets");

  return cats.length > 0 ? cats : ["general"];
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");
    if (!fs.existsSync(dir)) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 📁 Cargar archivos .mp4
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mp4"))
      .map((file) => {
        const baseName = path.parse(file).name;
        const title = baseName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const categories = detectCategory(file);

        return {
          title,
          slug: baseName,
          src: `/videos/${file}`,
          categories,
          editUrl: `/edit/${baseName}`,
        };
      });

    // 🧩 Agrupar por categorías (una tarjeta puede pertenecer a varias)
    const grouped = {};
    files.forEach((v) => {
      v.categories.forEach((cat) => {
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(v);
      });
    });

    return new Response(JSON.stringify({ all: files, categories: grouped }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error en /api/videos:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
        }
