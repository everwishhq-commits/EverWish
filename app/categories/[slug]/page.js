"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/videos/index.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Busca los videos que pertenecen a esta categoría
        const filtered = data.filter((v) =>
          (v.categories || []).some(
            (c) => c.toLowerCase().replace(/\s+/g, "-") === slug
          )
        );
        setVideos(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading videos:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-[#fff5f8]">
        <p className="animate-pulse text-lg">
          Loading Everwish cards for <b>{slug}</b>...
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

      {/* 🏷️ Encabezado */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Discover beautiful Everwish cards for {slug.replace("-", " ")} ✨
      </p>

      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        className="w-full max-w-md mb-10 rounded-full border border-pink-200 bg-white/70 px-4 py-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      {/* 🖼️ Grid de videos */}
      {videos.length === 0 ? (
        <p className="text-gray-500">No cards found for this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {videos
            .filter((v) =>
              v.object.toLowerCase().includes(search.toLowerCase())
            )
            .map((video, i) => (
              <div
                key={i}
                onClick={() => router.push(`/edit/${video.name}`)}
                className="everwish-card cursor-pointer transition-transform hover:scale-[1.04] bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden"
                onContextMenu={(e) => e.preventDefault()}
              >
                <video
                  src={video.file}
                  className="object-cover w-full h-auto aspect-[4/5]"
                  playsInline
                  loop
                  muted
                  disablePictureInPicture
                  controls={false}
                  controlsList="nodownload noremoteplayback nofullscreen"
                  style={{ pointerEvents: "none", touchAction: "none" }}
                />
                <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                  {video.object}
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
          }
