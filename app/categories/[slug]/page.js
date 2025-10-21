"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((v) =>
          v.title.toLowerCase().includes(slug.toLowerCase())
        );
        setVideos(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-[#fff5f8]">
        <p className="animate-pulse text-lg">
          Loading beautiful Everwish cards for <b>{slug}</b>...
        </p>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-start min-h-screen bg-[#fff5f8] text-gray-800 px-4 py-10 select-none touch-none"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 🔙 Volver */}
      <button
        onClick={() => router.push("/")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
      >
        ← Back to Categories
      </button>

      {/* 🎃 Encabezado */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize">
        {slug}
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Discover beautiful Everwish cards for {slug} ✨
      </p>

      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Search cards..."
        className="w-full max-w-md mb-10 rounded-full border border-pink-200 bg-white/70 px-4 py-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        onChange={(e) => {
          const value = e.target.value.toLowerCase();
          document.querySelectorAll(".everwish-card").forEach((card) => {
            card.style.display = card.dataset.title.includes(value)
              ? "block"
              : "none";
          });
        }}
      />

      {/* 🖼️ Grid de videos */}
      {videos.length === 0 ? (
        <p className="text-gray-500">No cards found for this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {videos.map((video) => (
            <div
              key={video.slug}
              data-title={video.title.toLowerCase()}
              onClick={() => router.push(`/edit/${video.slug}`)}
              className="everwish-card cursor-pointer transition-transform hover:scale-[1.04] bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden"
              onContextMenu={(e) => e.preventDefault()} // 🚫 bloquea "descargar video"
            >
              <video
                src={video.src}
                className="object-cover w-full h-auto aspect-[4/5]"
                playsInline
                loop
                muted
                disablePictureInPicture
                controls={false} // ❌ no mostrar controles
                controlsList="nodownload noremoteplayback nofullscreen"
                style={{ pointerEvents: "none", touchAction: "none" }}
              />
              <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                {video.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
