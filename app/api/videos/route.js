import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { loadGlossary } from "@/lib/classification-system";

export async function GET() {
  try {
    const indexPath = path.join(process.cwd(), "public/videos/index.json");
    
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json(
        { error: "index.json not found", videos: [] },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(indexPath, "utf-8");
    const data = JSON.parse(content);
    
    // 🧠 CARGAR GLOSARIO si existe
    if (data.glossary) {
      loadGlossary(data.glossary);
      console.log(`📚 Glosario cargado con ${Object.keys(data.glossary).length} objetos`);
    }
    
    console.log(`✅ API responded with ${data.videos?.length || 0} videos`);
    
    return NextResponse.json(
      { 
        videos: data.videos || [],
        glossary: data.glossary || {} // Incluir para debugging
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
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
