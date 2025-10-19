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
      {/* Encabezado */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 capitalize">
        {params.slug}
      </h1>
      <p className="text-gray-500 mb-10 text-center">
        Discover beautiful Everwish cards for {params.slug} ✨
      </p>

      {/* Cuadrícula de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {videos.map((video) => (
          <div
            key={video.slug}
            className="relative bg-white rounded-3xl shadow-md overflow-hidden aspect-[4/5] transition-transform hover:scale-[1.02]"
          >
            <video
              src={video.src}
              className="w-full h-full object-cover pointer-events-none select-none"
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              controls={false}
              controlsList="nodownload noplaybackrate nofullscreen"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Capa para proteger clics */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => window.open(video.src, "_blank")}
            />
          </div>
        ))}
      </div>
    </main>
  );
                }
