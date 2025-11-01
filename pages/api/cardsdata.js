import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // 📁 Ruta al archivo JSON
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // 🚫 Si no existe, devuelve error 404
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        error: "index.json no encontrado en /public/cards/",
      });
    }

    // 📖 Leer el archivo y convertirlo a objeto JSON
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    // ✅ Devolver respuesta correcta
    return res.status(200).json({
      ok: true,
      total: json.total || json.videos?.length || 0,
      videos: json.videos || [],
    });
  } catch (error) {
    console.error("❌ Error interno en /api/cardsdata:", error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
