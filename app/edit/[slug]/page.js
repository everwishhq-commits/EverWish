"use client";

import { useEffect, useState } from "react";

export default function EditPage({ params }) {
  const { slug } = params;
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const videos = data.videos || data || [];
        const found = videos.find(
          (v) => v.slug === slug || v.name === slug
        );
        setMatch(found || null);
      } catch (err) {
        console.error("❌ Error cargando video:", err);
      }
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
      className="fixed inset-0 flex items-center justify-center bg-[#fff7f5]"
      style={{
        width: "100vw",      // 🔹 ocupa todo el ancho visible
        height: "100dvh",    // 🔹 usa altura total real del dispositivo (corrige notch o barra)
        padding: "0",        // 🔹 sin padding
        margin: "0",         // 🔹 sin márgenes
        overflow: "hidden",  // 🔹 evita scroll
      }}
    >
      <video
        src={match.file}
        autoPlay
        loop
        muted
        playsInline
        controlsList="nodownload noplaybackrate"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        className="
          h-[88dvh]           /* 🔹 ocupa el 88 % del alto del contenedor */
          w-auto              /* 🔹 ajusta ancho automáticamente */
          max-w-[92vw]        /* 🔹 no se sale del ancho de pantalla */
          aspect-[4/5]
          rounded-2xl shadow-lg
          object-contain object-center
          bg-pink-50
        "
      />
    </div>
  );
}
