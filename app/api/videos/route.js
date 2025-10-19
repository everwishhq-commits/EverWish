import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/videos");

  if (!fs.existsSync(dir)) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const files = fs.readdirSync(dir);
  const videos = files
    .filter((f) => f.endsWith(".mp4"))
    .map((file) => ({
      title: file.replace(".mp4", ""),
      src: `/videos/${file}`,
      editUrl: `/edit/${file.replace(".mp4", "")}`,
    }));

  // Clasificación básica por palabra clave
  const categories = {};
  videos.forEach((v) => {
    const s = v.title.toLowerCase();
    let category = "general";
    if (s.includes("halloween")) category = "halloween";
    else if (s.includes("christmas") || s.includes("xmas")) category = "christmas";
    else if (s.includes("valentine") || s.includes("love")) category = "valentines";
    else if (s.includes("birthday")) category = "birthday";
    else if (s.includes("mothers")) category = "mothers-day";
    else if (s.includes("fathers")) category = "fathers-day";
    else if (s.includes("baby")) category = "new-baby";
    else if (s.includes("graduation")) category = "graduation";
    else if (s.includes("wedding")) category = "wedding";
    else if (s.includes("anniversary")) category = "anniversary";

    if (!categories[category]) categories[category] = [];
    categories[category].push(v);
  });

  return new Response(JSON.stringify({ all: videos, categories }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
