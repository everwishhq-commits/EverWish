"use client";
import { useEffect, useState } from "react";

export default function TestVideos() {
  const [status, setStatus] = useState("⏳ Verificando...");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function checkIndex() {
      try {
        console.log("📂 Intentando cargar /videos/index.json...");
        const res = await fetch("/videos/index.json", { cache: "no-store" });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("✅ Cargado correctamente:", data.length, "videos");
        setVideos(data);
        setStatus(`✅ Encontrado /videos/index.json con ${data.length} videos`);
      } catch (err) {
        console.error("❌ No se pudo cargar el index.json:", err);
        setStatus("❌ No se encontró /videos/index.json (404)");
      }
    }

    checkIndex();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-white text-gray-800 p-10">
      <h1 className="text-2xl font-bold mb-4">🔍 Verificación de index.json</h1>
      <p className="text-lg mb-6">{status}</p>

      {videos.length > 0 && (
        <div className="max-w-lg w-full border p-4 rounded-xl shadow bg-gray-50">
          <h2 className="font-semibold mb-2 text-pink-600">
            🎥 Videos detectados:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {videos.map((v, i) => (
              <li key={i}>{v.title || v.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
    }
