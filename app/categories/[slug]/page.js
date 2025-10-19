"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // 🔹 Cargar videos desde la API
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        // Busca los videos de la categoría actual
        const matches =
          data?.categories?.[slug] ||
          data?.all?.filter((v) => v.category === slug) ||
          [];

        setVideos(matches);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [slug]);

  // 🔍 Filtro interno
  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(query.toLowerCase())
  );

  // ⏳ Estado cargando
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 bg-pink-50">
        Loading cards...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 pt-24 pb-16 px-4">
      {/* 🔙 Volver */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      {/* 🏷️ Encabezado */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 capitalize">
          {slug.replace("-", " ")} Cards
        </h1>
        <p className="text-gray-700 text-lg">
          Find all Everwish animated cards in this category 💌
        </p>

        {/* 🔍 Buscador */}
        <div className="mt-6">
          <input
            type="text"
            placeholder={`Search in ${slug.replace("-", " ")}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-gray-700"
          />
        </div>
      </div>

      {/* 🎥 Galería de videos */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition cursor-pointer"
            >
              <Link href={`/edit/${v.slug}`}>
                <video
                  src={v.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[4/5] object-cover bg-gray-100"
                />
              </Link>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  {v.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 italic">
            No cards yet in this category — coming soon 💫
          </p>
        )}
      </div>
    </main>
  );
                      }
