import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/videos");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));

  const videos = files.map(filename => {
    const clean = filename.replace(/\.[^/.]+$/, ""); // quitar extensión .mp4
    const parts = clean.split("_");

    // 🧱 Estructura: object_category_subcategory_value
    const object = parts[0] || "unknown";
    const category = parts[1] || "general";
    const subcategory = parts[2] || "general";
    const value = parts[3] || "1A";

    // 🎯 Detectar categorías cruzadas (una tarjeta puede pertenecer a varias)
    const categories = [];

    // Categorías principales: Holidays / Celebrations / General
    if (
      [
        "halloween",
        "christmas",
        "thanksgiving",
        "easter",
        "independence",
        "newyear",
        "veterans",
        "winter",
        "dayofthedead",
        "labor",
        "memorial",
        "columbus",
      ].some(word => category.includes(word))
    ) {
      categories.push("holidays");
    }

    if (
      [
        "birthday",
        "anniversary",
        "graduation",
        "wedding",
        "promotion",
        "baby",
        "retirement",
        "achievement",
        "hugs",
        "love",
        "mothers",
        "fathers",
      ].some(word => category.includes(word))
    ) {
      categories.push("celebrations");
    }

    if (categories.length === 0) categories.push("general");

    // 🧩 Subcategoría individual
    const subcategories = [subcategory];

    return {
      object,
      src: `/videos/${filename}`,
      categories,
      subcategories,
      value,
      slug: clean,
    };
  });

  return Response.json({ videos });
}
