"use client";

import { useState } from "react";
import { searchVideos, groupByCategory } from "@/lib/simple-search";

/**
 * 🔍 COMPONENTE DEBUG TEMPORAL
 * Agrega esto a tu página Categories para ver logs
 */
export default function DebugSearch({ videos }) {
  const [query, setQuery] = useState("zombie");
  const [results, setResults] = useState(null);

  const handleTest = () => {
    console.clear();
    
    const found = searchVideos(videos, query);
    const grouped = groupByCategory(found);
    
    setResults({
      query,
      totalVideos: found.length,
      videos: found.map(v => ({
        name: v.name,
        categories: v.categories,
        subcategories: v.subcategories,
        searchTerms: v.searchTerms,
      })),
      grouped: Object.entries(grouped).map(([cat, vids]) => ({
        category: cat,
        count: vids.length,
      })),
    });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-4 max-w-md z-[9999]">
      <h3 className="font-bold mb-2">🔍 Debug Search</h3>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="zombie, turtle, etc"
        />
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-pink-500 text-white rounded font-semibold"
        >
          Test
        </button>
      </div>

      {results && (
        <div className="max-h-[400px] overflow-y-auto text-xs">
          <div className="mb-3 p-2 bg-green-50 rounded">
            <p className="font-bold">✅ Found: {results.totalVideos} videos</p>
            <p>Categories: {results.grouped.length}</p>
          </div>

          {results.videos.length > 0 ? (
            <>
              <p className="font-bold mb-2">Videos encontrados:</p>
              {results.videos.map((v, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{v.name}</p>
                  <p>📂 {v.categories?.join(", ")}</p>
                  <p>🏷️ {v.subcategories?.join(", ")}</p>
                  <p className="text-gray-500">🔍 {v.searchTerms?.join(", ")}</p>
                </div>
              ))}

              <p className="font-bold mt-3 mb-2">Categorías agrupadas:</p>
              {results.grouped.map((g, i) => (
                <div key={i} className="mb-1 p-2 bg-blue-50 rounded">
                  <p><b>{g.category}</b>: {g.count} videos</p>
                </div>
              ))}
            </>
          ) : (
            <div className="p-3 bg-red-50 rounded">
              <p className="text-red-600 font-bold">❌ No se encontraron videos</p>
              <p className="mt-2">Posibles causas:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>El nombre del archivo no contiene "{query}"</li>
                <li>No se generó el index.json correctamente</li>
                <li>Los videos no se cargaron</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
                }
