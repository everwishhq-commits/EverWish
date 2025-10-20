import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 📁 Ruta absoluta a la carpeta "public/videos"
    const videosDir = path.join(process.cwd(), "public", "videos");

    // 🧩 Buscar todos los archivos que terminen en .mp4
    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

    // 🔁 Convertir cada archivo en objeto con datos útiles
    const videos = files.map((file) => {
      const name = file.replace(".mp4", ""); // Quita extensión
      const parts = name.split("_"); // Divide por guiones bajos (_)
      const title = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
      const categories = parts.slice(1, -1); // Todo menos el primero y el último (por ejemplo "_1A")

      return {
        title,
        src: `/videos/${file}`,
        slug: name,
        categories,
      };
    });

    // 🧾 Respuesta JSON lista
    return new Response(JSON.stringify({ all: videos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error loading videos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load videos" }),
      { status: 500 }
    );
  }
}
