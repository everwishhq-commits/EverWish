"use client";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDebug() {
      try {
        // Intentar cargar desde API
        const res = await fetch("/api/videos", { cache: "no-store" });
        const apiData = await res.json();
        
        // Intentar cargar desde archivo estático
        let staticData = null;
        try {
          const staticRes = await fetch("/videos/index.json", { cache: "no-store" });
          staticData = await staticRes.json();
        } catch (err) {
          staticData = { error: "No se pudo cargar /videos/index.json" };
        }

        setData({
          api: apiData,
          static: staticData,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        setData({ error: err.message });
      } finally {
        setLoading(false);
      }
    }
    loadDebug();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">🔍 Loading Debug Info...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">🔍 Everwish Debug Tool</h1>
      
      {/* Info general */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📊 General Info</h2>
        <p className="mb-2"><strong>Timestamp:</strong> {data?.timestamp}</p>
        <p className="mb-2"><strong>API videos count:</strong> {data?.api?.videos?.length || 0}</p>
        <p className="mb-2"><strong>Static file status:</strong> {data?.static?.error || "OK"}</p>
      </div>

      {/* Videos desde API */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🎬 Videos from /api/videos</h2>
        {data?.api?.videos?.length > 0 ? (
          <div>
            <p className="mb-4 text-gray-600">
              Mostrando primeros 5 videos de {data.api.videos.length} total
            </p>
            {data.api.videos.slice(0, 5).map((video, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 mb-4 last:border-0">
                <h3 className="font-bold text-lg text-pink-600">{video.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                  <p><strong>File:</strong> {video.file}</p>
                  <p><strong>Object:</strong> {video.object}</p>
                  <p><strong>Category:</strong> {video.category}</p>
                  <p><strong>Subcategory:</strong> {video.subcategory}</p>
                  <p className="col-span-2"><strong>Categories:</strong> {JSON.stringify(video.categories)}</p>
                  <p className="col-span-2"><strong>Tags:</strong> {video.tags?.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">❌ No videos found in API response</p>
        )}
      </div>

      {/* Búsqueda de "zombie" */}
      <div className="bg-yellow-50 rounded-xl p-6 mb-6 shadow border-2 border-yellow-400">
        <h2 className="text-xl font-semibold mb-4">🧟 Test: Buscar "zombie"</h2>
        {data?.api?.videos ? (
          (() => {
            const zombieVideos = data.api.videos.filter(v => {
              const searchable = [
                v.name,
                v.object,
                v.category,
                v.subcategory,
                ...(v.categories || []),
                ...(v.tags || [])
              ].filter(Boolean).join(" ").toLowerCase();
              
              return searchable.includes("zombie");
            });

            const categories = new Set();
            zombieVideos.forEach(v => {
              if (v.categories && Array.isArray(v.categories)) {
                v.categories.forEach(cat => categories.add(cat));
              } else if (v.category) {
                categories.add(v.category);
              }
            });

            return (
              <div>
                <p className="mb-2"><strong>Videos encontrados:</strong> {zombieVideos.length}</p>
                <p className="mb-4"><strong>Categorías detectadas:</strong> {[...categories].join(", ") || "Ninguna"}</p>
                
                {zombieVideos.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Videos con "zombie":</h3>
                    {zombieVideos.map((v, i) => (
                      <div key={i} className="bg-white p-3 rounded mb-2 text-sm">
                        <p><strong>{v.name}</strong></p>
                        <p className="text-gray-600">Categories: {JSON.stringify(v.categories || v.category)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600 mt-4">❌ No se encontraron videos con "zombie"</p>
                )}
              </div>
            );
          })()
        ) : (
          <p className="text-red-600">❌ No hay datos para buscar</p>
        )}
      </div>

      {/* Raw JSON */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📄 Raw JSON Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
