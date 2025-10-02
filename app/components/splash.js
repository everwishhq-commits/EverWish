"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [starVisible, setStarVisible] = useState(false);

  useEffect(() => {
    // Primer pulso (0 → 50)
    let step1 = setTimeout(() => {
      setProgress(50);
      setStarVisible(true);
      setTimeout(() => setStarVisible(false), 500); // parpadeo
    }, 1000);

    // Segundo pulso (50 → 100)
    let step2 = setTimeout(() => {
      setProgress(100);
      setStarVisible(true);
      setTimeout(() => setStarVisible(false), 500); // parpadeo
    }, 2000);

    // Finalizar splash
    let finish = setTimeout(() => onFinish(), 3000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finish);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="relative inline-block">
        {/* Logo (igual que ya tienes) */}
        <Image
          src="/logo.png"
          alt="Everwish Logo"
          width={300}
          height={300}
          priority
        />

        {/* Estrella sobre la i */}
        {starVisible && (
          <span
            className="absolute text-yellow-400 text-3xl 
                       left-[72%] top-[40%] animate-pulse"
          >
            ⭐
          </span>
        )}
      </div>

      {/* Barra más pequeña */}
      <div className="w-28 h-1.5 bg-gray-200 rounded-full mt-5 overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
