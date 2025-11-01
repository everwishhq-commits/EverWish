import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // 🚀 asegura que no se cachee

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cards", "index.json");

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ ok: false, error: "index.json no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await fs.promises.readFile(filePath, "utf8");
    const json = JSON.parse(data);

    return new Response(
      JSON.stringify({
        ok: true,
        total: json.total || json.videos?.length || 0,
        videos: json.videos || [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error interno en /api/cardsdata:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
