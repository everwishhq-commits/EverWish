import fs from "fs";
import path from "path";

// 📦 Ruta de datos (para registrar vistas, ventas, reviews)
const dataFile = path.join(process.cwd(), "data", "cards.json");

// Función auxiliar: cargar datos si existen
function loadCardData() {
  try {
    const json = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(json);
  } catch {
    return {}; // Si no existe el archivo, devolver vacío
  }
}

// Guardar el último top generado
let lastTop = [];
let lastUpdate = 0; // timestamp del último refresh

export async function GET() {
  try {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const dir = path.join(process.cwd(), "public/videos");
    const files = fs.readdirSync(dir);
    const cardData = loadCardData();

    // 🔁 Actualizar cada 24 horas
    if (now - lastUpdate > oneDay || lastTop.length === 0) {
      const videos = files
        .filter((f) => f.endsWith(".mp4"))
        .map((file) => {
          const stats = fs.statSync(path.join(dir, file));
          const slug = file.replace(".mp4", "");
          const data = cardData[slug] || {
            views: 0,
            sales: 0,
            reviews: [],
            averageRating: 0,
          };

          const averageRating =
            data.reviews.length > 0
              ? data.reviews.reduce((a, b) => a + b, 0) / data.reviews.length
              : 0;

          return {
            slug,
            src: `/videos/${file}`,
            title: file
              .replace(/_/g, " ")
              .replace(".mp4", "")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            stats: {
              views: data.views,
              sales: data.sales,
              rating: averageRating,
            },
            created: stats.mtime.getTime(),
          };
        });

      // 🧠 Clasificación: ventas > rating > vistas > fecha
      videos.sort((a, b) => {
        const scoreA =
          a.stats.sales * 3 + a.stats.rating * 2 + a.stats.views * 0.5 + a.created / 1e10;
        const scoreB =
          b.stats.sales * 3 + b.stats.rating * 2 + b.stats.views * 0.5 + b.created / 1e10;
        return scoreB - scoreA;
      });

      // Guardar top 10
      lastTop = videos.slice(0, 10);
      lastUpdate = now;
      console.log("✅ Top 10 actualizado automáticamente");
    }

    return new Response(JSON.stringify(lastTop, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error en /api/videos:", err);
    return new Response(
      JSON.stringify({ error: "Error al procesar los videos" }),
      { status: 500 }
    );
  }
            }
