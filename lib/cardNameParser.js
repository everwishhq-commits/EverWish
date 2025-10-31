// lib/cardNameParser.js

// Formato oficial:
// object_category1_category2_subcategory1_subcategory2_value.mp4
// partes opcionales (puede no haber category2, ni subcategory2, etc.)

export function parseCardFilename(filename) {
  const clean = filename.replace(".mp4", "");
  const parts = clean.split("_");

  const object = parts[0] || "unknown";

  // categorías: pueden ser 0, 1 o 2
  const category1 = parts[1] || null;
  const category2 = parts[2] || null;

  // subcategorías: pueden ser 0, 1 o 2
  const subcategory1 = parts[3] || null;
  const subcategory2 = parts[4] || null;

  // value / variante: último pedazo si existe
  // si el nombre solo tiene 1, 2 o 3 partes, ponemos "1A" por defecto
  const value =
    parts.length >= 6
      ? parts[5]
      : parts.length === 5
      ? parts[4]
      : "1A";

  return {
    slug: clean,
    object,
    categories: [category1, category2].filter(Boolean),
    subcategories: [subcategory1, subcategory2].filter(Boolean),
    value,
  };
}
