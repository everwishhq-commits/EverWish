"use client";
import { useState, useEffect } from "react";
import { searchCards } from "../utils/cardsmanager";
import ResultsGrid from "./resultsgrid";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🔍 SearchBar
 * Búsqueda dinámica de tarjetas Everwish por nombre, categoría o tags.
 */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 🕒 Debounce: evita llamadas excesivas
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // 🔎 Ejecuta búsqueda cuando cambia el valor final (debounced)
  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const found = await searchCards(debouncedQuery);
        setResults(found);
      } catch (err) {
        console.error("❌ Error searching cards:", err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  return (
    <section className="w-full max-w-2xl mx-auto mb-12 text-center">
      {/* ✨ Input de búsqueda */}
      <motion.input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards by name, category, or theme..."
        className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
        whileFocus={{ scale: 1.02 }}
      />

      {/* Estado de carga */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-500"
        >
          Searching...
        </motion.p>
      )}

      {/* Resultados */}
      <AnimatePresence>
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <ResultsGrid cards={results} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sin resultados */}
      {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-gray-500 text-sm"
        >
          No results found 😕
        </motion.p>
      )}
    </section>
  );
}
