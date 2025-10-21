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
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Header />

          {/* 🌸 Fondo pastel rosado */}
          <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-white text-gray-700 pt-20 px-4">
            
            {/* ✨ Mensaje de bienvenida */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Share Every Moment with EverWish 💌
              </h1>
              <p className="text-gray-600 text-lg">
                Send love, laughter, and magic through beautiful animated cards ✨
              </p>
            </div>

            {/* 🎠 Carrusel */}
            <div className="w-full max-w-4xl mb-12">
              <Carousel />
            </div>

            {/* 🗂️ Categorías */}
            <section className="w-full max-w-5xl text-center mb-20">
              <h2 className="text-2xl font-bold text-pink-600 mb-6">
                Categories 💖
              </h2>
              <Categories />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
        }
