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

  if (showSplash) {
    return <Splash />;
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {/* Aquí ya va tu página real */}
      <h1 className="text-3xl font-bold">Bienvenido a Everwish 🎉</h1>
    </main>
  );
}
