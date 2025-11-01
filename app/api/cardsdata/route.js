// ✅ Forzamos entorno de ejecución dinámico (evita prerender)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 👇 El código se ejecuta SOLO cuando se llama GET
export async function GET() {
  try {
    // Ruta absoluta del archivo index.json
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // Verificar que exista
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "index.json no encontrado" },
        { status: 404 }
      );
    }

    // Leer y parsear
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    // Responder
    return NextResponse.json({
      ok: true,
      total: json.videos?.length || 0,
      videos: json.videos || [],
    });
  } catch (err) {
    console.error("❌ Error interno en /api/cardsdata:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
