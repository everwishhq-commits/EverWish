/**
 * ✨ Everwish Autocomplete Engine
 * Generates smart suggestions from glossary and general emotional vocabulary
 * Works in combination with `/lib/glossary_index.js`
 */

import { searchGlossary } from "./glossary_index.js";

// 🌍 Universal adjectives / modifiers
const universalWords = {
  en: [
    "beautiful", "lovely", "great", "happy", "amazing", "wonderful", "funny",
    "cute", "sweet", "kind", "incredible", "cozy", "peaceful", "magical",
    "colorful", "bright", "warm", "new", "special", "friendly", "playful"
  ],
  es: [
    "hermoso", "lindo", "grande", "feliz", "divertido", "bonito", "especial",
    "nuevo", "dulce", "maravilloso", "tierno", "cariñoso", "tranquilo",
    "colorido", "brillante", "acogedor", "increíble", "amable"
  ]
};

// 💬 Smart combinations depending on detected language
function generateCombinations(word, lang = "en") {
  const base = universalWords[lang] || universalWords.en;
  return base.map((adj) => `${adj} ${word}`);
}

/**
 * 🔮 Main autocomplete function
 * Suggests:
 *  - Related categories
 *  - Related subcategories
 *  - Smart adjective + noun combinations
 */
export async function getAutocompleteSuggestions(term) {
  const q = term.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const isSpanish = /[áéíóúñ]/i.test(q) || q.match(/(el|la|de|para|un|una|y)$/i);

  // 1️⃣ Buscar coincidencias en glosario
  const glossaryResults = await searchGlossary(q);

  // 2️⃣ Extraer categorías y subcategorías relacionadas
  const categoryMatches = glossaryResults.map((r) => ({
    category: r.category,
    subcategories: (r.matches || []).slice(0, 5)
  }));

  // 3️⃣ Crear combinaciones “bonitas” (adjetivo + palabra)
  const smartCombos = generateCombinations(q, isSpanish ? "es" : "en");

  // 4️⃣ Eliminar duplicados y ordenar
  const suggestions = [
    ...new Set([
      ...smartCombos,
      ...categoryMatches.flatMap((c) => [
        c.category.replace(/-/g, " "),
        ...(c.subcategories || [])
      ])
    ])
  ];

  // 5️⃣ Priorizar relevancia (empieza por coincidencia directa)
  const ordered = suggestions
    .filter((s) => s.length <= 50)
    .sort((a, b) => (a.includes(q) ? -1 : b.includes(q) ? 1 : 0));

  return ordered.slice(0, 20);
}

/**
 * 💡 Example usage:
 * 
 * import { getAutocompleteSuggestions } from "@/lib/autocomplete_engine";
 * 
 * const suggestions = await getAutocompleteSuggestions("perro");
 * console.log(suggestions);
 * 
 * // → ["lindo perro", "gran perro", "pets animal lovers", "pet birthday", "family pets", ...]
 */
