"use client";
import { useState } from "react";
import Splash from "./components/Splash";
import Header from "./components/Header";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Header show={!showSplash} />
          <main className="pt-28 text-center">
            <h1 className="text-3xl font-bold">Discover a new world</h1>
            <p className="mt-4">Bienvenido a Everwish ✨</p>
          </main>
        </>
      )}
    </>
  );
}
