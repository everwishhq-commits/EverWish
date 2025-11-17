"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔥 Categorías base importadas desde config
const BASE_CATEGORIES = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Connection", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

function normalize(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function searchVideos(videos, query) {
  if (!query?.trim()) return videos;
  const n = normalize(query);
  const variations = [n];
  if (n.endsWith('s')) variations.push(n.slice(0, -1));
  else variations.push(n + 's');
  if (n.endsWith('ies')) variations.push(n.slice(0, -3) + 'y');

  return videos.filter(v => {
    const allText = [
      v.name,
      v.object,
      ...(v.categories || []),
      ...(v.subcategories || []),
      ...(v.tags || [])
    ].filter(Boolean).join(" ");

    const normalizedText = normalize(allText);
    return variations.some(variant => normalizedText.includes(variant));
  });
}

function groupByCategory(videos) {
  const grouped = {};
  videos.forEach(video => {
    (video.categories || []).forEach(cat => {
      BASE_CATEGORIES.forEach(baseCat => {
        const normalizedCat = normalize(cat);
        const normalizedBase = normalize(baseCat.slug);
        if (normalizedCat === normalizedBase || normalizedCat.includes(normalizedBase) || normalizedBase.includes(normalizedCat)) {
          if (!grouped[baseCat.slug]) grouped[baseCat.slug] = [];
          if (!grouped[baseCat.slug].some(v => v.name === video.name)) {
            grouped[baseCat.slug].push(video);
          }
        }
      });
    });
  });
  return grouped;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [displayCategories, setDisplayCategories] = useState(BASE_CATEGORIES);
  const [results, setResults] = useState(null);

  // Cargar videos desde el index ya generado
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = data.videos || [];
        setVideos(allVideos);
        console.log(`📦 ${allVideos.length} videos cargados`);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      }
    }
    loadVideos();
  }, []);

  // Actualizar resultados según búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setDisplayCategories(BASE_CATEGORIES);
      setResults(null);
      return;
    }

    const matchedVideos = searchVideos(videos, search);
    const grouped = groupByCategory(matchedVideos);

    const categoriesWithResults = BASE_CATEGORIES
      .map(cat => ({ ...cat, count: grouped[cat.slug]?.length || 0 }))
      .filter(cat => cat.count > 0);

    setDisplayCategories(categoriesWithResults);
    setResults({
      found: matchedVideos.length,
      categoriesCount: categoriesWithResults.length
    });
  }, [search, videos]);

  const handleCategoryClick = (cat) => {
    const url = search.trim()
      ? `/category/${cat.slug}?q=${encodeURIComponent(search)}`
      : `/category/${cat.slug}`;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-2 mt-6">Categories</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Explore all our greeting card categories</p>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search: St Patrick, zombie, turtle..."
            className="w-full px-4 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-center shadow-sm transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="mt-2 text-pink-500 hover:text-pink-600 font-semibold block mx-auto">
              × Clear search
            </button>
          )}
        </div>

        {results && (
          <div className="text-center mb-6">
            {results.found > 0 ? (
              <p className="text-gray-600">
                ✨ Found <span className="font-bold text-pink-600">{results.found}</span> cards 
                in <span className="font-bold text-pink-600">{results.categoriesCount}</span> {results.categoriesCount === 1 ? 'category' : 'categories'}
              </p>
            ) : (
              <p className="text-gray-400">No results for "<span className="font-semibold">{search}</span>"</p>
            )}
          </div>
        )}

        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {displayCategories.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all transform hover:scale-105 relative border-2 border-pink-100 hover:border-pink-300"
              >
                <div className="text-5xl text-center mb-3 animate-bounce-slow">{cat.emoji}</div>
                <div className="text-center font-semibold text-gray-800 text-sm leading-tight">{cat.name}</div>
                {cat.count > 0 && search && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">{cat.count}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg max-w-md mx-auto">
            <p className="text-gray-500 text-lg mb-4">No categories match "<span className="font-semibold">{search}</span>"</p>
            <button onClick={() => setSearch("")} className="text-pink-500 hover:text-pink-600 font-semibold">← Clear search and see all</button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
