"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🖥️ PREVIEW FULLSCREEN PARA PC
 * Se muestra 3 segundos y luego navega a /edit
 */
export default function FullscreenPreview({ videoSrc, slug }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Intentar fullscreen
    const elem = document.documentElement;
    const enterFullscreen = async () => {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen no disponible:", err);
      }
    };

    enterFullscreen();

    // Countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
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
      // Salir de fullscreen al desmontar
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router, slug]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {/* Video centrado y ajustado */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
        style={{
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      />

      {/* Botón de skip */}
      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="absolute top-8 right-8 bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg transition-all z-10"
      >
        Skip Preview ({countdown}s)
      </button>
    </div>
  );
          }
