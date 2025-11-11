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
      className="fixed inset-0 bg-[#fff7f5] flex justify-center items-center overflow-hidden"
      style={{
        height: "100vh",      // 🔹 llena toda la pantalla
        padding: "0",         // 🔹 sin padding
        margin: "0",          // 🔹 sin margen extra
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            max-h-[95vh]          /* 🔹 no sobrepasa la pantalla */
            max-w-[90vw]          /* 🔹 se adapta al ancho */
            aspect-[4/5]          /* 🔹 mantiene proporción */
            rounded-2xl shadow-lg
            object-contain object-center
            bg-pink-50
          "
        />
      </div>
    </div>
  );
}
