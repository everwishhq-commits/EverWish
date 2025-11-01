import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Asegura que funcione tanto en local como en Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsDir = path.join(process.cwd(), "public", "cards");
const indexPath = path.join(cardsDir, "index.json");

// 🧠 Función que interpreta el nombre del archivo
function parseCardFilename(filename) {
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

function generateIndex() {
  if (!fs.existsSync(cardsDir)) {
    console.error("❌ No existe /public/videos");
    return;
  }

  const files = fs.readdirSync(cardsDir).filter(f => f.endsWith(".mp4"));

  const videos = files.map(file => {
    const parsed = parseCardFilename(file);
    return { ...parsed, src: `/cards/${file}` };
  });

  const payload = {
    updatedAt: new Date().toISOString(),
    total: videos.length,
    format: "object_category1_category2_subcategory1_subcategory2_value.mp4",
    videos,
  };

  fs.writeFileSync(indexPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Generado /public/cards/index.json con ${videos.length} videos`);
}

generateIndex();
