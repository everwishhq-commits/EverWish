// scripts/generateindex.js
import fs from "fs";
import path from "path";

const videosDir = path.join(process.cwd(), "public", "videos");
const outputFile = path.join(videosDir, "index.json");

function generateIndex() {
  if (!fs.existsSync(videosDir)) {
    console.error("❌ Folder /public/videos not found.");
    return;
  }

  const files = [];

  // 🔍 Leer todas las carpetas dentro de /videos (recursivo)
  function readDirRecursive(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDirRecursive(fullPath);
      } else if (/\.(mp4|png|jpg|jpeg|webp|gif)$/i.test(file)) {
        const relative = path.relative(videosDir, fullPath).replace(/\\/g, "/");
        files.push(relative);
      }
    });
  }

  readDirRecursive(videosDir);

  // 🧠 Crear objetos con datos de cada archivo
  const data = files.map((file) => {
    const base = file.replace(/\.[^/.]+$/, ""); // nombre sin extensión
    const name = base
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const tags = base.split(/[_-]/).map((t) => t.toLowerCase());

    return {
      id: base,
      name,
      image: `/videos/${file}`,
      tags,
      color: randomPastel(),
      link: `/categories/${tags[0] || "general"}`,
      type: file.endsWith(".mp4") ? "video" : "image",
    };
  });

  // 💾 Guardar JSON final
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`✅ Generated index.json with ${data.length} items`);
}

// 🎨 Generador de colores pastel aleatorios
function randomPastel() {
  const colors = [
    "#fbcfe8", "#fef3c7", "#bfdbfe", "#c7d2fe",
    "#a7f3d0", "#fcd34d", "#fde68a", "#fecaca",
    "#ddd6fe", "#bae6fd", "#f0abfc", "#f9a8d4",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

generateIndex();
