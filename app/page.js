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
          <main className="pt-24 md:pt-28 lg:pt-32 px-4 max-w-5xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Share every moment that matters with Everwish!
            </h1>
            <p className="mt-2 md:mt-3 lg:mt-4 text-sm md:text-lg lg:text-xl text-gray-700">
              Make it special today ✨
            </p>

            {/* Carousel */}
            <div className="mt-6 md:mt-8 lg:mt-10">
              <Carousel />
            </div>

            {/* Categories */}
            <section className="mt-10 md:mt-12 lg:mt-16 bg-white rounded-t-3xl shadow-lg py-8 md:py-10 lg:py-12 px-4">
              <Categories />
            </section>

            {/* Reviews */}
            <section className="mt-10 md:mt-12 lg:mt-16">
              <Reviews />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
