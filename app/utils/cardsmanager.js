/**
 * 🪄 Card Manager - versión compatible con navegador y Vercel
 * Lee datos desde /data/cards.json con ruta absoluta o relativa según el entorno
 */

export async function getAllCards() {
  try {
    const base =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL || "https://everwish.vercel.app"
        : "";

    const res = await fetch(`${base}/data/cards.json`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al cargar tarjetas (${res.status})`);
    const data = await res.json();

    // 🔄 Ordenar las tarjetas más recientes primero
    return Array.isArray(data)
      ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
  } catch (err) {
    console.error("⚠️ Error getAllCards:", err);
    return [];
  }
}

/**
 * 🔝 Devuelve las 10 tarjetas más recientes
 */
export async function updateTop10() {
  const all = await getAllCards();
  return all.slice(0, 10);
}

/**
 * 🔍 Busca tarjetas por nombre o categoría
 */
export async function searchCards(query) {
  const all = await getAllCards();
  const q = query.toLowerCase();
  return all.filter(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
  );
}
