"use client";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Header />
          <main className="pt-32 md:pt-36">
            <section className="max-w-3xl mx-auto px-4 text-center mt-4">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Discover a new world
              </h1>
              <p className="mt-4 text-gray-600">Bienvenido a Everwish ✨</p>
            </section>
          </main>
        </>
      )}
    </>
  );
}
