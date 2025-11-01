"use client";
import { useEffect } from "react";

export default function FullPreview({ src, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // ⏱️ vuelve en 4 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

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
