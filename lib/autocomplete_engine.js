/**
 * ✨ Everwish Autocomplete Engine
 * Genera sugerencias rápidas desde /public/videos/index.json
 * Basado en coincidencias con categorías, subcategorías, objetos y tags.
 */

import fs from "fs";
import path from "path";

// 📂 Carga el índice principal (solo una vez)
const indexPath = path.join(process.cwd(), "public/videos/index.json");
let cardsIndex = [];

try {
  const data = fs.readFileSync(indexPath, "utf-8");
  cardsIndex = JSON.parse(data);
  console.log(`⚡ AutocompleteEngine cargó ${cardsIndex.length} registros`);
} catch (err) {
  console.error("⚠️ No se pudo cargar /public/videos/index.json:", err);
  cardsIndex = [];
}

// 🔤 Normalización básica
function normalize(text) {
  return text
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()
    : "";
}

/**
 * 🔍 Genera sugerencias en tiempo real
 * @param {string} query - texto que el usuario escribe
 * @param {number} limit - número máximo de sugerencias
 * @returns {Array<string>} lista de sugerencias
 */
export function getAutocompleteSuggestions(query, limit = 15) {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = normalize(query);
  const suggestions = new Set();

  for (const card of cardsIndex) {
    const fields = [
      card.object,
      card.category,
      card.subcategory,
      ...(card.tags || []),
    ];

    for (const field of fields) {
      const normalizedField = normalize(field);
      if (normalizedField.startsWith(normalizedQuery)) {
        suggestions.add(field);
      } else if (normalizedField.includes(normalizedQuery)) {
        suggestions.add(field);
      }

      if (suggestions.size >= limit) break;
    }
  }

  return Array.from(suggestions).slice(0, limit);
}

/**
 * 🪄 Obtener grupos de sugerencias (por categoría)
 * Devuelve un objeto agrupado por categoría principal.
 */
export function getGroupedSuggestions(query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return {};

  const grouped = {};

  for (const card of cardsIndex) {
    const fields = [
      card.object,
      card.category,
      card.subcategory,
      ...(card.tags || []),
    ];

    const hasMatch = fields.some((field) =>
      normalize(field).includes(normalizedQuery)
    );

    if (hasMatch) {
      const cat = card.category || "Other";
      if (!grouped[cat]) grouped[cat] = new Set();
      grouped[cat].add(card.object || card.name);
    }
  }

  // Convierte los Sets a arrays
  const result = {};
  for (const [cat, items] of Object.entries(grouped)) {
    result[cat] = Array.from(items).slice(0, 5);
  }

  return result;
        }
