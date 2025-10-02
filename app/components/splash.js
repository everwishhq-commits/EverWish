"use client";
import { useState, useEffect } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [moveToHeader, setMoveToHeader] = useState(false);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setProgress((old) => {
        if (step === 0) {
          step++;
          return 50; // primero va al 50
        } else {
          clearInterval(interval);
          return 100; // luego al 100
        }
      });
    }, 1500);

    const timeout = setTimeout(() => {
      setMoveToHeader(true); // activa la animación de subida
      setTimeout(() => {
        onFinish(); // después de subir, activa el header real
      }, 1200);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 overflow-hidden">
      {/* Logo que sube */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className={`w-32 h-32 transition-all duration-1000 ${
          moveToHeader
            ? "absolute top-5 left-10 w-14 h-14" // se mueve arriba izquierda, más pequeño
            : "relative"
        }`}
      />

      {/* Barra rosa */}
      {!moveToHeader && (
        <div className="w-40 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div
            className="h-2 bg-pink-500 transition-all duration-1500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
