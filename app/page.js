"use client";
import { useState } from "react";
import Splash from "./components/splash"; // 👈 minúscula aquí

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <main className="flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Bienvenido a Everwish</h1>
        </main>
      )}
    </>
  );
}
