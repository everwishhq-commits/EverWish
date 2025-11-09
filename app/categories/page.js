"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [results, setResults] = useState(null);

  const allCats = [
    { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
    { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
    { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
    { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  ];

  useEffect(() => {
    fetch("/api/videos").then(r => r.json()).then(d => setVideos(d.videos || []));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults(null);
      return;
    }

    // Buscar videos - MUY SIMPLE
    const q = search.toLowerCase();
    const found = videos.filter(v => {
      const text = `${v.name} ${v.object} ${v.category} ${(v.categories || []).join(" ")} ${(v.tags || []).join(" ")}`.toLowerCase();
      // Buscar singular y plural
      return text.includes(q) || text.includes(q + "s") || text.includes(q.slice(0, -1));
    });

    // Extraer categorías
    const cats = new Set();
    found.forEach(v => {
      if (v.categories) v.categories.forEach(c => cats.add(c.toLowerCase()));
      else if (v.category) cats.add(v.category.toLowerCase());
    });

    // Filtrar categorías base
    const filtered = allCats.filter(c => {
      const slug = c.slug.toLowerCase();
      return [...cats].some(cat => cat.includes(slug) || slug.includes(cat) || cat.includes("seasonal") && slug.includes("seasonal") || cat.includes("birthday") && slug.includes("birthday"));
    });

    setResults({ found: found.length, cats: filtered });
  }, [search, videos]);

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <h1 className="text-3xl font-bold text-pink-600 text-center mb-6">Categories</h1>
      
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search: zombie, turtle, love..."
          className="w-full px-4 py-3 rounded-full border-2 text-center"
        />
        {search && <button onClick={() => setSearch("")} className="mt-2 text-pink-500">× Clear</button>}
      </div>

      {results && (
        <p className="text-center mb-6 font-bold">
          {results.found > 0 ? (
            <span className="text-green-600">✨ Found {results.found} cards in {results.cats.length} categories</span>
          ) : (
            <span className="text-gray-500">No results for "{search}"</span>
          )}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {(results ? results.cats : allCats).map((c, i) => {
          const count = search ? videos.filter(v => {
            const text = `${v.name} ${v.object} ${(v.categories || []).join(" ")}`.toLowerCase();
            const q = search.toLowerCase();
            const matches = text.includes(q) || text.includes(q + "s") || text.includes(q.slice(0, -1));
            const inCat = (v.categories || []).some(cat => cat.toLowerCase().includes(c.slug.toLowerCase()));
            return matches && inCat;
          }).length : null;

          return (
            <div
              key={i}
              onClick={() => router.push(`/category/${c.slug}${search ? `?q=${search}` : ""}`)}
              className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg relative"
            >
              <div className="text-5xl text-center mb-2">{c.emoji}</div>
              <div className="text-center font-bold">{c.name}</div>
              {count > 0 && (
                <span className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
        }
