"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Top10Carousel from "@/components/Top10Carousel";
import CategoriesCarousel from "@/components/CategoriesCarousel";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";

export default function Page() {
  const [loading, setLoading] = useState(true);

  // 🕒 Splash de entrada (animación inicial Everwish)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Header />

          {/* 🌸 Fondo rosado → blanco (fluido y elegante) */}
          <main
            className="flex flex-col items-center justify-start min-h-screen text-gray-700 pt-16 sm:pt-20 px-3 sm:px-4"
            style={{
              background:
                "linear-gradient(180deg, #fff5f7 0%, #fff8f9 60%, #ffffff 100%)",
            }}
          >
            {/* ✨ Título principal */}
            <h1 className="text-3xl font-bold mb-3 text-gray-800 text-center">
              Share moments that last forever 💫
            </h1>
            <p className="text-gray-500 mb-10 text-center">
              With <b>Everwish</b>, every card becomes a memory you can relive.
            </p>

            {/* 🎞️ Carrusel Top 10 */}
            <div className="w-full max-w-4xl mb-12">
              <Top10Carousel />
            </div>

            {/* 📦 Bloque blanco con sombra (categorías) */}
            <div className="w-full bg-white rounded-3xl shadow-lg px-2 py-6 mb-10 border border-pink-100">
              <CategoriesCarousel />
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
