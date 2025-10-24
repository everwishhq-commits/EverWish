"use client";
import { useState, useEffect } from "react";
import ResultsGrid from "./resultsgrid";
import { getAutocompleteSuggestions } from "../lib/autocomplete_engine";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indexData, setIndexData] = useState([]);

  // 📥 Cargar el index.json una sola vez
  useEffect(() => {
    async function loadIndex() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setIndexData(data);
      } catch (err) {
        console.error("❌ Error cargando index.json:", err);
      }
    }
    loadIndex();
  }, []);

  // 🔍 Maneja búsqueda principal
  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    // Si hay menos de 2 letras, limpiar resultados
    if (value.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    // 🪄 Generar sugerencias predictivas
    const sugg = getAutocompleteSuggestions(value);
    setSuggestions(sugg);

    // ⚙️ Búsqueda en index.json
    setLoading(true);
    const searchTerm = value.toLowerCase();

    const found = indexData.filter((item) => {
      const text = [
        item.object,
        ...(item.categories || []),
        item.category,
        item.subcategory,
        item.variant,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(searchTerm);
    });

    // Ordenar relevancia (coincidencia exacta primero)
    const sorted = found.sort((a, b) => {
      const aExact = a.object === searchTerm;
      const bExact = b.object === searchTerm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.object.localeCompare(b.object);
    });

    setResults(sorted);
    setLoading(false);
  }

  // 🪄 Seleccionar sugerencia directa
  async function handleSuggestionClick(s) {
    setQuery(s);
    setSuggestions([]);
    setLoading(true);

    const found = indexData.filter((item) => {
      const text = [
        item.object,
        ...(item.categories || []),
        item.category,
        item.subcategory,
        item.variant,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(s.toLowerCase());
    });

    setResults(found);
    setLoading(false);
  }

  // 🔧 Limpieza cuando no hay texto
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
          <ResultsGrid cards={results.slice(0, 20)} /> {/* Limita a 20 resultados */}
        </div>
      )}

      {/* ❌ Sin resultados */}
      {!loading && query.trim().length > 2 && results.length === 0 && (
        <p className="mt-4 text-gray-500">No results found for “{query}” 😕</p>
      )}
    </div>
  );
        }
