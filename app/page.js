"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";
import Carousel from "./components/carousel";
import Categories from "./components/categories";
import Reviews from "./components/reviews";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Header />
          <main className="pt-28 md:pt-28">
            {/* Títulos */}
            <section className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold">
                Discover a new world
              </h1>
              <p className="mt-4 text-gray-600">Bienvenido a Everwish ✨</p>
            </section>

            {/* Carrusel TOP 10 */}
            <section className="mt-8 px-4">
              <Carousel />
            </section>

            {/* Banda blanca: categorías + reviews */}
            <section className="mt-10 bg-white rounded-t-3xl shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
              <div className="max-w-5xl mx-auto px-4 py-10">
                <Categories />
                <Reviews />
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
}
