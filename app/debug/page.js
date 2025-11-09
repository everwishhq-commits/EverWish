"use client";
import { useEffect, useState } from "react";

export default function DebugCategoriesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const videos = data?.videos || [];
  
  // Agrupar por categoría
  const byCategory = {};
  videos.forEach(v => {
    const cat = v.category || "Unknown";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(v);
  });

  // Buscar videos con "halloween" en el nombre
  const halloweenVideos = videos.filter(v => 
    v.name?.toLowerCase().includes("halloween") ||
    v.subcategory?.toLowerCase().includes("halloween") ||
    v.tags?.some(t => t.toLowerCase().includes("halloween"))
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">
        🔍 Debug: Videos Database
      </h1>

      {/* Resumen */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Resumen</h2>
        <p><b>Total videos:</b> {videos.length}</p>
        <p><b>Categorías únicas:</b> {Object.keys(byCategory).length}</p>
      </div>

      {/* Videos de Halloween */}
      <div className="bg-yellow-50 rounded-xl p-6 shadow mb-6 border-2 border-yellow-400">
        <h2 className="text-xl font-semibold mb-4">🎃 Videos con "Halloween"</h2>
        <p className="mb-4"><b>Encontrados:</b> {halloweenVideos.length}</p>
        
        {halloweenVideos.length === 0 ? (
          <div className="text-red-600 font-semibold">
            ❌ NO se encontraron videos con "halloween"
            <p className="text-sm mt-2">Esto explica por qué el modal está vacío.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {halloweenVideos.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border">
                <p className="font-bold text-lg mb-2">{v.name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><b>File:</b> {v.file}</p>
                  <p><b>Object:</b> {v.object}</p>
                  <p><b>Category:</b> {v.category}</p>
                  <p><b>Subcategory:</b> {v.subcategory}</p>
                  <p className="col-span-2"><b>Categories:</b> {JSON.stringify(v.categories)}</p>
                  <p className="col-span-2"><b>Tags:</b> {v.tags?.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Por categoría */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">📂 Videos por Categoría</h2>
        {Object.entries(byCategory).map(([cat, vids]) => (
          <div key={cat} className="mb-4 border-b pb-4">
            <h3 className="font-bold text-lg text-pink-600 mb-2">
              {cat} ({vids.length})
            </h3>
            <div className="pl-4">
              {vids.map((v, i) => (
                <div key={i} className="text-sm py-1">
                  • {v.name} - <span className="text-gray-600">{v.subcategory}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Todos los videos */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📹 Todos los Videos (JSON)</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs max-h-96">
          {JSON.stringify(videos, null, 2)}
        </pre>
      </div>
    </div>
  );
          }
