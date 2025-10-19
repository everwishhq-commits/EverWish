export const runtime = "nodejs"; // 🔧 Fuerza el uso de Node.js en Vercel
export const dynamic = "force-dynamic";

import { readdirSync, existsSync } from "fs";
import { join, parse } from "path";

function detectCategory(name) {
  const s = name.toLowerCase();
  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas")) return "christmas";
  if (s.includes("easter")) return "easter";
  if (s.includes("valentine")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("mothers")) return "mothers-day";
  if (s.includes("fathers")) return "fathers-day";
  if (s.includes("baby")) return "baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("newyear")) return "newyear";
  if (s.includes("autumn") || s.includes("fall")) return "autumn";
  if (s.includes("winter")) return "winter";
  if (s.includes("summer")) return "summer";
  if (s.includes("spring")) return "spring";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

export async function GET() {
  try {
    const dir = join(process.cwd(), "public/videos");
    if (!existsSync(dir)) {
      return new Response(JSON.stringify({ categories: {} }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = readdirSync(dir).filter((f) => f.endsWith(".mp4"));
    const videos = files.map((file) => ({
      title: parse(file).name,
      src: `/videos/${file}`,
      category: detectCategory(file),
    }));

    const categories = videos.reduce((acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category].push(v);
      return acc;
    }, {});

    return new Response(JSON.stringify({ categories }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ Error leyendo videos:", e);
    return new Response(
      JSON.stringify({ error: "Error leyendo videos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
