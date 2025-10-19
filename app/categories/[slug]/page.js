"use client";
import { useState, useEffect } from "react";

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const filtered = data.filter((v) =>
          v.title.toLowerCase().includes(slug.toLowerCase())
        );
        setVideos(filtered);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    }
    fetchVideos();
  }, [slug]);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center px-4 pb-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl text-center mt-8">
        <a href="/categories" className="text-blue-500 text-sm mb-2 block">
          ← Back to Categories
        </a>
        <h1 className="text-3xl font-bold mb-1 capitalize">{slug}</h1>
        <p className="text-gray-600 mb-6">
          Discover beautiful Everwish cards for {slug} ✨
        </p>

        <input
          type="text"
          placeholder="Search cards..."
          className="w-full p-3 border rounded-lg mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((v) => (
            <div
              key={v.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <video
                src={v.src}
                controls
                className="w-full h-56 object-cover"
              ></video>
              <div className="p-3 text-sm font-medium text-gray-800">
                {v.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
    }
