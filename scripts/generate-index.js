// scripts/generate-index.js
import fs from "fs";
import path from "path";
import { parseCardFilename } from "../lib/cardNameParser.js";

const cardsDir = path.join(process.cwd(), "public/cards");
const indexPath = path.join(cardsDir, "index.json");

function generateIndex() {
  if (!fs.existsSync(cardsDir)) {
    console.error("❌ No existe /public/cards");
    return;
  }

  // solo los mp4
  const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith(".mp4"));

  const videos = files.map((file) => {
    const parsed = parseCardFilename(file);
    return {
      ...parsed,
      src: `/cards/${file}`,
    };
  });

  const payload = {
    updatedAt: new Date().toISOString(),
    total: videos.length,
    format:
      "object_category1_category2_subcategory1_subcategory2_value.mp4 (los últimos son opcionales)",
    videos,
  };

  fs.writeFileSync(indexPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Generado /public/cards/index.json con ${videos.length} videos`);
}

generateIndex();
