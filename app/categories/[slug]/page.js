"use client";
export const dynamic = "force-dynamic"; // evita pre-render estático problemático

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const categoryData = {
  seasonal: {
    title: "Seasonal & Holidays 🎉",
    description: "Celebrate every special moment throughout the year.",
    cards: [
      { title: "Christmas Joy", image: "/top10/christmas.png" },
      { title: "Happy Halloween", image: "/top10/halloween.png" },
      { title: "New Year Spark", image: "/top10/newyear.png" },
      { title: "Valentine Love", image: "/top10/valentine.png" },
    ],
  },
  emotions: {
    title: "Love & Emotions 💘",
    description: "Express love, gratitude, and deep feelings with Everwish.",
    cards: [
      { title: "Thinking of You", image: "/top10/thinking.png" },
      { title: "You're My Person", image: "/top10/person.png" },
      { title: "Forever Yours", image: "/top10/forever.png" },
    ],
  },
  celebrations: {
    title: "Celebrations & Events 🎊",
    description: "From birthdays to big achievements — celebrate in style.",
    cards: [
      { title: "Happy Birthday!", image: "/top10/birthday.png" },
      { title: "Congrats Grad!", image: "/top10/graduation.png" },
      { title: "Baby on the Way", image: "/top10/baby.png" },
    ],
  },
  everyday: {
    title: "Everyday Moments 🌅",
    description: "Because every day deserves a reason to smile.",
    cards: [
      { title: "Good Morning Sunshine", image: "/top10/morning.png" },
      { title: "Relax & Recharge", image: "/top10/relax.png" },
      { title: "You Got This!", image: "/top10/motivation.png" },
    ],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slugParam = params?.slug;
  // Si Next nos manda array, usamos el primero
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = categoryData[slug];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/videos", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const matched = data && typeof data === "object" ? data.categories?.[slug] || [] : [];
        if (!cancelled) setVideos(matched);
      } catch (e) {
        console.error("Error cargando videos:", e);
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!category) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4">Category not found 😢</h1>
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  const filteredCards = category.cards.filter((card) =>
    card.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      {/* Back */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{category.title}</h1>
        <p className="text-gray-700 text-lg">{category.description}</p>

        <div className="mt-6">
          <input
            type="text"
            placeholder={`Search in ${category.title}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-700"
          />
        </div>
      </div>

      {/* Tarjetas estáticas (si las usas como “editor’s picks”) */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{card.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No cards found 😅</p>
        )}
      </div>

      {/* Videos dinámicos (alimentados desde /public/videos) */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Animated Cards 🎬</h2>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <video src={v.src} autoPlay loop muted playsInline className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-500">No videos yet for this category.</p>
        )}
      </div>
    </main>
  );
  }
