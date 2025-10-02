"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-40 h-auto animate-pulse"
      />

      {/* Barra rosada de carga */}
      <div className="w-40 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="h-2 bg-pink-500 animate-progress"></div>
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
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
