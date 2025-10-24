"use client";
import { useState, useEffect } from "react";
import { searchCards } from "../utils/cardsmanager";
import { getAutocompleteSuggestions } from "../lib/autocomplete_engine";
import ResultsGrid from "./resultsgrid";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Maneja búsqueda principal
  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    // Si hay menos de 2 caracteres, limpiar todo
    if (value.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    // 🪄 Generar sugerencias instantáneas
    const sugg = getAutocompleteSuggestions(value);
    setSuggestions(sugg);

    // ⚙️ Buscar resultados completos
    setLoading(true);
    const found = await searchCards(value);
    setResults(found);
    setLoading(false);
  }

  // 🔁 Cuando seleccionas una sugerencia, la aplica directamente
  async function handleSuggestionClick(s) {
    setQuery(s);
    setSuggestions([]);
    setLoading(true);
    const found = await searchCards(s);
    setResults(found);
    setLoading(false);
  }

  // 🔧 Permite limpiar resultados cuando se borra la búsqueda
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 text-center">
      {/* 🔎 Input principal */}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search cards by name, category or theme..."
        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none"
      />

      {/* 💡 Lista de sugerencias */}
      {suggestions.length > 0 && (
        <ul className="mt-2 text-sm bg-white rounded-xl border border-gray-200 shadow-md text-gray-700 text-left">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-all"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* ⏳ Estado de carga */}
      {loading && (
        <p className="mt-4 text-gray-500 italic animate-pulse">
          Searching for “{query}”...
        </p>
      )}

      {/* 📦 Resultados */}
      {!loading && results.length > 0 && (
        <div className="mt-6">
          <ResultsGrid cards={results} />
        </div>
      )}

      {/* ❌ Sin resultados */}
      {!loading && query.trim().length > 2 && results.length === 0 && (
        <p className="mt-4 text-gray-500">No results found for “{query}” 😕</p>
      )}
    </div>
  );
}
