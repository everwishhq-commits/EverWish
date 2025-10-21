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

          {/* 🌸 Fondo Everwish pastel */}
          <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-700 pt-20 px-4">
            
            {/* ✨ Mensaje principal */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-[#3b2b1f]">
                Share every moment that matters with <span className="text-pink-500">Everwish</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Make it special today ✨
              </p>
            </div>

            {/* 🎠 Carrusel */}
            <div className="w-full max-w-4xl mb-12">
              <Carousel />
            </div>

            {/* 🗂️ Categorías */}
            <section className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-pink-100 p-8 text-center mb-20">
              <h2 className="text-2xl font-bold text-pink-600 mb-6">Categories</h2>
              <Categories />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
        }
