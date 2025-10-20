import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ✅ Lee automáticamente los videos en public/videos
// y genera título, slug y categorías sin romper en producción (Vercel)
export async function GET() {
  try {
    const videoDir = path.join(process.cwd(), "public/videos");

    // ⚠️ Si la carpeta no existe o no tiene permiso
    if (!fs.existsSync(videoDir)) {
      console.warn("⚠️ Folder /public/videos not found on server");
      return NextResponse.json({ all: [], top10: [] });
    }

    // 📂 Filtrar solo archivos .mp4
    const files = fs
      .readdirSync(videoDir)
      .filter((file) => file.toLowerCase().endsWith(".mp4"));

    // 🧠 Mapear datos automáticos
    const videos = files.map((file) => {
      const base = file.replace(".mp4", "");
      const parts = base.split("_");
      const [subject, category1, category2, code] = parts;

      const title = [subject, category1, category2]
        .filter(Boolean)
        .map(capitalize)
        .join(" ");

      return {
        title,
        src: `/videos/${file}`,
        slug: base.toLowerCase(),
        categories: [category1?.toLowerCase(), category2?.toLowerCase()].filter(
          Boolean
        ),
      };
    });

    // 🔁 Ordenar alfabéticamente para estabilidad
    videos.sort((a, b) => a.title.localeCompare(b.title));

    // 🧾 Log temporal para depuración (solo local)
    if (process.env.NODE_ENV !== "production") {
      console.log(`📹 Videos detectados: ${videos.length}`);
    }

    return NextResponse.json({
      all: videos,
      top10: videos.slice(0, 10),
    });
  } catch (error) {
    console.error("❌ Error leyendo /public/videos:", error);
    // 🔁 Retorno seguro, así la app no se congela
    return NextResponse.json({ all: [], top10: [] });
  }
}

// 🔠 Función auxiliar para capitalizar
function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
