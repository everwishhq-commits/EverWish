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
      className="fixed inset-0 flex items-center justify-center bg-[#fff7f5]"
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
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
        className="
          h-[92dvh]        /* usa casi toda la altura del contenedor */
          w-auto           /* que el ancho se ajuste solo */
          max-w-[94vw]     /* que no se salga por los lados */
          rounded-2xl
          shadow-lg
          object-contain   /* NO recortes, mantén proporción */
          bg-pink-50
        "
      />
    </div>
  );
}
