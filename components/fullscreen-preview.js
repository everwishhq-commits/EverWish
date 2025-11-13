"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🖥️ PREVIEW FULLSCREEN OPTIMIZADO
 * - Sin barras negras (object-cover)
 * - Funciona en PC y móvil
 */
export default function FullscreenPreview({ videoSrc, slug }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Bloquear scroll
    document.body.style.overflow = 'hidden';

    // Intentar fullscreen (solo desktop)
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
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
          console.log("Fullscreen bloqueado:", err);
        }
      };
      enterFullscreen();
    }

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
      document.body.style.overflow = '';
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router, slug]);

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Video SIN BARRAS - cubre toda la pantalla */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover', // 🔥 ESTO ELIMINA LAS BARRAS NEGRAS
          objectPosition: 'center',
        }}
      />

      {/* Botón de skip */}
      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-lg transition-all z-10 text-sm md:text-base"
      >
        Skip ({countdown}s)
      </button>
    </div>
  );
}
