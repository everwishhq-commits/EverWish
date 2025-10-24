/**
 * 🧭 Everwish Card Search Manager
 * Conecta el buscador con /public/videos/index.json
 * Permite búsquedas por nombre, categoría, subcategoría o tags
 * Ignora tildes, mayúsculas y espacios extras.
 */

import path from "path";
import fs from "fs";

// 🧩 Normaliza texto (quita tildes, pasa a minúsculas)
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

// 📚 Carga index.json (una sola vez)
let allCards = [];
const indexPath = path.join(process.cwd(), "public/videos/index.json");

try {
  const data = fs.readFileSync(indexPath, "utf-8");
  allCards = JSON.parse(data);
  console.log(`📂 CardsManager cargó ${allCards.length} tarjetas desde index.json`);
} catch (err) {
  console.error("⚠️ No se pudo cargar el archivo de índice:", err);
  allCards = [];
}

/**
 * 🔍 Buscar tarjetas (searchbar)
 * @param {string} query - texto introducido por el usuario
 * @returns {Array} resultados filtrados
 */
export async function searchCards(query) {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = normalize(query);
  const keywords = normalizedQuery.split(/\s+/);

  // 🔎 Filtra tarjetas según coincidencias
  const results = allCards.filter((card) => {
    const searchable = [
      card.name,
      card.object,
      card.category,
      card.subcategory,
      ...(card.tags || []),
    ]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // ✅ Coincide si todas las palabras están presentes
    return keywords.every((word) => searchable.includes(word));
  });

  // 📊 Ordena por relevancia (más coincidencias primero)
  const ranked = results.sort((a, b) => {
    const score = (text) =>
      keywords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    const aScore = score(JSON.stringify(a).toLowerCase());
    const bScore = score(JSON.stringify(b).toLowerCase());
    return bScore - aScore;
  });

  return ranked;
}

/**
 * 🪄 Sugerencias inteligentes
 * Devuelve sugerencias cortas (para autocomplete)
 */
export async function getSuggestions(prefix) {
  if (!prefix || prefix.trim().length < 2) return [];
  const normalizedPrefix = normalize(prefix);

  const suggestions = new Set();

  for (const card of allCards) {
    const fields = [
      card.object,
      card.category,
      card.subcategory,
      ...(card.tags || []),
    ];

    for (const f of fields) {
      const normalized = normalize(f);
      if (normalized.startsWith(normalizedPrefix)) {
        suggestions.add(f);
      }
    }

    if (suggestions.size > 20) break; // limitar sugerencias
  }

  return Array.from(suggestions).slice(0, 20);
                      }
