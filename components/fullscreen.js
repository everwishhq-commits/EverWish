"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 📱 MÓVIL → FULLSCREEN REAL
 * 🖥️ PC → VIEWER GRANDE CON BORDES ROSADOS
 */
export default function Fullscreen({ videoSrc, slug }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  // Detectar si es móvil
  const isMobile =
    typeof window !== "undefined" &&
    (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth < 768);

  useEffect(() => {
    const elem = document.documentElement;

    const enterMobileFullscreen = async () => {
      try {
        if (elem.requestFullscreen) await elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen)
          await elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen)
          await elem.msRequestFullscreen();
      } catch (err) {
        console.log("Fullscreen móvil no disponible:", err);
      }
    };

    // SOLO en móvil hacemos fullscreen real
    if (isMobile) enterMobileFullscreen();

    // Countdown para ir a /edit
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

    return () => {
      clearInterval(timer);

      // Salir de fullscreen solo si realmente lo usamos
      if (isMobile && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router, slug, isMobile]);

  //
  //  🎨 UI DIFERENTE SEGÚN DISPOSITIVO
  //

  // 📱 UI para MÓVIL → FULLSCREEN NEGRO (como estaba)
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        />

        <button
          onClick={() => router.push(`/edit/${slug}`)}
          className="absolute top-8 right-8 bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg transition-all z-10"
        >
          Skip Preview ({countdown}s)
        </button>
      </div>
    );
  }

  //
  // 🖥️ UI para PC → VIEWER ROSADO VERTICAL
  //
  return (
    <div className="fixed inset-0 bg-pink-200 z-[9999] flex items-center justify-center">
      <div className="h-screen max-h-screen flex items-center justify-center px-10">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full max-h-screen object-contain rounded-2xl shadow-2xl"
        />
      </div>

      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="absolute top-8 right-8 bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg transition-all z-20"
      >
        Skip Preview ({countdown}s)
      </button>
    </div>
  );
}
