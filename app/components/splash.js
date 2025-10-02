"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Etapa 1: llegar rápido al 50%
    setTimeout(() => setProgress(50), 500);

    // Etapa 2: llegar al 100% más lento
    setTimeout(() => {
      let current = 50;
      const interval = setInterval(() => {
        current += 10;
        if (current >= 100) {
          clearInterval(interval);
          setProgress(100);
          // Espera medio segundo y cierra
          setTimeout(() => {
            setShow(false);
            if (onFinish) onFinish();
          }, 500);
        } else {
          setProgress(current);
        }
      }, 300); // sube cada 0.3s hasta 100
    }, 1000); // inicia después de 1s
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo más grande y parpadeando */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-40 h-40 animate-pulse"
      />

      {/* Barra de carga (sin texto ni % ) */}
      <div className="w-64 h-3 bg-gray-200 rounded-full mt-8">
        <div
          className="h-3 bg-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
