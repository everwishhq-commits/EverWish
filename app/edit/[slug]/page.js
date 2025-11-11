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
      className="relative w-full flex justify-center items-center bg-[#fff7f5]"
      style={{
        height: "100vh",       // 🔹 ocupa toda la altura del dispositivo
        marginTop: "0",        // 🔹 sin margen arriba
        marginBottom: "0",     // 🔹 sin margen abajo
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",    // 🔹 evita scrolls o desbordes
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
          w-[90vw] max-w-[460px]
          aspect-[4/5]
          rounded-2xl shadow-lg
          object-cover object-center
          bg-pink-50 overflow-hidden
        "
      />
    </div>
  );
}
