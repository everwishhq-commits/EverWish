"use client";
import { useState } from "react";
import { searchCards } from "../utils/cardsmanager";
import ResultsGrid from "./resultsgrid";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const found = await searchCards(value);
    setResults(found);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 text-center">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search cards by name or category..."
        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none"
      />

      {loading && <p className="mt-4 text-gray-500">Searching...</p>}

      {!loading && results.length > 0 && (
        <div className="mt-6">
          <ResultsGrid cards={results} />
        </div>
      )}

      {!loading && query.length > 2 && results.length === 0 && (
        <p className="mt-4 text-gray-500">No results found 😕</p>
      )}
    </div>
  );
          }
