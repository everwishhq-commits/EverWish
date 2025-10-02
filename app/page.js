"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
        {/* círculo con el logo */}
        <div className="flex items-center justify-center w-48 h-48 rounded-full bg-white shadow-lg">
          <img
            src="/logo.png"
            alt="Everwish Logo"
            className="w-32 h-auto animate-pulse"
          />
        </div>

        {/* barra de progreso */}
        <div className="w-56 h-2 bg-gray-700 rounded-full mt-6 overflow-hidden">
          <div
            className="h-2 bg-pink-500 rounded-full animate-[progress_3s_linear_forwards]"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Página Principal</h1>
      <p className="mt-4 text-lg">Aquí seguirá el header, carrusel, categorías...</p>
    </main>
  );
}
