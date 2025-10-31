import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Ruta absoluta hacia public/cards/index.json
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    // Si el archivo no existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { videos: [], error: "index.json not found" },
        { status: 200 }
      );
    }

    // Leer el contenido
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Formato seguro: acepta array o { videos: [...] }
    const videos = Array.isArray(data) ? data : data.videos || [];

    // ✅ Devolver JSON correctamente
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en /api/videos:", error);
    return NextResponse.json(
      {
        videos: [],
        error: "Error reading /public/cards/index.json",
        details: String(error),
      },
      { status: 200 } // devolver 200 evita que el build se caiga
    );
  }
}
