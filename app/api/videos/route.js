export const dynamic = "force-dynamic"; 
// ⬆️ Evita prerender estático y elimina TODOS los warnings de Next/Vercel

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    // Ruta al index generado
    const indexFile = path.join(process.cwd(), "public/videos/index.json");

    // Comprobar existencia usando promises (no bloquea)
    try {
      await fs.access(indexFile);
    } catch {
      return NextResponse.json(
        { error: "Index file missing", videos: [] },
        { status: 404 }
      );
    }

    // Leer contenido del JSON
    const rawData = await fs.readFile(indexFile, "utf8");
    const indexData = JSON.parse(rawData);

    // Respuesta limpia y dinámica
    return NextResponse.json(
      { videos: indexData.videos },
      {
        headers: {
          "Cache-Control": "no-store" // evita caching estático en Vercel
        }
      }
    );

  } catch (err) {
    console.error("❌ Error in /api/videos:", err);
    return NextResponse.json(
      { error: err.message, videos: [] },
      { status: 500 }
    );
  }
}
