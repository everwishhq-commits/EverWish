"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchCards } from "../utils/cardsmanager";
import ResultsGrid from "./resultsgrid";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Pequeño “debounce” para no llamar API en cada letra
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const found = await searchCards(query);
        setResults(found);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 text-center">
      {/* 🔍 Campo de búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards by name, category or theme..."
          className="w-full p-3 pl-11 rounded-full border border-pink-200 shadow-sm 
                     focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none 
                     text-gray-700 placeholder-gray-400 transition-all duration-200"
        />
        <span className="absolute left-4 top-3.5 text-pink-400 text-xl">🔍</span>
      </div>

      {/* 🔄 Estado de carga */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-500"
        >
          Searching...
        </motion.p>
      )}

      {/* 🎴 Resultados */}
      <AnimatePresence>
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <ResultsGrid cards={results} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 😕 Sin resultados */}
      {!loading && query.length > 2 && results.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-500 italic"
        >
          No results found 😕
        </motion.p>
      )}
    </div>
  );
                   }
