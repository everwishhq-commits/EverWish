"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.categories[slug] || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading {slug} videos...</p>
      </main>
    );
  }

  if (!videos.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 capitalize">{slug} 🎞️</h1>
        <p className="text-gray-500">No videos found in this category yet.</p>
        <Link href="/categories" className="mt-4 text-blue-500 underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold capitalize mb-3">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-gray-600">Select a card to edit or send 💌</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((v, i) => (
          <Link key={i} href={v.editUrl}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <video
                src={v.src}
                className="w-full h-48 object-cover"
                muted
                loop
                playsInline
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{v.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
          }
