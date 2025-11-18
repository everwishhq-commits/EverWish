"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchVideos, groupByCategory } from "@/lib/simple-search";
import { BASE_CATEGORIES } from "@/lib/categories-config";

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);

  // 1️⃣ CARGAR VIDEOS (solo una vez)
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = data.videos || [];
        
        console.log(`📦 Videos cargados: ${allVideos.length}`);
        console.log(`📹 Ejemplo:`, allVideos[0]);
        
        setVideos(allVideos);
        setFilteredVideos(allVideos); // Por defecto, mostrar todos
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
    loadVideos();
  }, []);

  // 2️⃣ FILTRAR cuando cambia la búsqueda
  useEffect(() => {
    if (!search.trim()) {
      // Sin búsqueda: mostrar todos
      console.log("🔄 Sin búsqueda, mostrando todos");
      setFilteredVideos(videos);
    } else {
      // Con búsqueda: filtrar
      console.log(`🔍 Filtrando con: "${search}"`);
      const results = searchVideos(videos, search);
      setFilteredVideos(results);
    }
  }, [search, videos]);

  // 3️⃣ ACTUALIZAR categorías cuando cambian los videos filtrados
  useEffect(() => {
    const grouped = groupByCategory(filteredVideos);
    
    let categoriesWithCounts = BASE_CATEGORIES.map(cat => ({
      ...cat,
      count: grouped[cat.slug]?.length || 0
    }));
    
    // 🔥 Si hay búsqueda, ordenar: con resultados primero
    if (search.trim()) {
      categoriesWithCounts = categoriesWithCounts.sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        return 0;
      });
    }
    
    console.log("📊 Categorías actualizadas:", categoriesWithCounts);
    setDisplayCategories(categoriesWithCounts);
  }, [filteredVideos, search]);

  const handleCategoryClick = (cat) => {
    if (cat.count === 0 && search.trim()) {
      console.log("⚠️ Categoría vacía, no navegar");
      return;
    }
    
    const url = search.trim()
      ? `/category/${cat.slug}?q=${encodeURIComponent(search)}`
      : `/category/${cat.slug}`;
    
    console.log(`🔗 Navegando a: ${url}`);
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-2 mt-6">
          Categories
        </h1>
        
        {/* Buscador */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search: love, halloween, birthday..."
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

        {/* Resultados */}
        {search && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              ✨ Found <span className="font-bold text-pink-600">{filteredVideos.length}</span> cards
            </p>
          </div>
        )}

        {/* Grid de categorías */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {displayCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat)}
              className={`bg-white p-6 rounded-2xl shadow-md cursor-pointer transition-all transform hover:scale-105 relative border-2 ${
                search && cat.count === 0
                  ? 'border-gray-200 opacity-40 cursor-not-allowed'
                  : 'border-pink-100 hover:border-pink-300 hover:shadow-xl'
              }`}
            >
              <div className="text-5xl text-center mb-3">
                {cat.emoji}
              </div>
              <div className="text-center font-semibold text-gray-800 text-sm leading-tight">
                {cat.name}
              </div>
              
              {/* Badge SOLO cuando hay búsqueda Y resultados */}
              {search && cat.count > 0 && (
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  {cat.count}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Debug info */}
        {search && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl text-xs">
            <p className="font-bold mb-2">🔍 Debug Info:</p>
            <p>Total videos: {videos.length}</p>
            <p>Filtered: {filteredVideos.length}</p>
            <p>Search term: "{search}"</p>
            <p>Categories with results: {displayCategories.filter(c => c.count > 0).length}</p>
          </div>
        )}
      </div>
    </div>
  );
                }
