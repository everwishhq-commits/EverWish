"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Paso 1: cargar al 10% rápido
    setTimeout(() => {
      setProgress(10);
    }, 300); // 0.3 seg

    // Paso 2: cargar hasta 100% en 3 segundos
    let timeout = setTimeout(() => {
      let current = 10;
      const interval = setInterval(() => {
        current += 10;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            if (onFinish) onFinish();
          }, 500); // espera medio segundo antes de quitar
        }
        setProgress(current);
      }, 300); // cada 0.3 seg suma 10
    }, 600);

    return () => clearTimeout(timeout);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo con parpadeo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-32 h-32 animate-pulse"
      />

      {/* Barra de progreso */}
      <div className="w-64 h-3 bg-gray-200 rounded-full mt-6">
        <div
          className="h-3 bg-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm text-gray-500">{progress}%</p>
    </div>
  );
}
