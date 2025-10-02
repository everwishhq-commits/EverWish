"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";
import Carousel from "./components/carousel";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />
          <main className="pt-32 md:pt-36 px-4 max-w-6xl mx-auto text-center">
            {/* Mensaje principal */}
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Discover a new world
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Bienvenido a Everwish ✨
            </p>

            {/* Carrusel Top 10 */}
            <div className="mt-12">
              <Carousel />
            </div>

            {/* Placeholder para categorías */}
            <section className="mt-20">
              <h2 className="text-2xl font-bold mb-6">Categorías</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  🎂
                </div>
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  🎓
                </div>
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  👶
                </div>
              </div>
            </section>

            {/* Scroll para ver movimiento */}
            <div className="h-[100vh]"></div>
          </main>
        </>
      )}
    </>
  );
}
