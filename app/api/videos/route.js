import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/videos");
    const files = fs.readdirSync(dir);

    // Obtener información de cada archivo
    const videos = files
      .filter((file) => file.toLowerCase().endsWith(".mp4"))
      .map((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        return {
          title: file
            .replace(/_/g, " ")
            .replace(".mp4", "")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          src: `/videos/${file}`,
          slug: file.replace(".mp4", ""),
          date: stats.mtimeMs, // última modificación
        };
      });

    // Ordenar por fecha (recientes primero)
    videos.sort((a, b) => b.date - a.date);

    // Calcular límite de 7 días
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = videos.filter((v) => v.date >= sevenDaysAgo);

    // Si hay menos de 10 recientes, completar con los más antiguos
    const finalList =
      recent.length >= 10
        ? recent.slice(0, 10)
        : [...recent, ...videos.filter((v) => v.date < sevenDaysAgo)].slice(
            0,
            10
          );

    return new Response(JSON.stringify(finalList, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error al leer los videos:", error);
    return new Response(
      JSON.stringify({ error: "No se pudieron cargar los videos" }),
      { status: 500 }
    );
  }
}
