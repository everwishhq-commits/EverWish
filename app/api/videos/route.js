import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ✅ Usa process.cwd() y NO import.meta.url, pero valida existencia primero
    const filePath = path.join(process.cwd(), "public", "videos", "index.json");

    // Verifica si existe el archivo
    try {
      await fs.access(filePath);
    } catch {
      console.error("❌ No se encontró:", filePath);
      return new Response(
        JSON.stringify({ error: "Archivo index.json no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Lee el contenido del archivo
    const jsonData = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(jsonData);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Error en API /videos:", err);
    return new Response(
      JSON.stringify({
        error: "No se pudo leer index.json",
        details: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
       }
