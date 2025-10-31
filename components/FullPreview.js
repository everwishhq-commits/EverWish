"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function FullPreview({ src, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // ⏱️ Vuelve en 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black"
      style={{
        width: "100vw",
        height: "100vh",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="object-contain w-full h-full"
      />

      {/* 🔘 Botón de cierre manual */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold transition-all"
        aria-label="Close preview"
      >
        ×
      </button>
    </motion.div>
  );
}
