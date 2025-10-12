import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");
    const files = await fs.readdir(dir);

    // Filtra solo los archivos MP4
    const videos = files
      .filter((file) => file.toLowerCase().endsWith(".mp4"))
      .map((file) => ({
        title: formatTitle(file),
        src: `/videos/${file}`,
        slug: file.replace(".mp4", "")
      }));

    // Devuelve solo los 10 más recientes
    const latest10 = videos.slice(-10).reverse();

    return new Response(JSON.stringify(latest10), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error reading videos:", err);
    return new Response(JSON.stringify({ error: "Failed to load videos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Convierte el nombre del archivo en un título legible
function formatTitle(name) {
  return name
    .replace(".mp4", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
