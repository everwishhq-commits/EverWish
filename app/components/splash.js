"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShow(false), 500); // medio segundo y desaparece
          return 100;
        }
        return prev + 10; // avanza de 10 en 10
      });
    }, 300); // cada 0.3s
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <div className="w-40 h-40 flex items-center justify-center rounded-full border-4 border-pink-500">
        <img
          src="/logo.png"
          alt="Everwish Logo"
          className="w-24 h-24 animate-pulse"
        />
      </div>

      {/* Barra de progreso */}
      <div className="w-64 h-3 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-3 bg-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
