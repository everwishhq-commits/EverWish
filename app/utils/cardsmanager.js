import fs from "fs";
import path from "path";

/**
 * Lee automáticamente las tarjetas dentro de /public/cards/
 * y devuelve un arreglo con su información lista para mostrar.
 * También actualiza el /public/top10/ con las más recientes.
 */

export function getAllCards() {
  const cardsDir = path.join(process.cwd(), "public/cards");
  const files = fs.readdirSync(cardsDir);

  return files
    .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
    .map((file) => {
      const filePath = path.join(cardsDir, file);
      const stats = fs.statSync(filePath);
      const name = file.split(".")[0].replace(/_/g, " ");
      const category = name.split("-")[0] || "General";

      return {
        name,
        category,
        image: `/cards/${file}`,
        createdAt: stats.birthtimeMs,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt); // más recientes primero
}

/**
 * Actualiza automáticamente el /public/top10/ con las más recientes
 */
export function updateTop10() {
  const topDir = path.join(process.cwd(), "public/top10");
  const cards = getAllCards().slice(0, 10);

  // limpiar top10
  fs.readdirSync(topDir).forEach((file) => {
    fs.unlinkSync(path.join(topDir, file));
  });

  // copiar las más recientes
  cards.forEach((card) => {
    const srcPath = path.join(process.cwd(), "public", card.image);
    const destPath = path.join(topDir, path.basename(srcPath));
    fs.copyFileSync(srcPath, destPath);
  });

  return cards;
}

/**
 * Busca tarjetas por texto
 */
export function searchCards(query) {
  const all = getAllCards();
  const q = query.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}
