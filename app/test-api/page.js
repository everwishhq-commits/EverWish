"use client";
import { useEffect, useState } from "react";

export default function TestAPIPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        console.log("🔍 Probando /api/videos...");
        const res = await fetch("/api/videos", { cache: "no-store" });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        console.log("✅ Respuesta recibida:", json);
        setData(json);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  if (loading) return <div className="p-8">⏳ Loading...</div>;
  
  if (error) {
    return (
      <div className="p-8 bg-red-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h1>
        <p className="text-red-800 mb-4">{error}</p>
        <p className="text-sm text-gray-600">
          El API /api/videos no está funcionando. Posibles causas:
        </p>
        <ul className="list-disc ml-6 text-sm text-gray-600">
          <li>El archivo route.js no se subió a GitHub</li>
          <li>Vercel no lo desplegó correctamente</li>
          <li>Hay un error de sintaxis en el archivo</li>
        </ul>
      </div>
    );
  }

  const videos = data?.videos || [];
  const zombieVideos = videos.filter(v => 
    v.name?.toLowerCase().includes("zombie") ||
    v.object?.toLowerCase().includes("zombie") ||
    v.tags?.some(t => t.includes("zombie"))
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">
        🧪 Test API /api/videos
      </h1>

      {/* Resumen */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Resumen</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Videos</p>
            <p className="text-3xl font-bold text-blue-600">{videos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Videos "zombie"</p>
            <p className="text-3xl font-bold text-green-600">{zombieVideos.length}</p>
          </div>
        </div>
      </div>

      {/* Videos de Zombie */}
      {zombieVideos.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6 shadow mb-6 border-2 border-yellow-400">
          <h2 className="text-xl font-semibold mb-4">🧟 Videos con "zombie"</h2>
          {zombieVideos.map((v, i) => (
            <div key={i} className="bg-white p-4 rounded-lg mb-3 border">
              <h3 className="font-bold text-lg mb-2">{v.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>File:</strong> {v.file}</p>
                <p><strong>Object:</strong> {v.object}</p>
                <p><strong>Category:</strong> {v.category}</p>
                <p><strong>Subcategory:</strong> {v.subcategory}</p>
                <p className="col-span-2">
                  <strong>Categories:</strong> {JSON.stringify(v.categories)}
                </p>
                <p className="col-span-2">
                  <strong>Tags:</strong> {v.tags?.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primeros 5 videos */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">🎬 Primeros 5 Videos</h2>
        {videos.length === 0 ? (
          <p className="text-red-600">❌ No hay videos. El API no está leyendo la carpeta.</p>
        ) : (
          videos.slice(0, 5).map((v, i) => (
            <div key={i} className="border-b pb-4 mb-4 last:border-0">
              <h3 className="font-bold">{v.name}</h3>
              <div className="text-sm text-gray-600 mt-2">
                <p>Object: {v.object}</p>
                <p>Category: {v.category}</p>
                <p>Subcategory: {v.subcategory}</p>
                <p>Categories: {JSON.stringify(v.categories)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Todas las categorías detectadas */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📂 Categorías Detectadas</h2>
        {(() => {
          const cats = new Set();
          videos.forEach(v => {
            if (v.categories) {
              v.categories.forEach(c => cats.add(c));
            } else if (v.category) {
              cats.add(v.category);
            }
          });
          
          return [...cats].length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {[...cats].map((cat, i) => (
                <span key={i} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No se detectaron categorías</p>
          );
        })()}
      </div>

      {/* JSON Raw */}
      <div className="bg-white rounded-xl p-6 shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">📄 JSON Completo</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
