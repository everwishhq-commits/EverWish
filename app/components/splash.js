"use client";
import { useState, useEffect } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    // Animar la barra: 0 → 50 → 100 en 3s
    interval = setInterval(() => {
      setProgress((old) => {
        if (old < 50) return 50;
        if (old < 100) return 100;
        clearInterval(interval);
        return 100;
      });
    }, 1500);

    // Finaliza después de 3s
    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo animado */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className={`w-28 h-28 transition-all duration-1000 ${
          progress === 100 ? "translate-x-[-40vw] translate-y-[-40vh] w-16 h-16" : ""
        }`}
      />

      {/* Barra rosa */}
      <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-2 bg-pink-500 transition-all duration-1500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
