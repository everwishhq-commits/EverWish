"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo con efecto parpadeo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-28 h-28 mb-6 animate-pulse" // más pequeño (antes w-40 h-40)
      />

      {/* Barra rosada */}
      <div className="w-48 h-2 bg-pink-200 rounded-full overflow-hidden">
        <div className="h-full bg-pink-500 animate-progress"></div>
      </div>
    </div>
  );
}
