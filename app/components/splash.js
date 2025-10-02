"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(progress + 10);
      }, 300); // cada 0.3s aumenta
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo en el centro */}
      <img
        src="/logo.png"
        alt="Logo"
        className="w-40 h-40 mb-6 animate-pulse"
      />

      {/* Barra de carga debajo del logo */}
      <div className="w-56 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
