"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🎥 FULLSCREEN UNIVERSAL (VERSIÓN PERFECTA)
 * - PC → fullscreen REAL + object-contain (NO corta la tarjeta)
 * - Mobile → cubre toda la pantalla ↓ sin barras negras y sin swipe accidental
 */
export default function FullscreenPreview({ videoSrc, slug }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // 🔒 Bloquear scroll en móvil
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.position = "fixed";
    document.body.style.inset = "0";

    // 🖥️ En PC: fullscreen real
    const tryFullscreen = async () => {
      if (window.innerWidth >= 1024) {
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
        } catch (err) {
          console.log("Fullscreen PC error:", err);
        }
      }
    };

    tryFullscreen();

    // Contador
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/edit/${slug}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);

      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.inset = "";

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router, slug]);

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{
        zIndex: 99999,
        width: "100vw",
        height: "100vh",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      {/* ⛔ NO CORTA LA TARJETA - Siempre completa */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full"
        style={{
          objectFit: window.innerWidth >= 1024 ? "contain" : "cover",
          objectPosition: "center",
        }}
      />

      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="absolute top-5 right-5 bg-white/80 px-5 py-2 rounded-full text-gray-800 text-sm shadow-md"
        style={{ zIndex: 100000 }}
      >
        Skip ({countdown}s)
      </button>
    </div>
  );
}
