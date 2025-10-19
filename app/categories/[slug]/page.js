"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const filtered = data.filter(
          (v) => v.category.toLowerCase() === slug.toLowerCase()
        );
        setVideos(filtered);
      } catch (err) {
        console.error("Error loading videos:", err);
      }
    }
    fetchVideos();
  }, [slug]);

  return (
    <main className="min-h-screen bg-pink-50 text-center px-4 pt-24 pb-16">
      <Link
        href="/categories"
        className="text-pink-500 hover:underline text-sm font-medium"
      >
        ← Back to Categories
      </Link>

      <h1 className="text-4xl font-extrabold text-pink-700 mt-4 capitalize">
        {slug}
      </h1>
      <p className="text-gray-600 mt-2 mb-10">
        Discover beautiful Everwish cards for {slug} ✨
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center max-w-5xl mx-auto">
        {videos.map((video, i) => (
          <div
            key={i}
            className="relative bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            onContextMenu={(e) => e.preventDefault()} // 🔒 Bloquea click derecho / descarga
          >
            <video
              src={video.url}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controls={false}
              className="w-full h-full object-cover"
              onClick={(e) => e.target.play()}
            />
          </div>
        ))}
      </div>
    </main>
  );
                }
