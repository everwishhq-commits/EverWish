"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// 🚀 Bloquea el prerender estático
export const dynamic = "force-dynamic";

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || null;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Cargar videos dinámicos desde la API
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const list =
          data && typeof data === "object" ? data.categories?.[slug] || [] : [];

        if (!cancelled) setVideos(list);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Loading category…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-700 text-lg">
          Browse Everwish cards in this category ✨
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading videos…</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <video
                  src={v.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No videos found 😅</p>
        )}
      </div>
    </main>
  );
  }
