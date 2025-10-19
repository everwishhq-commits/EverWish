"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic"; // ✅ evita errores SSR en Vercel

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const categoryVideos = data.categories?.[slug] || [];
        setVideos(categoryVideos);
      } catch (err) {
        console.error("Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-600">
        <p className="animate-pulse">Loading {slug} cards...</p>
      </main>
    );
  }

  if (!videos.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-700">
        <h1 className="text-3xl font-bold mb-4 capitalize">{slug}</h1>
        <p>No videos yet in this category 🎥</p>
        <Link href="/categories" className="mt-4 text-pink-500 underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4 md:px-8">
      {/* 🏷️ Encabezado */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 capitalize bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-gray-600">Choose your favorite card 💌</p>
      </div>

      {/* 🎞️ Tarjetas (videos) */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((v, i) => (
          <Link key={i} href={v.editUrl || `/edit/${v.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="relative w-full aspect-[4/5]">
                <video
                  src={v.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  controls={false}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 rounded-3xl"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <p className="text-sm font-semibold text-white drop-shadow-md truncate">
                    {v.title}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔙 Volver */}
      <div className="text-center mt-10">
        <Link
          href="/categories"
          className="text-sm text-gray-500 hover:text-pink-500 transition"
        >
          ← Back to Categories
        </Link>
      </div>
    </main>
  );
      }
