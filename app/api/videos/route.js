import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "videos", "index.json");

    // 🧩 Verifica existencia
    if (!fs.existsSync(filePath)) {
      console.error("❌ No se encontró index.json en:", filePath);
      return NextResponse.json(
        { error: "index.json no encontrado" },
        { status: 404 }
      );
    }

    // 📦 Leer y parsear
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // ✅ Validar estructura
    if (!data || !Array.isArray(data.videos)) {
      console.warn("⚠️ index.json no contiene 'videos'");
      return NextResponse.json({ videos: [] }, { status: 200 });
    }

    return NextResponse.json({ videos: data.videos }, { status: 200 });
  } catch (error) {
    console.error("❌ Error leyendo index.json:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
