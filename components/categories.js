"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 🔹 Cargar lista desde /public/videos/index.json
  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("/videos/index.json");
        const data = await res.json();
        setItems(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Error loading index.json:", err);
      }
    }
    loadFiles();
  }, []);

  // 🔍 Filtrado dinámico
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      )
    );
  }, [search, items]);

  return (
    <section id="categories" className="text-center py-14">
      {/* ✅ Solo un título */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search for any theme — e.g. love, birthday, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎨 Resultados visuales */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <Link key={i} href={item.link || "#"}>
              <div
                className="rounded-full shadow-md flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-24 h-24 md:w-28 md:h-28"
                style={{
                  backgroundColor: item.color || "#fef3c7",
                }}
              >
                {item.image?.endsWith(".mp4") ? (
                  <video
                    src={item.image}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                )}
              </div>
              <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                {item.name}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matches found for “{search}”
          </p>
        )}
      </div>
    </section>
  );
}
