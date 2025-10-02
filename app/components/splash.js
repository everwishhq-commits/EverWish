"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 300); // después del 100 desaparece
          return 100;
        }
        if (prev < 50) return 50;
        return 100;
      });
    }, 1000); // 1 segundo a 50, 1 segundo a 100

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <Image
        src="/logo.png"
        alt="Logo Everwish"
        width={180}
        height={70}
        className={`animate-pulse transition-opacity duration-1000 ${
          progress === 100 ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Barra */}
      <div className="w-64 h-3 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
