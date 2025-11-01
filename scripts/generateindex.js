import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Asegura compatibilidad en local y en Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Directorio base
const videosDir = path.join(process.cwd(), "public", "videos");
const indexPath = path.join(videosDir, "index.json");

// 🧠 Función que interpreta el nombre del archivo
function parseVideoFilename(filename) {
  const name = filename.replace(".mp4", "");
  const parts = name.split("_");

  return {
    slug: name,
    object: parts[0] || "",
    categories: parts.slice(1, 3).filter(Boolean),
    subcategories: parts.slice(3, 5).filter(Boolean),
    value: parts.pop() || "",
  };
}

// ⚙️ Generar index.json dinámico
function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    console.error("❌ No existe /public/videos");
    return;
  }

  const files = fs.readdirSync(videosDir).filter(f => f.endsWith(".mp4"));

  const videos = files.map(file => {
    const parsed = parseVideoFilename(file);
    return { ...parsed, src: `/videos/${file}` };
  });

  const payload = {
    updatedAt: new Date().toISOString(),
    total: videos.length,
    format: "object_category1_category2_subcategory1_subcategory2_value.mp4",
    videos,
  };

  fs.writeFileSync(indexPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Generado /public/videos/index.json con ${videos.length} videos`);
}

// 🚀 Ejecutar al construir
generateIndex();
