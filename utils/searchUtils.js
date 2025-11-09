/**
 * 🔍 UTILIDAD DE BÚSQUEDA INTELIGENTE
 * Normaliza texto para búsquedas flexibles
 */

/**
 * Normaliza un texto para búsqueda
 * - Minúsculas
 * - Sin acentos
 * - Sin espacios extras
 * - Singular y plural
 */
export function normalizeForSearch(text) {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, " ") // Espacios múltiples → uno solo
    .trim();
}

/**
 * Convierte palabra a singular (simple)
 */
export function toSingular(word) {
  const normalized = normalizeForSearch(word);
  
  // Reglas simples de plurales en inglés y español
  if (normalized.endsWith("ies")) {
    return normalized.slice(0, -3) + "y"; // zombies → zombie (no aplica aquí)
  }
  if (normalized.endsWith("es")) {
    return normalized.slice(0, -2); // houses → hous (no perfecto pero funciona)
  }
  if (normalized.endsWith("s") && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1); // zombies → zombie
  }
  
  return normalized;
}

/**
 * Genera variaciones de una palabra
 */
export function getSearchVariations(word) {
  const normalized = normalizeForSearch(word);
  const variations = new Set([normalized]);
  
  // Agregar singular
  const singular = toSingular(normalized);
  variations.add(singular);
  
  // Agregar plural simple
  if (!normalized.endsWith("s")) {
    variations.add(normalized + "s");
  }
  
  // Agregar plural -es
  if (!normalized.endsWith("es")) {
    variations.add(normalized + "es");
  }
  
  return [...variations];
}

/**
 * Verifica si un texto contiene la búsqueda (flexible)
 */
export function matchesSearch(text, searchTerm) {
  if (!text || !searchTerm) return false;
  
  const normalizedText = normalizeForSearch(text);
  const variations = getSearchVariations(searchTerm);
  
  // Buscar cualquier variación
  return variations.some(v => normalizedText.includes(v));
}

/**
 * Verifica si un array de strings contiene la búsqueda
 */
export function matchesSearchInArray(array, searchTerm) {
  if (!array || !Array.isArray(array)) return false;
  return array.some(item => matchesSearch(item, searchTerm));
}

/**
 * Busca en objeto completo de video
 */
export function videoMatchesSearch(video, searchTerm) {
  if (!video || !searchTerm) return false;
  
  const searchableFields = [
    video.name,
    video.object,
    video.subcategory,
    video.category,
    ...(video.categories || []),
    ...(video.tags || []),
  ].filter(Boolean);
  
  return searchableFields.some(field => matchesSearch(field, searchTerm));
}
