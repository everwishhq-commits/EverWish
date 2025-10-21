"use client";
import { useEffect } from "react";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-pink-100 flex items-center justify-center text-3xl font-bold text-gray-700">
      Everwish 💖
    </div>
  );
}
