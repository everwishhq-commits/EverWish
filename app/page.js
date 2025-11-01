"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";
import Reviews from "@/components/Reviews"; // opcional, si ya lo tienes

export default function Page() {
  const [loading, setLoading] = useState(true);

  // 🕒 Evita parpadeo en montaje (transición suave desde Splash)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Splash onFinish={() => setLoading(false)} />;

  return (
    <>
      <Header />

      {/* 🌸 Fondo Everwish - suave degradado rosado */}
      <main
        className="flex flex-col items-center justify-start min-h-screen text-gray-700 pt-20 px-4"
        style={{
          background:
            "linear-gradient(to bottom, #fff5f7 0%, #fff8f9 40%, #ffffff 100%)",
        }}
      >
        {/* ✨ Sección principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-800 leading-tight">
            Share moments that last forever 💫
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            With <b className="text-pink-500">Everwish</b>, every card becomes a
            memory you can relive and share anywhere.
          </p>
        </motion.div>

        {/* 🎞️ Carrusel principal */}
        <div className="w-full max-w-4xl mb-16">
          <Carousel />
        </div>

        {/* 📂 Categorías */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-full bg-white rounded-3xl shadow-lg px-2 py-8 mb-16 border border-pink-100 max-w-5xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
            Explore Categories 🌈
          </h2>
          <Categories />
        </motion.section>

        {/* 💬 Reseñas opcionales */}
        {/* <div className="w-full max-w-5xl mb-20">
          <Reviews />
        </div> */}
      </main>

      <Footer />
    </>
  );
}
