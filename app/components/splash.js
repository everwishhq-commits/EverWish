"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let timeout1 = setTimeout(() => setProgress(50), 800); // primera mitad
    let timeout2 = setTimeout(() => setProgress(100), 1600); // segunda mitad
    let timeout3 = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 800); // terminar splash
    }, 2200);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-700 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo con fade */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-32 h-32 mb-6 animate-pulse"
      />

      {/* Barra rosa */}
      <div className="w-40 h-2 bg-pink-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
