"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_CATEGORIES } from "@/lib/categories-config";

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [displayCategories, setDisplayCategories] = useState(BASE_CATEGORIES);

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

  // Actualizar categorías según búsqueda
  useEffect(() => {
    if (!search.trim()) {
      // ✅ SIN BÚSQUEDA: Mostrar TODAS las categorías
      setDisplayCategories(BASE_CATEGORIES);
      return;
    }

    const q = search.toLowerCase().trim();

    // ✅ CON BÚSQUEDA: Filtrar videos que coincidan
    const matchedVideos = videos.filter(video => {
      const searchable = [
        video.name,
        video.object,
        ...(video.categories || []),
        ...(video.subcategories || []),
        ...(video.searchTerms || []),
      ].filter(Boolean).join(" ").toLowerCase();
      
      return searchable.includes(q);
    });

    if (matchedVideos.length === 0) {
      setDisplayCategories([]);
      return;
    }

    // ✅ FILTRAR CATEGORÍAS: Solo mostrar la categoría EXACTA
    const matchedCategories = new Set();
    
    matchedVideos.forEach(video => {
      if (video.subcategories) {
        video.subcategories.forEach(sub => {
          // Si la subcategoría coincide EXACTAMENTE con la búsqueda
          if (sub.toLowerCase() === q) {
            video.categories?.forEach(cat => matchedCategories.add(cat));
          }
        });
      }
    });

    // Si no hay coincidencia exacta en subcategorías, buscar en categorías
    if (matchedCategories.size === 0) {
      matchedVideos.forEach(video => {
        video.categories?.forEach(cat => {
          if (cat.toLowerCase().includes(q)) {
            matchedCategories.add(cat);
          }
        });
      });
    }

    // Filtrar solo las categorías que coinciden
    const filtered = BASE_CATEGORIES.filter(cat => 
      matchedCategories.has(cat.slug)
    );

    setDisplayCategories(filtered.length > 0 ? filtered : []);
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
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-2 mt-6">
          Categories
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Explore all our greeting card categories
        </p>

        {/* Buscador */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search: Summer, Halloween, Birthday..."
            className="w-full px-4 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-center shadow-sm transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="mt-2 text-pink-500 hover:text-pink-600 font-semibold block mx-auto"
            >
              × Clear search
            </button>
          )}
        </div>

        {/* Grid de categorías - SIN CONTADORES */}
        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {displayCategories.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all transform hover:scale-105 relative border-2 border-pink-100 hover:border-pink-300"
              >
                <div className="text-5xl text-center mb-3 animate-bounce-slow">
                  {cat.emoji}
                </div>
                <div className="text-center font-semibold text-gray-800 text-sm leading-tight">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg max-w-md mx-auto">
            <p className="text-gray-500 text-lg mb-4">
              {search 
                ? `No categories match "${search}"`
                : "Loading categories..."}
            </p>
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="text-pink-500 hover:text-pink-600 font-semibold"
              >
                ← Clear search and see all
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-5px); } 
        }
        .animate-bounce-slow { 
          animation: bounce-slow 3s ease-in-out infinite; 
        }
      `}</style>
    </div>
  );
}
