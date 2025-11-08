import fs from "fs";
import path from "path";

export async function GET() {
  const videosRoot = path.join(process.cwd(), "public/videos");
  const indexFile = path.join(videosRoot, "index.json");
  
  const debug = {
    videosFolder: {
      exists: fs.existsSync(videosRoot),
      path: videosRoot,
    },
    indexFile: {
      exists: fs.existsSync(indexFile),
      path: indexFile,
    },
    files: [],
    indexContent: null,
  };

  // Listar archivos en /public/videos
  if (fs.existsSync(videosRoot)) {
    try {
      const files = fs.readdirSync(videosRoot);
      debug.files = files.filter(f => f.endsWith('.mp4'));
    } catch (err) {
      debug.filesError = err.message;
    }
  }

  // Leer index.json si existe
  if (fs.existsSync(indexFile)) {
    try {
      const content = fs.readFileSync(indexFile, "utf-8");
      debug.indexContent = JSON.parse(content);
    } catch (err) {
      debug.indexError = err.message;
    }
  }

  return new Response(JSON.stringify(debug, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
