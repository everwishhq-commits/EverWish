"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Header from "@/components/header";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Splash from "@/components/splash";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* ⏳ Splash inicial */}
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {/* 🌸 Contenido principal */}
      {!loading && (
        <>
          <Header />

          <main
            className="flex flex-col items-center justify-start min-h-screen bg-[#fff5f8] text-gray-700 pt-20 px-4 select-none"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y pinch-zoom",
            }}
          >
            {/* 🩷 Mensaje principal */}
            <section className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Share every moment that matters with Everwish
              </h1>
              <p className="text-gray-500 text-base">
                Make it special today ✨
              </p>
            </section>

            {/* 🎠 Carrusel */}
            <div
              className="w-full max-w-5xl mb-12 overflow-hidden"
              style={{
                touchAction: "pan-x",
                overscrollBehaviorX: "contain",
              }}
            >
              <Carousel />
            </div>

            {/* 🗂 Categorías */}
            <div className="w-full max-w-5xl">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                Categories
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
