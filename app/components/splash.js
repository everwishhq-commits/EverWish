"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const safeFinish = () => {
      try {
        if (typeof onFinish === "function") onFinish();
      } catch (err) {
        console.warn("⚠️ Splash onFinish error:", err);
      }
    };

    const step1 = setTimeout(() => setProgress(50), 500); // 0 → 50%
    const step2 = setTimeout(() => setProgress(100), 1000); // 50 → 100%
    const fadeAnim = setInterval(() => setFade((f) => !f), 500); // Parpadeo logo

    const finish = setTimeout(() => {
      clearInterval(fadeAnim);
      safeFinish();
    }, 2000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finish);
      clearInterval(fadeAnim);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative">
      {/* 🔹 Subimos todo el bloque visual ligeramente */}
      <div className="absolute top-[45%] -translate-y-1/2 flex flex-col items-center">
        {/* Logo parpadeando */}
        <div
          className={`transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-40"
          }`}
        >
          <Image src="/logo.png" alt="Everwish Logo" width={180} height={180} priority />
        </div>

        {/* Barra de carga */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
                                                                         }
