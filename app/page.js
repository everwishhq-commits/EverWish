"use client";
import { useState, useEffect } from "react";
import Splash from "./components/splash";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {showSplash ? (
        <Splash />
      ) : (
        <div className="p-10 text-center">
          <h1 className="text-4xl font-bold">Bienvenido a Everwish 🎉</h1>
          <p className="mt-4 text-lg">Aquí vendrá el header, hero, carrusel, etc.</p>
        </div>
      )}
    </main>
  );
}
