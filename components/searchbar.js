"use client";

import { useState, useEffect } from "react";
import { searchCards } from "../utils/cardsmanager";
import ResultsGrid from "./resultsgrid";
import { getAutocompleteSuggestions } from "@/lib/autocomplete_engine";

// 🔠 Capitalizar visualmente (para mostrar sugerencias elegantes)
function capitalizeSuggestion(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

// 🔡 Normalizar texto (quita tildes y convierte a minúsculas)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD") // separa tildes
    .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
}

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🧠 Autocompletado inteligente (usa glosario)
  useEffect(() => {
    const delay = setTimeout(async () => {
      const normalized = normalizeText(query.trim());

      if (normalized.length >= 2) {
        const s = await getAutocompleteSuggestions(normalized);
        const formatted = s.map((txt) => capitalizeSuggestion(txt));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // 🔍 Búsqueda principal
  async function handleSearch(value) {
    const normalizedValue = normalizeText(value.trim());
    if (normalizedValue.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const found = await searchCards(normalizedValue);
    setResults(found);
    setLoading(false);
    setShowSuggestions(false);
  }

  // 🧾 Actualizar texto del input
  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  // 🪄 Clic en sugerencia
  function handleSuggestionClick(suggestion) {
    setQuery(capitalizeSuggestion(suggestion));
    handleSearch(suggestion);
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 text-center">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search cards by name, theme or emotion..."
        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 capitalize"
      />

      {/* 🔮 Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-200 shadow-lg rounded-xl mt-1 w-full max-h-56 overflow-auto z-10 text-left">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 hover:bg-pink-100 cursor-pointer text-gray-700"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* 🔄 Estado de carga */}
      {loading && <p className="mt-4 text-gray-500">Searching...</p>}

      {/* 🎯 Resultados */}
      {!loading && results.length > 0 && (
        <div className="mt-6">
          <ResultsGrid cards={results} />
        </div>
      )}

      {/* ❌ Sin resultados */}
      {!loading && query.length > 2 && results.length === 0 && (
        <p className="mt-4 text-gray-500">No results found 😕</p>
      )}
    </div>
  );
          }
