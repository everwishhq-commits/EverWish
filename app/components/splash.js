"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0); // controla el fade
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fase 1: subir logo + barra a 50%
    setTimeout(() => {
      setProgress(50);
      setOpacity(0.6); // medio visible
    }, 200);

    // Fase 2: logo full visible + barra al 100%
    setTimeout(() => {
      setProgress(100);
      setOpacity(1); // totalmente visible

      // Desaparecer todo en 0.5s
      setTimeout(() => {
        setShow(false);
        if (onFinish) onFinish();
      }, 500);
    }, 2000);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo que hace fade */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-44 h-44 transition-opacity duration-1000"
        style={{ opacity }}
      />

      {/* Barra más corta que el logo */}
      <div className="w-32 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-2 bg-pink-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
