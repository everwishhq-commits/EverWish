"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(progress + 10);
      }, 300); // 3 seg hasta 100
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
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="w-32 h-32 mb-6 animate-pulse"
      />

      {/* Barra de carga */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
