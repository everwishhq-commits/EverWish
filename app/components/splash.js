"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fase 1: directo a 50% en 1s
    setTimeout(() => setProgress(50), 200);

    // Fase 2: directo a 100% en 2s
    setTimeout(() => {
      setProgress(100);
      // Ocultar después de 0.5s
      setTimeout(() => {
        setShow(false);
        if (onFinish) onFinish();
      }, 500);
    }, 2000);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo grande con parpadeo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-44 h-44 animate-pulse"
      />

      {/* Barra más corta y debajo del logo */}
      <div className="w-32 h-2 bg-gray-200 rounded-full mt-6">
        <div
          className="h-2 bg-pink-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
