"use client";
import { useState } from "react";
import Link from "next/link";

// ✅ Importaciones absolutas (funcionan con jsconfig.json)
import Splash from "@/components/splash";
import Header from "@/components/header";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import Reviews from "@/components/reviews";
import Footer from "@/components/footer";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* 🔹 Pantalla inicial de carga */}
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {/* 🔹 Contenido principal */}
      {!loading && (
        <>
          <Header />

          <main className="pt-24 md:pt-28 lg:pt-32 px-4 max-w-5xl mx-auto text-center">
            {/* 🏷️ Título principal */}
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Share every moment that matters with Everwish
            </h1>

            {/* ✨ Subtítulo */}
            <p className="mt-4 text-lg text-gray-700">
              Make it special today ✨
            </p>

            {/* 🎠 Carrusel de videos destacados */}
            <div className="mt-8">
              <Carousel />
            </div>

            {/* 🗂️ Sección de categorías */}
            <section className="mt-12 bg-white rounded-t-3xl shadow-lg py-12 px-4">
              <div className="flex justify-center mb-6">
                <Link
                  href="/categories"
                  className="text-2xl font-bold hover:text-blue-500 transition-colors"
                >
                  Categories
                </Link>
              </div>
              <Categories />
            </section>

            {/* 💬 Reseñas recientes */}
            <section className="mt-16">
              <Reviews />
            </section>
          </main>

          {/* 🔸 Pie de página */}
          <Footer />
        </>
      )}
    </>
  );
              }
