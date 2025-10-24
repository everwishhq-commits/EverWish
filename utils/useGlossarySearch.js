/**
 * 🧠 useGlossarySearch.js
 * 
 * Conecta el buscador con /public/data/glossary.json
 * Devuelve coincidencias semánticas entre palabras del usuario,
 * categorías, subcategorías y palabras del glosario.
 */

import { useEffect, useState } from "react";

export default function useGlossarySearch(query) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setMatches([]);
      return;
    }

    async function search() {
      setLoading(true);
      try {
        const res = await fetch("/data/glossary.json", { cache: "no-store" });
        const glossary = await res.json();
        const q = query.toLowerCase();

        const results = [];

        for (const [category, info] of Object.entries(glossary)) {
          const found = info.keywords.some(
            (word) => word.toLowerCase().includes(q)
          );

          if (found) {
            results.push({
              category,
              priority: info.priority || 1,
              matchedWord: q
            });
          }
        }

        // 🔹 Ordena por prioridad para mostrar las coincidencias más relevantes
        results.sort((a, b) => b.priority - a.priority);
        setMatches(results);
      } catch (err) {
        console.error("❌ Error loading glossary.json:", err);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [query]);

  return { matches, loading };
}
