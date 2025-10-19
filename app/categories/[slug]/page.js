"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // 🧠 Detecta múltiples categorías por nombre
  function detectCategories(filename) {
    const s = filename.toLowerCase();
    const categories = [];

    if (s.includes("halloween")) categories.push("halloween");
    if (s.includes("christmas") || s.includes("xmas")) categories.push("christmas");
    if (s.includes("easter")) categories.push("easter");
    if (s.includes("valentine") || s.includes("love")) categories.push("valentines");
    if (s.includes("birthday")) categories.push("birthday");
    if (s.includes("mothers")) categories.push("mothers-day");
    if (s.includes("fathers")) categories.push("fathers-day");
    if (s.includes("baby")) categories.push("new-baby");
    if (s.includes("graduation")) categories.push("graduation");
    if (s.includes("wedding")) categories.push("wedding");
    if (s.includes("getwell")) categories.push("getwell");
    if (s.includes("anniversary")) categories.push("anniversary");
    if (s.includes("thanksgiving")) categories.push("thanksgiving");
    if (s.includes("newyear")) categories.push("newyear");
    if (s.includes("autumn") || s.includes("fall")) categories.push("autumn");
    if (s.includes("winter")) categories.push("winter");
    if (s.includes("summer")) categories.push("summer");
    if (s.includes("spring")) categories.push("spring");
    if (s.includes("pets") || s.includes("dog") || s.includes("cat")) categories.push("pets");

    if (categories.length === 0) categories.push("general");
    return categories;
  }

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        const categorized = data.map((v) => ({
          ...v,
          categories: detectCategories(v.title || v.src),
        }));

        const filtered = categorized.filter((v) =>
          v.categories.includes(slug.toLowerCase())
        );

        setVideos(filtered);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [slug]);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        <p>Fetching your category videos 🎥</p>
      </main>
    );
  }

  if (videos.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-pink-50">
        <h1 className="text-3xl font-bold mb-4">Category not found 😢</h1>
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 pt-24 px-4 md:px-8 transition-all">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 capitalize text-pink-700">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-gray-700 text-lg">
          Discover beautiful Everwish cards for {slug.replace("-", " ")} ✨
        </p>

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

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVideos.map((v, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition relative group"
            whileHover={{ scale: 1.03 }}
          >
            <video
              src={v.src}
              className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90 pointer-events-none select-none"
              muted
              playsInline
              preload="metadata"
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
              onTouchStart={(e) => e.target.play()}
              onTouchEnd={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                {v.title}
              </h3>

              {/* 🔒 No descarga, sólo vista segura */}
              <button
                className="mt-2 text-xs text-pink-600 opacity-60 cursor-not-allowed"
                disabled
              >
                🔒 Protected Everwish Card
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
      }
