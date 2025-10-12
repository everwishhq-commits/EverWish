import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/videos");
  const files = fs.readdirSync(dir);

  // Solo MP4
  const videos = files
    .filter(file => file.endsWith(".mp4"))
    .map(file => ({
      title: formatTitle(file),
      src: `/videos/${file}`,
      slug: file.replace(".mp4", "")
    }));

  return new Response(JSON.stringify(videos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function formatTitle(name) {
  return name
    .replace(".mp4", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
