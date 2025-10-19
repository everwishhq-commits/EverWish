"use client";
export const dynamic = "force-dynamic"; // 💪 evita pre-render y errores de serialización

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const categoryData = {
  seasonal: {
    title: "Seasonal & Holidays 🎉",
    description: "Celebrate every special moment throughout the year.",
  },
  emotions: {
    title: "Love & Emotions 💘",
    description: "Express love, gratitude, and deep feelings with Everwish.",
  },
  celebrations: {
    title: "Celebrations & Events 🎊",
    description: "From birthdays to big achievements — celebrate in style.",
  },
  everyday: {
    title: "Everyday Moments 🌅",
    description: "Because every day deserves a reason to smile.",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slugParam = params?.slug;

  // ⚙️ Asegura que slug siempre sea string, nunca array ni undefined
  const slug = Array.isArray(slugParam)
    ? slugParam[0]
    : typeof slugParam === "string"
    ? slugParam
    : null;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Cargar los videos dinámicos
  useEffect(() => {
    if (!slug) return; // evita ejecutar antes de que slug exista

    let cancelled = false;

    async function loadVideos() {
      try {
        setLoading(true);
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

  // 🧠 Si aún no hay slug o se carga, muestra un loader en lugar de romper la app
  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading category…</p>
      </main>
    );
  }

  const category = categoryData[slug] || {
    title: slug,
    description: "Videos for this category",
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      {/* 🔙 Back */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      {/* 🏷️ Encabezado */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
          {category.title}
        </h1>
        <p className="text-gray-700 text-lg">{category.description}</p>
      </div>

      {/* 🎬 Videos */}
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
