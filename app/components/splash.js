"use client";
import { useState, useEffect } from "react";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setProgress((old) => {
        if (step === 0) {
          step++;
          return 50; // primero al 50
        } else {
          clearInterval(interval);
          return 100; // luego al 100
        }
      });
    }, 1500);

    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className={`w-32 h-32 transition-opacity duration-3000 ${
          progress === 100 ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Barra rosa */}
      <div className="w-40 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div
          className="h-2 bg-pink-500 transition-all duration-1500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
