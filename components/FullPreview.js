"use client";
import { useEffect } from "react";

export default function fullpreview({ src, onclose }) {
  useEffect(() => {
    const timer = setTimeout(onclose, 4000); // ⏱️ 4 s y vuelve
    return () => clearTimeout(timer);
  }, [onclose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      style={{
        width: "100vw",
        height: "100vh",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="object-contain w-full h-full"
      />
    </div>
  );
}
