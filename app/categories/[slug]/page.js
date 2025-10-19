"use client"; // 👈 Obligatorio para usar useEffect, useState, etc.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic"; // ✅ Evita errores SSR en Vercel

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // 🧠 Detectar categoría por nombre de archivo
  function detectCategory(filename) {
    const s = filename.toLowerCase();
    if (s.includes("halloween")) return "halloween";
    if (s.includes("christmas") || s.includes("xmas")) return "christmas";
    if (s.includes("easter")) return "easter";
    if (s.includes("valentine") || s.includes("love")) return "valentines";
    if (s.includes("birthday")) return "birthday";
    if (s.includes("mothers")) return "mothers-day";
    if (s.includes("fathers")) return "fathers-day";
    if (s.includes("baby")) return "new-baby";
    if (s.includes("graduation")) return "graduation";
    if (s.includes("wedding")) return "wedding";
    if (s.includes("getwell")) return "getwell";
    if (s.includes("anniversary")) return "anniversary";
    if (s.includes("thanksgiving")) return "thanksgiving";
    if (s.includes("newyear")) return "new-year";
    if (s.includes("autumn") || s.includes("fall")) return "autumn";
    if (s.includes("winter")) return "winter";
    if (s.includes("summer")) return "summer";
    if (s.includes("spring")) return "spring";
    if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
    return "general";
  }

  // 🎬 Cargar videos desde la API
  useEffect(() => {
    async function fetchVideos() {
      console.log("🎬 Fetching videos for slug:", slug);
      try {
        // ✅ Detecta si se ejecuta en cliente o servidor
        const isClient = typeof window !== "undefined";
        const baseUrl = isClient
          ? window.location.origin
          : process.env.NEXT_PUBLIC_BASE_URL || "https://everwish.cards";

        const res = await fetch(`${baseUrl}/api/videos`, { cache: "no-store" });
        const data = await res.json();
        console.log("✅ Data received:", data);

        // 🔎 Filtra los videos por categoría
        const allVideos = data.all || [];
        const filtered = allVideos.filter((v) => {
          const cats = v.categories || [detectCategory(v.title)];
          return cats.includes(slug.toLowerCase());
        });

        console.log("📂 Category videos for", slug, ":", filtered);
        setVideos(filtered);
      } catch (err) {
        console.error("❌ Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [slug]);

  // ⏳ Pantalla de carga
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-600">
        <p className="animate-pulse text-lg font-medium">
          Loading {slug} cards...
        </p>
      </main>
    );
  }

  // ❌ Sin videos
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

  // ✅ Vista principal
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4 md:px-8">
      {/* 🔹 Encabezado */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
          {slug.replace("-", " ")}
        </h1>

        <p className="text-gray-700 text-lg">
          Discover beautiful Everwish cards for {slug.replace("-", " ")} ✨
        </p>

        {/* 🔍 Buscador */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-gray-700"
          />
        </div>
      </div>

      {/* 🎞️ Grid de videos */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos
          .filter((v) =>
            v.title.toLowerCase().includes(query.toLowerCase())
          )
          .map((v, i) => (
            <Link
              key={i}
              href={v.editUrl || `/edit/${v.slug}`}
              className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
            >
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
