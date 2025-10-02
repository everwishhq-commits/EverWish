"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 50; // avanza de 0 → 50 → 100
      setProgress(step);
      if (step >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onFinish(); // avisa que terminó
        }, 500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="everwish"
        width={180}
        height={70}
        className="mb-6 animate-pulse"
        priority
      />
      {/* Barra */}
      <div className="w-64 bg-gray-200 rounded-full h-3">
        <div
          className="bg-pink-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
