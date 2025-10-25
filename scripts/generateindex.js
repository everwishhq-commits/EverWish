/**
 * 📁 Everwish – Universal Video Index Generator
 * ---------------------------------------------
 * ✅ Compatible con Node y Vercel
 * ✅ Usa nombres estandarizados con categorías automáticas
 * ✅ Genera /public/videos/index.json y /public/index.json
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");
const outputFile = path.join(videosDir, "index.json");
const backupFile = path.join(__dirname, "../public/index.json");

function clean(str) {
  return str
    ? str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : "";
}

function parseFilename(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  const parts = name.split("_");
  const object = clean(parts[0] || "");
  const categoryPart = clean(parts[1] || "general");
  const subcategory = clean(parts[2] || "general");
  const variant = clean(parts[3] || "");

  const categoryMap = {
    halloween: "Seasonal & Holidays",
    christmas: "Seasonal & Holidays",
    thanksgiving: "Seasonal & Holidays",
    easter: "Seasonal & Holidays",
    independence: "Seasonal & Holidays",
    newyear: "Seasonal & Holidays",
    july4th: "Seasonal & Holidays",
    birthday: "Birthday",
    anniversary: "Weddings & Anniversaries",
    wedding: "Weddings & Anniversaries",
    love: "Love & Romance",
    valentine: "Love & Romance",
    mother: "Family & Relationships",
    mothersday: "Family & Relationships",
    father: "Family & Relationships",
    fathersday: "Family & Relationships",
    baby: "Babies & Parenting",
    newborn: "Babies & Parenting",
    pet: "Pets & Animal Lovers",
    dog: "Pets & Animal Lovers",
    cat: "Pets & Animal Lovers",
    animal: "Pets & Animal Lovers",
    condolence: "Sympathy & Remembrance",
    sympathy: "Sympathy & Remembrance",
    general: "Everyday",
  };

  const foundCategory = Object.entries(categoryMap).find(([key]) =>
    name.includes(key)
  )?.[1] || "Other";

  return {
    object,
    category: foundCategory,
    subcategory:
      subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase(),
    variant,
  };
}

function generateIndex() {
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => [".mp4", ".webm", ".mov"].some((ext) => f.endsWith(ext)));

  const videos = files.map((file) => {
    const { object, category, subcategory, variant } = parseFilename(file);
    const tags = [object, category, subcategory, variant].filter(Boolean);

    return {
      name: file,
      file: `/videos/${file}`,
      object,
      category,
      subcategory,
      variant,
      tags,
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(videos, null, 2));
  fs.writeFileSync(backupFile, JSON.stringify(videos, null, 2));
  console.log(`✅ index.json generado con ${videos.length} archivos.`);
}

generateIndex();
