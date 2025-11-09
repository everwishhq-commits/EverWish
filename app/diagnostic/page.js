"use client";
import { useEffect, useState } from "react";

export default function DiagnosticPage() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function diagnose() {
      const results = {
        timestamp: new Date().toISOString(),
        checks: [],
      };

      // 1. Verificar API
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        results.checks.push({
          name: "API /api/videos",
          status: "✅ OK",
          details: `${data.videos?.length || 0} videos cargados`,
        });
        setVideos(data.videos || []);
      } catch (err) {
        results.checks.push({
          name: "API /api/videos",
          status: "❌ FALLA",
          details: err.message,
        });
      }

      // 2. Verificar función normalizeForSearch
      try {
        // Intentar simular la función
        const testNormalize = (text) => {
          if (!text) return "";
          return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
        };
        
        const test1 = testNormalize("Zombies");
        const test2 = testNormalize("ZOMBIE");
        
        results.checks.push({
          name: "Función normalizeForSearch",
          status: test1 === "zombies" && test2 === "zombie" ? "✅ OK" : "❌ FALLA",
          details: `"Zombies" → "${test1}", "ZOMBIE" → "${test2}"`,
        });
      } catch (err) {
        results.checks.push({
          name: "Función normalizeForSearch",
          status: "❌ FALLA",
          details: err.message,
        });
      }

      // 3. Verificar búsqueda de "zombie"
      const zombieVideos = (data.videos || []).filter(v => {
        const name = (v.name || "").toLowerCase();
        return name.includes("zombie");
      });
      
      results.checks.push({
        name: 'Búsqueda "zombie" en nombres',
        status: zombieVideos.length > 0 ? "✅ OK" : "❌ FALLA",
        details: `${zombieVideos.length} videos encontrados`,
        videos: zombieVideos.map(v => v.name),
      });

      // 4. Verificar categorías del zombie
      if (zombieVideos.length > 0) {
        const cats = new Set();
        zombieVideos.forEach(v => {
          if (v.categories) {
            v.categories.forEach(c => cats.add(c));
          } else if (v.category) {
            cats.add(v.category);
          }
        });
        
        results.checks.push({
          name: "Categorías del zombie",
          status: cats.size > 0 ? "✅ OK" : "❌ FALLA",
          details: `${cats.size} categorías únicas`,
          categories: [...cats],
        });
      }

      // 5. Buscar "zombies" (plural)
      const zombiesSearch = (data.videos || []).filter(v => {
        const searchable = [
          v.name,
          v.object,
          v.subcategory,
          ...(v.categories || []),
          ...(v.tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        
        return searchable.includes("zombies") || searchable.includes("zombie");
      });
      
      results.checks.push({
        name: 'Búsqueda "zombies" (plural)',
        status: zombiesSearch.length > 0 ? "✅ OK" : "❌ FALLA",
        details: `${zombiesSearch.length} videos encontrados`,
      });

      setDiagnosis(results);
    }

    diagnose();
  }, []);

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Running diagnostics...</p>
      </div>
    );
  }

  const hasErrors = diagnosis.checks.some(c => c.status.includes("❌"));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Diagnostic Report</h1>
        <p className="text-sm text-gray-500 mb-6">{diagnosis.timestamp}</p>

        {/* Resumen */}
        <div className={`rounded-xl p-6 mb-6 ${hasErrors ? 'bg-red-50 border-2 border-red-500' : 'bg-green-50 border-2 border-green-500'}`}>
          <h2 className="text-2xl font-bold mb-2">
            {hasErrors ? '❌ PROBLEMAS DETECTADOS' : '✅ TODO FUNCIONA'}
          </h2>
          <p className="text-lg">
            {diagnosis.checks.filter(c => c.status.includes("✅")).length} / {diagnosis.checks.length} checks pasados
          </p>
        </div>

        {/* Checks individuales */}
        <div className="space-y-4">
          {diagnosis.checks.map((check, i) => (
            <div key={i} className={`bg-white rounded-xl p-6 shadow border-l-4 ${check.status.includes("✅") ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800">{check.name}</h3>
                <span className="text-2xl">{check.status.split(" ")[0]}</span>
              </div>
              <p className="text-gray-600 mb-2">{check.details}</p>
              
              {check.videos && check.videos.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded p-3">
                  <p className="font-semibold text-sm mb-2">Videos encontrados:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {check.videos.map((v, j) => <li key={j}>{v}</li>)}
                  </ul>
                </div>
              )}
              
              {check.categories && check.categories.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded p-3">
                  <p className="font-semibold text-sm mb-2">Categorías:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {check.categories.map((c, j) => <li key={j}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Datos completos del primer zombie */}
        {videos.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">📹 Primer video con "zombie":</h2>
            {(() => {
              const zombie = videos.find(v => v.name?.toLowerCase().includes("zombie"));
              if (!zombie) return <p className="text-red-600">❌ No se encontró ningún video con "zombie"</p>;
              
              return (
                <div className="bg-yellow-50 rounded p-4">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(zombie, null, 2)}
                  </pre>
                </div>
              );
            })()}
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = "/"}
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600"
          >
            ← Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
            }
