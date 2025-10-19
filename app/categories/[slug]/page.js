"use client";

import { useEffect, useState } from "react";

export default function CategoryVideosPage({ params }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const filtered = data.filter((v) =>
          v.slug.toLowerCase().includes(params.slug.toLowerCase())
        );
        setVideos(filtered);
      } catch (error) {
        console.error("Error loading videos:", error);
      }
    }

    fetchVideos();
  }, [params.slug]);

  return (
    <main className="min-h-screen bg-[#fff7f7] flex flex-col items-center py-12 px-4">
      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 capitalize">
        {params.slug}
      </h1>
      <p className="text-gray-500 mb-10 text-center">
        Discover beautiful Everwish cards for {params.slug} ✨
      </p>

      {/* Grid de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {videos.map((video) => (
          <div
            key={video.slug}
            className="relative bg-white rounded-3xl shadow-md overflow-hidden aspect-[4/5] transition-transform hover:scale-[1.02]"
          >
            <video
              src={video.src}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Fondo de gradiente para evitar que se vean nombres ni controles */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </main>
  );
    }
