"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";
import Carousel from "./components/carousel";
import Categories from "./components/categories";

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

            {/* Carrusel */}
            <div className="mt-12">
              <Carousel />
            </div>

            {/* Categorías */}
            <div className="mt-16">
              <Categories />
            </div>

            {/* Scroll para ver animaciones */}
            <div className="h-[100vh]"></div>
          </main>
        </>
      )}
    </>
  );
}
