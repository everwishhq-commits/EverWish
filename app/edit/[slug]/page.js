"use client";

import { useEffect, useState } from "react";

export default function EditPage({ params }) {
  const { slug } = params;
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function loadVideo() {
      const res = await fetch("/api/videos");
      const data = await res.json();
      const videos = data.videos || data || [];
      const found = videos.find((v) => v.slug === slug || v.name === slug);
      setMatch(found || null);
    }
    loadVideo();
  }, [slug]);

  if (!match) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fff7f5]">
        <p className="text-gray-500">Loading video...</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#fff7f5] overflow-hidden"
    >
      {/* 🔹 Contenedor del video con tamaño ajustable */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "94vw",    // 🔧 AJUSTA AQUÍ: 90vw, 94vw, 98vw, 100vw
          height: "92vh",   // 🔧 AJUSTA AQUÍ: 85vh, 90vh, 92vh, 95vh, 100vh
        }}
      >
        <video
          src={match.file}
          autoPlay
          loop
          muted
          playsInline
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full rounded-2xl shadow-lg object-contain bg-pink-50"
        />
      </div>
    </div>
  );
}
