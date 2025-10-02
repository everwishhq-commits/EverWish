"use client";
import { useState, useEffect } from "react";

export default function Splash() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 10;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <img
        src="/logo.png"
        alt="Everwish Logo"
        className="w-40 h-auto animate-pulse"
      />
      <div className="w-56 h-2 bg-gray-700 rounded-full mt-6 overflow-hidden">
        <div
          className="h-2 bg-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
