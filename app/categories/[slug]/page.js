"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Función que imita el detectCategory del backend
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
    if (s.includes("newyear")) return "newyear";
    if (s.includes("autumn") || s.includes("fall")) return "autumn";
    if (s.includes("winter")) return "winter";
    if (s.includes("summer")) return "summer";
    if (s.includes("spring")) return "spring";
    if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
    return "general";
  }

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        // 🔍 Detecta automáticamente la categoría del nombre del archivo
        const categorized = data.map((v) => ({
          ...v,
          category: detectCategory(v.title || v.src),
        }));

        // 🔥 Filtra solo los videos de esta categoría
        const filtered = categorized.filter(
          (v) => v.category === slug.toLowerCase()
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
    <main className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 capitalize">
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
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <video
              className="w-full h-48 object-cover"
              src={v.src}
              controls
              preload="metadata"
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-gray-800">{v.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
      }
