"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🎥 Loading videos for category:", slug);
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((v) =>
          v.title.toLowerCase().includes(slug.toLowerCase())
        );
        setVideos(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching videos:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <p>Loading videos for <b>{slug}</b>...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-[#fffafc] text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-2 capitalize">{slug}</h1>
      <p className="text-gray-600 mb-6">
        Discover beautiful Everwish cards for {slug} ✨
      </p>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.slug}
              className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <video
                src={video.src}
                className="w-full h-auto"
                playsInline
                loop
                muted
                controlsList="nodownload"
                controls
              />
              <div className="p-3 font-semibold text-center">
                {video.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
    }
