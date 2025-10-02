"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeout;
    if (progress < 50) {
      timeout = setTimeout(() => setProgress(50), 800);
    } else if (progress < 100) {
      timeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => onFinish(), 800);
      }, 800);
    }
    return () => clearTimeout(timeout);
  }, [progress, onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="everwish"
        width={180}
        height={70}
        className={`transition-opacity duration-1000 ${
          progress > 0 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Barra de carga */}
      <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mt-6">
        <div
          className="h-full bg-pink-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
