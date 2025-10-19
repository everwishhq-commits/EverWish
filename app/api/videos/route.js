// app/api/videos/route.js
export const runtime = "nodejs"; // asegura que use Node en Vercel
export const dynamic = "force-dynamic"; // evita cacheos del build

// --- Detecta categoría según el nombre del archivo ---
function detectCategory(name) {
  const s = name.toLowerCase();
  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas")) return "christmas";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("easter")) return "easter";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("mothers")) return "mothers-day";
  if (s.includes("fathers")) return "fathers-day";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("baby")) return "baby";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("getwell")) return "getwell";
  if (s.includes("apology")) return "apology";
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return "pets";
  if (s.includes("newyear")) return "newyear";
  return "general";
}

// --- Endpoint GET ---
export async function GET() {
  // 🔗 URL base del dominio de producción
  const base = "https://everwishs-projects.vercel.app/videos/";

  // 🗂️ Lista de tus archivos dentro de /public/videos/
  const files = [
    "pumpkin_halloween_general.mp4",
    "ghost_halloween_love.mp4",
    "zombie_halloween_birthday.mp4",
    "bunny_easter_general.mp4",
    "turkey_thanksgiving_general.mp4",
    "hugs_anniversary_love.mp4",
    "mother_mothersday_celebration.mp4",
    "turtle_christmas_general_1A.mp4",
    "yeti_christmas_general_1A.mp4",
  ];

  // 📦 Construir objetos por categoría
  const videos = files.map((file) => ({
    title: file.replace(".mp4", "").replace(/_/g, " "),
    src: base + file,
    category: detectCategory(file),
  }));

  // Agrupar por categoría
  const categories = videos.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {});

  // 🧾 Respuesta JSON visible desde /api/videos
  return new Response(JSON.stringify({ categories }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
