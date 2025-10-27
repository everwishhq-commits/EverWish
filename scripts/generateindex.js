/**
 * 🔮 everwish smart index generator
 * busca todos los .mp4 en /public/videos/** y crea /public/videos/index.json
 */

import fs from "fs";
import path from "path";

const videos_root = path.join(process.cwd(), "public/videos");
const index_file = path.join(videos_root, "index.json");

// 🔍 busca todos los archivos .mp4 recursivamente
function get_all_mp4_files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const full_path = path.join(dir, entry.name);
    return entry.isDirectory()
      ? get_all_mp4_files(full_path)
      : entry.name.toLowerCase().endsWith(".mp4")
      ? [full_path]
      : [];
  });
}

// ✨ normaliza texto
const normalize = (str) =>
  str?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

// 🧩 genera index.json
function generate_index() {
  if (!fs.existsSync(videos_root)) {
    console.error("⚠️ no existe la carpeta public/videos/");
    return;
  }

  const files = get_all_mp4_files(videos_root);
  const data = files.map((file_path) => {
    const relative = path.relative(videos_root, file_path).replace(/\\/g, "/");
    const base = path.basename(file_path, ".mp4");
    const parts = base.split("_");

    const object = normalize(parts[0] || "unknown");
    const category = normalize(parts[1] || "general");
    const subcategory = normalize(parts[2] || "general");

    return {
      name: base,
      file: `/videos/${relative}`,
      object,
      category,
      subcategory,
      slug: base.toLowerCase().replace(/\s+/g, "-"),
      tags: [object, category, subcategory].filter(Boolean),
    };
  });

  fs.writeFileSync(index_file, JSON.stringify({ videos: data }, null, 2));
  console.log(`✅ index.json actualizado con ${data.length} archivos.`);
}

generate_index();
