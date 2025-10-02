"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Splash onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />
          <main className="pt-32 md:pt-36 px-4 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold">
              Discover a new world
            </h1>
            <p className="mt-4 text-gray-600">Bienvenido a Everwish ✨</p>

            {/* Para probar el scroll */}
            <div className="h-[200vh] mt-10 bg-gradient-to-b from-white to-pink-100"></div>
          </main>
        </>
      )}
    </>
  );
}
