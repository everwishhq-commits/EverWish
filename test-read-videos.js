// test-read-videos.js
import fs from "fs";
import path from "path";

function detectCategory(filename) {
  const s = filename.toLowerCase();
  const cats = [];
  if (s.includes("halloween")) cats.push("halloween");
  if (s.includes("christmas") || s.includes("xmas")) cats.push("christmas");
  if (s.includes("birthday")) cats.push("birthday");
  if (s.includes("love") || s.includes("valentine")) cats.push("valentines");
  if (s.includes("baby")) cats.push("new-baby");
  if (s.includes("wedding")) cats.push("wedding");
  if (s.includes("pets")) cats.push("pets");
  return cats.length > 0 ? cats : ["general"];
}

const dir = path.join(process.cwd(), "public/videos");

if (!fs.existsSync(dir)) {
  console.error("❌ No existe la carpeta public/videos");
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

if (files.length === 0) {
  console.warn("⚠️ No hay archivos .mp4 en public/videos");
} else {
  console.log(`✅ Se encontraron ${files.length} archivos de video:\n`);
  const data = files.map(f => ({
    title: f.replace(".mp4", "").replace(/_/g, " "),
    categories: detectCategory(f),
    path: `/videos/${f}`,
  }));
  console.log(JSON.stringify(data, null, 2));
}
