import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/top10");
  const files = fs.readdirSync(dir);

  // Solo imágenes
  const images = files
    .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
    .map(file => `/top10/${file}`);

  return new Response(JSON.stringify(images), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
