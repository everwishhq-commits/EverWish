import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // ✅ evita el cache

export async function GET() {
  try {
    // 📦 Usa URL basada en import.meta.url (funciona en Vercel)
    const fileUrl = new URL("../../../../public/videos/index.json", import.meta.url);
    const filePath = fileUrl.pathname;

    // 🧩 Leer el archivo (manejo correcto en serverless)
    const jsonData = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(jsonData);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error leyendo /public/videos/index.json:", err.message);
    return new Response(JSON.stringify({ error: "No se pudo leer index.json", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
