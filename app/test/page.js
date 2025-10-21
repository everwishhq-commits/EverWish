"use client";
import { useState } from "react";

// ✅ Importaciones absolutas (seguras para producción y Vercel)
import Splash from "@/components/splash";
import Carousel from "@/components/carousel";

export default function TestPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700">
          <h1 className="text-3xl font-bold mb-4">
            ✅ Test Page — Passed Splash
          </h1>

          {/* 🎠 Carrusel de prueba */}
          <div className="w-full max-w-4xl">
            <Carousel />
          </div>
        </main>
      )}
    </>
  );
}
