"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";
import Carousel from "./components/carousel";
import Categories from "./components/categories";
import Reviews from "./components/reviews";
import Footer from "./components/footer";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />
          <main className="pt-20 md:pt-24 lg:pt-28 px-4 max-w-5xl mx-auto text-center">
            
            {/* Título */}
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Share every moment that matters with Everwish
            </h1>
            
            {/* Subtítulo */}
            <p className="mt-3 md:mt-4 lg:mt-5 text-lg text-gray-700">
              Make it special today ✨
            </p>

            {/* Carrusel */}
            <div className="mt-6 md:mt-8 lg:mt-10">
              <Carousel />
            </div>

            {/* Categorías */}
            <section className="mt-6 md:mt-8 lg:mt-10 bg-white rounded-t-3xl shadow-lg py-10 md:py-12 lg:py-14 px-4">
              <Categories />
            </section>

            {/* Reviews */}
            <section className="mt-12 md:mt-14 lg:mt-16">
              <Reviews />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
