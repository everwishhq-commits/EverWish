"use client";
import { useState } from "react";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import Carousel from "../components/carousel.js";
import Categories from "../components/categories.js";
import Splash from "../components/splash.js";

export default function TestPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Header />

          <main className="pt-24 md:pt-28 px-4 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Test Page — Everwish
            </h1>
            <p className="text-gray-600 mb-8">
              This page is used to test UI components before deployment.
            </p>

            <div className="mb-8">
              <Carousel />
            </div>

            <div className="mt-12">
              <Categories />
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
