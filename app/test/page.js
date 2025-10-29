"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Splash from "@/components/Splash";
import Carousel from "@/components/Carousel";

export default function TestPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700 pt-20 px-4">
          <h1 className="text-3xl font-bold mb-4">
            ✅ Test Page — Passed Splash
          </h1>
          <div className="w-full max-w-4xl mb-12">
            <Carousel />
          </div>
        </main>
      )}
    </>
  );
        }
