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
            <p className="text-gray-500 mb-10 text-center">
              With <b>Everwish</b>, every card becomes a memory you can relive.
            </p>

            {/* 🎞️ Carrusel */}
            <div className="w-full max-w-4xl mb-12">
              <Carousel />
            </div>

            {/* 📦 Contenedor blanco con sombra */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-8 mb-20 border border-pink-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                
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
