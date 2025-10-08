/**
 * Card Manager - versión segura para navegador (Next.js / Vercel)
 * Lee datos desde /data/cards.json y simula las funciones del servidor
 */

export async function getAllCards() {
  try {
    const res = await fetch("/data/cards.json");
    if (!res.ok) throw new Error("Error al cargar las tarjetas");
    const data = await res.json();

    // Ordenar más recientes primero
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error("⚠️ Error getAllCards:", err);
    return [];
  }
}

/**
 * Actualiza el top 10 virtualmente (solo para mostrar en cliente)
 */
export async function updateTop10() {
  const all = await getAllCards();
  return all.slice(0, 10);
}

/**
 * Busca tarjetas por texto (nombre o categoría)
 */
export async function searchCards(query) {
  const all = await getAllCards();
  const q = query.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}
