"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Splash from "@/components/splash";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  // 🔹 Cargar todas las tarjetas disponibles
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      }
    }
    loadData();
  }, []);

  // 🔍 Función de búsqueda global
  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim().toLowerCase();

    if (!term) return;

    // Buscar coincidencia con categoría o subcategoría
    const found = videos.find((v) =>
      [v.category, v.subcategory, v.categories, v.object]
        .flat()
        .filter(Boolean)
        .some((txt) => txt.toLowerCase().includes(term))
    );

    if (found) {
      // Redirigir a la categoría principal encontrada
      const mainCategory =
        (found.categories && found.categories[0]) ||
        found.category ||
        found.subcategory;
      if (mainCategory) {
        router.push(`/category/${mainCategory.toLowerCase().replace(/\s+/g, "-")}`);
      } else {
        alert("No related category found.");
      }
    } else {
      alert("No matches found for: " + term);
    }
  };

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />

          {/* 🌸 Fondo rosado → blanco extendido hasta el footer */}
          <main
            className="flex flex-col items-center justify-start min-h-screen text-gray-700 pt-20 px-4"
            style={{
              background:
                "linear-gradient(to bottom, #fff5f7 0%, #fff8f9 40%, #ffffff 100%)",
            }}
          >
            {/* ✨ Mensaje principal */}
            <h1 className="text-3xl font-bold mb-3 text-gray-800 text-center">
              Share moments that last forever 💫
            </h1>
            <p className="text-gray-500 mb-8 text-center">
              With <b>Everwish</b>, every card becomes a memory you can relive.
            </p>

            {/* 🔍 Barra de búsqueda global */}
            <form
              onSubmit={handleSearch}
              className="w-full flex justify-center mb-10"
            >
              <input
                type="text"
                placeholder="Search any theme — e.g. yeti, turtle, love, holidays..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 md:w-96 px-4 py-3 rounded-full border border-pink-200 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-center"
              />
            </form>

            {/* 🎞️ Carrusel */}
            <div className="w-full max-w-4xl mb-12">
              <Carousel />
            </div>

            {/* 📦 Contenedor blanco con sombra */}
            <div className="w-full bg-white rounded-3xl shadow-lg px-2 py-4 mb-10 border border-pink-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                Explore all Everwish categories ✨
              </h2>
              <Categories />
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
