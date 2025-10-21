"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Secuencia del progreso
    const step1 = setTimeout(() => setProgress(50), 600);
    const step2 = setTimeout(() => setProgress(100), 1300);

    // Efecto de parpadeo del logo
    const fadeAnim = setInterval(() => setFade((f) => !f), 600);

    // Finaliza el splash después de 2.5s
    const finish = setTimeout(() => {
      clearInterval(fadeAnim);
      if (typeof onFinish === "function") onFinish();
    }, 2500);

    // Limpieza de efectos
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finish);
      clearInterval(fadeAnim);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white relative overflow-hidden">
      {/* Círculos suaves animados */}
      <div className="absolute w-40 h-40 bg-pink-200/40 blur-3xl rounded-full top-16 left-10 animate-pulse" />
      <div className="absolute w-48 h-48 bg-rose-300/40 blur-3xl rounded-full bottom-12 right-10 animate-bounce-slow" />

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo parpadeante */}
        <div
          className={`transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-50"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Everwish Logo"
            width={160}
            height={160}
            priority
            className="drop-shadow-md"
          />
        </div>

        {/* Barra de carga */}
        <div className="w-52 h-2 bg-gray-200 rounded-full overflow-hidden mt-6 shadow-inner">
          <div
            className="h-full bg-pink-500 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Texto inferior */}
        <p className="mt-4 text-sm text-gray-500 tracking-wide animate-fade-in">
          Loading Everwish magic ✨
        </p>
      </div>

      {/* Animación extra personalizada */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 2s ease forwards;
        }
      `}</style>
    </div>
  );
}
