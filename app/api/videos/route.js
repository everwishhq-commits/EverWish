import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/videos");
  let videos = [];

  try {
    // Leer archivos del directorio
    const files = fs.readdirSync(dir);

    // Filtrar solo .mp4
    videos = files
      .filter((file) => file.toLowerCase().endsWith(".mp4"))
      .map((file) => {
        try {
          // Separar el nombre y partes del archivo
          const base = path.basename(file, ".mp4");
          const parts = base.split("_");

          // Evitar errores en archivos mal nombrados
          if (parts.length < 3) {
            console.warn(`⚠️ Archivo ignorado (formato inválido): ${file}`);
            return null;
          }

          // Crear título legible
          const title = parts
            .slice(0, -1)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");

          // Categorías derivadas
          const categories = parts
            .filter(
              (p) =>
                !/\d/.test(p) &&
                p !== "1A" &&
                p !== "A1" &&
                p.toLowerCase() !== "general"
            )
            .map((p) => p.toLowerCase());

          // Agregar siempre “general” y “everyday” por compatibilidad
          if (!categories.includes("general")) categories.push("general");
          if (!categories.includes("everyday")) categories.push("everyday");

          return {
            title,
            src: `/videos/${file}`,
            slug: base,
            categories,
          };
        } catch (err) {
          console.error(`❌ Error al procesar archivo: ${file}`, err);
          return null;
        }
      })
      .filter(Boolean);
  } catch (err) {
    console.error("❌ Error leyendo /public/videos:", err);
  }

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
                }
