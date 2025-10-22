/**
 * 📂 /scripts/generateindex.js
 * Genera un index.json con categorías y subcategorías
 */

import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public/videos");
const outputFile = path.join(videosDir, "index.json");

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    console.error("❌ No existe la carpeta /public/videos");
    return;
  }

  const files = getFilesRecursively(videosDir);
  const data = files
    .filter((f) => /\.(mp4|jpg|jpeg|png|webp)$/i.test(f))
    .map((filePath) => {
      const relativePath = path.relative("public", filePath).replace(/\\/g, "/");

      const base = path.basename(filePath, path.extname(filePath));
      const parts = base.split("_"); // Ejemplo: zombie_halloween_birthday_1a

      const name = parts.join(" ");
      const tags = parts.map((p) => p.toLowerCase());
      const categories = parts
        .slice(1, -1) // ignora nombre principal y sufijo (1a, 1b)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1));

      return {
        name,
        file: `/${relativePath}`,
        tags,
        categories,
      };
    });

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`✅ index.json generado con ${data.length} elementos.`);
}

generateIndex();
