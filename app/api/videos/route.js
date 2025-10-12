import fs from "fs";
import path from "path";

// 📦 Ruta del archivo con datos de las tarjetas
const dataFile = path.join(process.cwd(), "data", "cards.json");

// 🔹 Función para cargar el JSON de tarjetas
function loadCardData() {
  try {
    const json = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(json);
  } catch (err) {
    console.error("❌ No se pudo leer cards.json:", err);
    return [];
  }
}

// Variables para guardar el Top y evitar recalcular antes de 24 h
let lastTop = [];
let lastUpdate = 0;

export async function GET() {
  try {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Leer carpeta de videos
    const dir = path.join(process.cwd(), "public/videos");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith(".mp4"))
      : [];

    // Cargar datos de cards.json
    const cardData = loadCardData();

    // Solo recalcular si pasaron 24 h o es la primera vez
    if (now - lastUpdate > oneDay || lastTop.length === 0) {
      const cards = cardData.map((card) => {
        // Buscar si existe un video con el mismo slug
        const matchingVideo = files.find((f) =>
          f.startsWith(card.slug)
        );

        // Calcular promedio de reviews
        const avg =
          card.reviews?.length > 0
            ? card.reviews.reduce((a, b) => a + b, 0) /
              card.reviews.length
            : 0;

        // Puntaje para ordenar el Top 10
        const score =
          card.sales * 3 + avg * 2 + card.views * 0.5 +
          new Date(card.createdAt).getTime() / 1e10;

        return {
          ...card,
          averageRating: avg,
          score,
          video: matchingVideo
            ? `/videos/${matchingVideo}`
            : null,
        };
      });

      // Ordenar por score descendente
      cards.sort((a, b) => b.score - a.score);

      // Guardar solo los 10 primeros
      lastTop = cards.slice(0, 10);
      lastUpdate = now;

      console.log("✅ Top 10 actualizado automáticamente");
    }

    return new Response(JSON.stringify(lastTop, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return new Response(
      JSON.stringify({ error: "Error al generar el Top 10" }),
      { status: 500 }
    );
  }
}
