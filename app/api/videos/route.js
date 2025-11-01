import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // evita cache en Vercel

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "videos", "index.json");

    // ⚠️ Si el archivo no existe
    if (!fs.existsSync(filePath)) {
      console.error("❌ No se encontró index.json en:", filePath);
      return new Response(
        JSON.stringify({ error: "index.json no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 📦 Leer contenido
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(jsonData);

    // ✅ Validar estructura
    const videos = Array.isArray(parsed.videos)
      ? parsed.videos
      : Array.isArray(parsed)
      ? parsed
      : [];

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error en /api/videos:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
