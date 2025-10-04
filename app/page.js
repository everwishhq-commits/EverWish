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
          {/* 👇 padding reducido y sin max-w aquí */}
          <main className="pt-20 md:pt-24 lg:pt-28 px-4 mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Share every moment that matters with Everwish
            </h1>
            <p className="mt-3 text-lg text-gray-700">Make it special today ✨</p>

            {/* Carousel más cerca del título */}
            <div className="mt-6 md:mt-8">
              <Carousel />
            </div>

            {/* Categories más pegadas al carrusel */}
            <section className="mt-8 md:mt-10 bg-white rounded-t-3xl shadow-lg py-12 px-4 max-w-5xl mx-auto">
              <Categories />
            </section>

            {/* Reviews */}
            <section className="mt-12 md:mt-14 max-w-5xl mx-auto">
              <Reviews />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
