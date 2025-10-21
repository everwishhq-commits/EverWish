"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Splash from "@/components/splash";
import Header from "@/components/header";
import Carousel from "@/components/carousel";
import Categories from "@/components/categories";
import Footer from "@/components/footer";

export default function TestPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />

          <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700 pt-20 px-4">
            <h1 className="text-3xl font-bold mb-4">
              ✅ Test Page — Passed Splash
            </h1>

            <div className="w-full max-w-4xl mb-12">
              <Carousel />
            </div>

            <div className="w-full max-w-5xl">
              <Categories />
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
      }
