"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🖥️📱 PREVIEW FULLSCREEN UNIVERSAL
 * - En CEL: Cubre TODO (sin tabs de Chrome)
 * - En PC: Intenta fullscreen + cubre todo
 * - 3 segundos y navega a /edit
 */
export default function FullscreenPreview({ videoSrc, slug }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // 1. Bloquear scroll y gestos
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // 2. Intentar fullscreen (funciona en desktop, en móvil depende del navegador)
    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { // IE11
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen no disponible:", err);
      }
    };

    enterFullscreen();

    // 3. Countdown
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

    // 4. Cleanup
    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router, slug]);

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      {/* Video que cubre toda la pantalla */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full"
        style={{
          objectFit: "cover", // Cubre TODO (sin barras)
          objectPosition: "center",
        }}
      />

      {/* Botón de skip (opcional, puedes quitarlo) */}
      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg transition-all text-sm"
        style={{ zIndex: 10000 }}
      >
        Skip ({countdown}s)
      </button>
    </div>
  );
}
