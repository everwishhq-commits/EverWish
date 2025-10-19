import fs from "fs";
import path from "path";

export async function GET() {
try {
const dir = path.join(process.cwd(), "public/videos");

// ✅ Verifica que exista la carpeta de videos  
if (!fs.existsSync(dir)) {  
  console.warn("⚠️ Carpeta /public/videos no encontrada");  
  return new Response(JSON.stringify([]), {  
    status: 200,  
    headers: { "Content-Type": "application/json" },  
  });  
}  

// 🔹 Lee los archivos MP4 de la carpeta  
const files = fs  
  .readdirSync(dir)  
  .filter((file) => file.endsWith(".mp4"))  
  .map((file) => {  
    const baseName = path.parse(file).name;  
    const title = baseName  
      .replace(/_/g, " ")  
      .replace(/\b\w/g, (c) => c.toUpperCase());  
    return {  
      title,  
      src: `/videos/${file}`,  
      slug: baseName,  
    };  
  });  

// 🔸 Si no hay videos, devuelve un placeholder  
if (files.length === 0) {  
  return new Response(  
    JSON.stringify([  
      {  
        title: "Card Coming Soon ✨",  
        src: "",  
        slug: "placeholder",  
      },  
    ]),  
    {  
      status: 200,  
      headers: { "Content-Type": "application/json" },  
    }  
  );  
}  

// ✅ Devuelve la lista de videos (Top actual)  
return new Response(JSON.stringify(files, null, 2), {  
  status: 200,  
  headers: { "Content-Type": "application/json" },  
});

} catch (error) {
console.error("❌ Error en /api/videos:", error);
return new Response(
JSON.stringify({ error: "Error al cargar videos" }),
{ status: 500 }
);
}
} 

   
