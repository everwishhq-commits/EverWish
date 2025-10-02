"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [progress, setProgress] = useState(10);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setHidden(true), 500); // espera un poco antes de ocultar
          }
          return next;
        });
      }, 300); // 3 segundos total
      return () => clearInterval(interval);
    }
  }, [progress]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-40 h-40 object-contain animate-pulse"
      />
      {/* Barra de progreso */}
      <div className="w-1/2 h-2 bg-pink-200 rounded-full mt-4 overflow-hidden">
        <div
          className="h-2 bg-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
