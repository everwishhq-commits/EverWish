"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [starVisible, setStarVisible] = useState(false);

  useEffect(() => {
    let step1 = setTimeout(() => {
      setProgress(50);
      setStarVisible(true);   // ⭐ aparece con primer pulso
      setTimeout(() => setStarVisible(false), 500); // parpadeo rápido
    }, 1000);

    let step2 = setTimeout(() => {
      setProgress(100);
      setStarVisible(true);   // ⭐ segundo pulso
      setTimeout(() => setStarVisible(false), 500);
    }, 2000);

    let finish = setTimeout(() => onFinish(), 3000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finish);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative inline-block">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Everwish Logo"
          width={320}
          height={320}
          priority
        />

        {/* Estrella sincronizada con la barra */}
        {starVisible && (
          <span
            className="absolute text-yellow-400 text-4xl left-[65%] top-[58%] 
                       transform -translate-x-1/2 -translate-y-1/2"
          >
            ⭐
          </span>
        )}
      </div>

      {/* Barra pequeña */}
      <div className="w-32 h-1.5 bg-gray-700 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
