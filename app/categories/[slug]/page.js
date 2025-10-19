"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

        // ✅ Filtra por categoría, título o slug
        const filtered = allVideos.filter(
          (v) =>
            v.categories?.includes(slug.toLowerCase()) ||
            v.title?.toLowerCase().includes(slug.toLowerCase()) ||
            v.slug?.toLowerCase().includes(slug.toLowerCase())
        );

        setVideos(filtered);
      } catch (err) {
        console.error("Error loading videos:", err);
      }
    }
    fetchVideos();
  }, [slug]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-center px-4 pt-24 pb-16">
      {/* 🔙 Back to Categories */}
      <Link
        href="/categories"
        className="text-pink-500 hover:underline text-sm font-medium"
      >
        ← Back to Categories
      </Link>

      {/* 🏷️ Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mt-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
        {slug}
      </h1>

      {/* ✨ Subtitle */}
      <p className="text-gray-600 mt-2 mb-10">
        Discover beautiful Everwish cards for {slug} ✨
      </p>

      {/* 🎥 Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center max-w-5xl mx-auto">
        {videos.length === 0 ? (
          <p className="text-gray-400 italic">
            No cards found for this category yet.
          </p>
        ) : (
          videos.map((video, i) => (
            <div
              key={i}
              onClick={() => router.push(video.editUrl || `/edit/${video.slug}`)}
              className="relative bg-white rounded-3xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer group"
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                preload="auto"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()} // ❌ evita menú de descarga
                className="w-full h-auto object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))
        )}
      </div>
    </main>
  );
        }
