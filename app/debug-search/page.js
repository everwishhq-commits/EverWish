"use client";
import { useState, useEffect } from "react";

const allCategories = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Diversity & Connection", emoji: "🧩", slug: "diversity-connection" },
  { name: "Sports", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

export default function DebugSearchPage() {
  const [search, setSearch] = useState("zombie");
  const [videos, setVideos] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const data = await res.json();
      setVideos(data.videos || []);
    }
    load();
  }, []);

  const runSearch = () => {
    const q = search.toLowerCase().trim();
    
    // 1. Buscar videos
    const matchingVideos = videos.filter((v) => {
      const searchable = [
        v.name,
        v.object,
        v.subcategory,
        v.category,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return searchable.includes(q);
    });

    // 2. Extraer categorías
    const categoriesSet = new Set();
    const categoryDetails = [];
    
    matchingVideos.forEach((v) => {
      if (v.categories && Array.isArray(v.categories)) {
        v.categories.forEach(cat => {
          categoriesSet.add(cat.toLowerCase());
          categoryDetails.push({
            video: v.name,
            category: cat,
          });
        });
      } else if (v.category) {
        categoriesSet.add(v.category.toLowerCase());
        categoryDetails.push({
          video: v.name,
          category: v.category,
        });
      }
    });

    // 3. Filtrar categorías base
    const matchedCategories = allCategories.filter((cat) => {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      return [...categoriesSet].some((matchCat) => {
        const normalized = matchCat.replace(/&/g, "and").replace(/\s+/g, "-");
        const mcWords = matchCat.toLowerCase().split(/\s+|&/);
        const catWords = catName.toLowerCase().split(/\s+|&/);
        
        if (normalized.includes(catSlug) || catSlug.includes(normalized)) {
          return true;
        }
        
        if (matchCat.includes(catName) || catName.includes(matchCat)) {
          return true;
        }
        
        const hasWordMatch = mcWords.some(word => 
          catWords.some(cw => cw.includes(word) || word.includes(cw))
        );
        
        if (hasWordMatch) {
          return true;
        }
        
        const specialMaps = {
          "seasonal": ["holidays"],
          "celebrations": ["celebrations", "birthdays"],
          "birthdays": ["celebrations"],
        };
        
        for (const [key, values] of Object.entries(specialMaps)) {
          if (matchCat.includes(key) && values.some(v => catName.includes(v) || catSlug.includes(v))) {
            return true;
          }
        }
        
        return false;
      });
    });

    setResults({
      query: q,
      videosFound: matchingVideos,
      categoriesSet: [...categoriesSet],
      categoryDetails,
      filteredCategories: matchedCategories,
    });
  };

  useEffect(() => {
    if (videos.length > 0 && search) {
      runSearch();
    }
  }, [search, videos]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">
        🔍 Debug: Search Analysis
      </h1>

      {/* Input */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <label className="block font-semibold mb-2">Search term:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
          placeholder="e.g., zombie, turtle, love"
        />
        <button
          onClick={runSearch}
          className="mt-3 bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600"
        >
          🔍 Run Search
        </button>
      </div>

      {results && (
        <>
          {/* STEP 1: Videos encontrados */}
          <div className="bg-white rounded-xl p-6 shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              STEP 1: Videos encontrados ({results.videosFound.length})
            </h2>
            {results.videosFound.length === 0 ? (
              <p className="text-red-600 font-semibold">
                ❌ No se encontraron videos con "{results.query}"
              </p>
            ) : (
              <div className="space-y-3">
                {results.videosFound.map((v, i) => (
                  <div key={i} className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <p className="font-bold text-lg">{v.name}</p>
                    <p className="text-sm"><b>Object:</b> {v.object}</p>
                    <p className="text-sm"><b>Category:</b> {v.category}</p>
                    <p className="text-sm"><b>Categories:</b> {JSON.stringify(v.categories)}</p>
                    <p className="text-sm"><b>Subcategory:</b> {v.subcategory}</p>
                    <p className="text-sm"><b>Tags:</b> {v.tags?.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: Categorías detectadas */}
          <div className="bg-white rounded-xl p-6 shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              STEP 2: Categorías detectadas en los videos
            </h2>
            {results.categoriesSet.length === 0 ? (
              <p className="text-red-600 font-semibold">
                ❌ Los videos no tienen categorías
              </p>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-green-600">
                  ✅ {results.categoriesSet.length} categoría(s) única(s):
                </p>
                <ul className="list-disc pl-6">
                  {results.categoriesSet.map((cat, i) => (
                    <li key={i} className="text-sm">
                      <b>"{cat}"</b>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 bg-blue-50 border border-blue-300 rounded p-3">
                  <p className="font-semibold mb-2">Detalles:</p>
                  {results.categoryDetails.map((d, i) => (
                    <p key={i} className="text-xs">
                      • Video <b>{d.video}</b> → Categoría <b>"{d.category}"</b>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Categorías filtradas */}
          <div className="bg-white rounded-xl p-6 shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              STEP 3: Categorías base filtradas ({results.filteredCategories.length})
            </h2>
            
            {results.filteredCategories.length === 0 ? (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <p className="text-red-600 font-bold text-xl mb-2">
                  ❌ PROBLEMA: No se filtraron categorías
                </p>
                <p className="text-sm mb-4">
                  Se detectaron categorías en los videos, pero el filtro no las reconoció.
                </p>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold mb-2">Categorías detectadas:</p>
                  {results.categoriesSet.map((cat, i) => (
                    <p key={i} className="text-sm">• {cat}</p>
                  ))}
                </div>
                <div className="bg-white p-4 rounded mt-3">
                  <p className="font-semibold mb-2">Intentando matchear con:</p>
                  {allCategories.map((cat, i) => (
                    <p key={i} className="text-xs">
                      • <b>{cat.name}</b> (slug: {cat.slug})
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                <p className="text-green-600 font-bold text-xl mb-4">
                  ✅ Categorías encontradas:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {results.filteredCategories.map((cat, i) => (
                    <div key={i} className="bg-white border border-green-300 rounded-lg p-3 text-center">
                      <span className="text-3xl">{cat.emoji}</span>
                      <p className="font-semibold">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.slug}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resultado final */}
          <div className="bg-pink-50 border-2 border-pink-500 rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">
              📊 RESULTADO FINAL
            </h2>
            {results.filteredCategories.length > 0 ? (
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">
                  ✨ Found <span className="text-pink-600">{results.videosFound.length}</span> cards 
                  in <span className="text-pink-600">{results.filteredCategories.length}</span> categories
                </p>
                <p className="text-sm text-gray-600">
                  {results.filteredCategories.map(c => c.name).join(", ")}
                </p>
              </div>
            ) : (
              <p className="text-red-600 font-semibold text-center">
                ❌ No matching categories for "{results.query}"
              </p>
            )}
          </div>
        </>
      )}

      {/* Botón para volver */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = "/"}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
