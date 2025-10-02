"use client";
import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(10);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let step = 90 / 30; // (100-10)/30 frames en 3 seg aprox
    let count = 0;

    const interval = setInterval(() => {
      count++;
      setProgress((p) => Math.min(100, p + step));

      if (count >= 30) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 500);
      }
    }, 100); // cada 100ms
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo parpadeando */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-40 h-40 animate-pulse mb-6"
      />

      {/* Barra rosada */}
      <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-pink-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
