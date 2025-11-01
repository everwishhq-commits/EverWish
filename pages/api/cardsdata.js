import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 📁 Ruta absoluta al JSON
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // 🚫 Verifica que el archivo exista
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        error: "index.json no encontrado en /public/cards/",
      });
    }

    // 📖 Leer y parsear el archivo
    const data = await fs.promises.readFile(filePath, "utf8");
    const json = JSON.parse(data);

    // ✅ Enviar respuesta JSON
    return res.status(200).json({
      ok: true,
      total: json.total || json.videos?.length || 0,
      videos: json.videos || [],
    });
  } catch (error) {
    console.error("❌ Error interno en /api/cardsdata:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Error interno del servidor" });
  }
}
