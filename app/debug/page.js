"use client";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <p className="text-2xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Filtrar videos con "halloween" en el nombre
  const halloweenVideos = videos.filter(v => 
    v.name?.toLowerCase().includes("halloween")
  );

  const seasonalVideos = videos.filter(v =>
    v.category?.toLowerCase().includes("seasonal") ||
    v.categories?.some(c => c.toLowerCase().includes("seasonal"))
  );

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        🔍 Debug de Videos
      </h1>

      {/* Resumen General */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Resumen</h2>
        <div className="space-y-2 text-lg">
          <p><b>Total de videos:</b> {videos.length}</p>
          <p><b>Videos en Seasonal:</b> {seasonalVideos.length}</p>
          <p className="text-2xl font-bold mt-4">
            <b>Videos con "halloween":</b> 
            <span className={halloweenVideos.length > 0 ? "text-green-600" : "text-red-600"}>
              {" "}{halloweenVideos.length}
            </span>
          </p>
        </div>
      </div>

      {/* Resultado Principal */}
      {halloweenVideos.length === 0 ? (
        <div className="bg-red-100 border-4 border-red-500 rounded-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            ❌ PROBLEMA ENCONTRADO
          </h2>
          <p className="text-xl mb-4">
            NO hay videos con "halloween" en el nombre.
          </p>
          <p className="text-lg mb-2">Esto significa que:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>El script generateindex.js NO se ejecutó</li>
            <li>O los archivos no se subieron a GitHub</li>
            <li>O tienen nombres diferentes</li>
          </ul>
        </div>
      ) : (
        <div className="bg-green-100 border-4 border-green-500 rounded-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            ✅ Videos encontrados: {halloweenVideos.length}
          </h2>
          <p className="text-lg">
            Los videos SÍ existen. El problema es el filtro.
          </p>
        </div>
      )}

      {/* Detalles de videos Halloween */}
      {halloweenVideos.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🎃 Videos de Halloween
          </h2>
          {halloweenVideos.map((v, i) => (
            <div key={i} className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
              <p className="text-xl font-bold mb-2">{v.name}</p>
              <div className="space-y-1 text-sm">
                <p><b>Objeto:</b> {v.object}</p>
                <p><b>Categoría:</b> {v.category}</p>
                <p><b>Subcategoría:</b> 
                  <span className={v.subcategory === "Halloween" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {" "}{v.subcategory}
                  </span>
                </p>
                <p><b>Archivo:</b> {v.file}</p>
                <p><b>Tags:</b> {v.tags?.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Todos los videos en Seasonal */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📂 Todos los videos en "Seasonal & Global Celebrations"
        </h2>
        {seasonalVideos.length === 0 ? (
          <p className="text-red-600 font-bold text-lg">
            ❌ NO hay videos en esta categoría
          </p>
        ) : (
          <div className="space-y-3">
            {seasonalVideos.map((v, i) => (
              <div key={i} className="bg-gray-50 border rounded-lg p-3">
                <p className="font-bold">{v.name}</p>
                <p className="text-sm text-gray-600">
                  Subcategoría: {v.subcategory} | Objeto: {v.object}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para volver */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = "/categories"}
          className="bg-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-pink-600"
        >
          ← Volver a Categorías
        </button>
      </div>
    </div>
  );
        }
