"use client";
import { useEffect, useState } from "react";

export default function IndexJsonViewer() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then(r => r.json())
      .then(d => setVideos(d.videos || []))
      .catch(err => console.error(err));
  }, []);

  const filtered = search 
    ? videos.filter(v => v.name?.toLowerCase().includes(search.toLowerCase()))
    : videos;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">📹 Index.json Viewer</h1>
      
      <div className="bg-white rounded-xl p-6 shadow mb-6 max-w-4xl">
        <p className="mb-4"><b>Total videos:</b> {videos.length}</p>
        
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name: zombie, hugs, ghost..."
          className="w-full px-4 py-2 border-2 rounded-lg mb-4"
        />
        
        <p className="text-sm text-gray-600 mb-4">
          Mostrando: {filtered.length} videos
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {filtered.map((v, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{v.name}</h3>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{i + 1}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Object:</p>
                <p className="text-gray-800">{v.object || "N/A"}</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-600">Subcategory:</p>
                <p className="text-gray-800">{v.subcategory || "N/A"}</p>
              </div>
              
              <div className="col-span-2">
                <p className="font-semibold text-gray-600">Category (singular):</p>
                <p className="text-gray-800">{v.category || "N/A"}</p>
              </div>
              
              <div className="col-span-2">
                <p className="font-semibold text-gray-600">Categories (array):</p>
                {v.categories && v.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {v.categories.map((cat, j) => (
                      <span key={j} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600">❌ Array vacío o no existe</p>
                )}
              </div>
              
              <div className="col-span-2">
                <p className="font-semibold text-gray-600">Tags:</p>
                {v.tags && v.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {v.tags.map((tag, j) => (
                      <span key={j} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Sin tags</p>
                )}
              </div>
              
              <div className="col-span-2">
                <p className="font-semibold text-gray-600">File:</p>
                <p className="text-xs text-gray-600 break-all">{v.file}</p>
              </div>
            </div>

            {/* Análisis de búsqueda */}
            {search && (
              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold text-sm text-gray-600 mb-2">🔍 Análisis de búsqueda:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <b>En nombre:</b> {v.name?.toLowerCase().includes(search.toLowerCase()) ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p>
                    <b>En object:</b> {v.object?.toLowerCase().includes(search.toLowerCase()) ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p>
                    <b>En subcategory:</b> {v.subcategory?.toLowerCase().includes(search.toLowerCase()) ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p>
                    <b>En categories[]:</b> {v.categories?.some(c => c.toLowerCase().includes(search.toLowerCase())) ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p>
                    <b>En tags:</b> {v.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ? "✅ SÍ" : "❌ NO"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = "/categories"}
          className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600"
        >
          ← Volver a Categories
        </button>
      </div>
    </div>
  );
            }
