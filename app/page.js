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
          <main className="pt-32 md:pt-36 px-4 max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Share every moment that matters with Everwish
            </h1>
            <p className="mt-4 text-lg text-gray-700">Make it special today ✨</p>

            {/* Carousel */}
            <div className="mt-10">
              <Carousel />
            </div>

            {/* Categories */}
            <section className="mt-16 bg-white rounded-t-3xl shadow-lg py-12 px-4">
              <Categories />
            </section>

            {/* Reviews */}
            <section className="mt-16">
              <Reviews />
            </section>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
