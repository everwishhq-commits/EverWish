"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = Array.isArray(data) ? data : data.all || [];

        // 🔍 Filtro flexible
        const filtered = allVideos.filter(
          (v) =>
            v.slug?.toLowerCase().includes(slug.toLowerCase()) ||
            v.title?.toLowerCase().includes(slug.toLowerCase())
        );

        setVideos(filtered);
      } catch (err) {
        console.error("Error loading videos:", err);
      }
    }
    fetchVideos();
  }, [slug]);

  return (
    <main
      className="fixed inset-0 flex flex-col items-center justify-start bg-gradient-to-b from-pink-50 via-white to-pink-50 text-center px-4 pt-24 pb-16 overflow-y-auto"
      style={{ height: "100dvh", overscrollBehavior: "none" }}
    >
      {/* 🔙 Barra superior con navegación */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-5 py-3">
        <button
          onClick={() => router.back()}
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back
        </button>
        <Link
          href="/"
          className="text-pink-600 font-semibold hover:underline"
        >
          🏠 Home
        </Link>
      </div>

      {/* 🏷️ Título */}
      <h1 className="text-4xl md:text-5xl font-extrabold mt-20 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
        {slug}
      </h1>

      {/* ✨ Subtítulo */}
      <p className="text-gray-600 mt-2 mb-8">
        Discover beautiful Everwish cards for {slug} ✨
      </p>

      {/* 🎥 Grilla de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center max-w-5xl mx-auto mb-10">
        {videos.length === 0 ? (
          <p className="text-gray-400 italic">
            No cards found for this category yet.
          </p>
        ) : (
          videos.map((video, i) => (
            <div
              key={i}
              onClick={() => router.push(`/edit/${video.slug}`)}
              className="relative bg-white rounded-[8%] shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer group aspect-[4/5]"
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover rounded-[8%] pointer-events-none select-none transform group-hover:scale-105 transition-transform duration-500"
                draggable={false}
              />
            </div>
          ))
        )}
      </div>

      {/* 📍Botones secundarios al final */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Link
          href="/categories"
          className="rounded-full bg-pink-200 px-6 py-3 font-semibold text-pink-700 hover:bg-pink-300 transition-all shadow-sm"
        >
          View All Categories
        </Link>
        <Link
          href="/"
          className="rounded-full bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-600 transition-all shadow-sm"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
