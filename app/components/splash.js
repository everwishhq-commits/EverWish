"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Splash dura 3 segundos
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null; // Cuando termina, desaparece

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="h-32 w-auto animate-pulse"
      />

      {/* Barra de carga */}
      <div className="w-40 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="h-2 bg-pink-500 animate-[progress_3s_linear_forwards]"></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 10%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
