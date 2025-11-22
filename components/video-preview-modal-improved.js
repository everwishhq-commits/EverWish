"use client";

import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

export default function VideoPreviewModal({ videoUrl, onClose, imageName }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Detectar si la imagen tiene mucho margen blanco (como Veterans)
  const hasWhiteMargin = imageName?.toLowerCase().includes("veterans") || 
                         imageName?.toLowerCase().includes("margin") ||
                         imageName?.toLowerCase().includes("white");

  useEffect(() => {
    // Auto-play cuando se monta
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
    >
      {/* Botones de control */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-6 h-6 text-white" />
          ) : (
            <Maximize2 className="w-6 h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          title="Cerrar"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Contenedor del video */}
      <div className={`relative w-full max-w-4xl ${
        isFullscreen ? "h-full" : "max-h-[85vh]"
      }`}>
        
        {/* Video con ajuste inteligente */}
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full rounded-2xl ${
            hasWhiteMargin
              ? "object-contain bg-gradient-to-br from-gray-100 to-gray-200" // Para imágenes con margen blanco
              : "object-cover" // Para imágenes que ocupan todo el espacio
          }`}
          style={
            hasWhiteMargin
              ? {
                  // Agregar padding interno para imágenes con margen
                  padding: isFullscreen ? "5%" : "3%",
                  maxHeight: isFullscreen ? "100vh" : "85vh"
                }
              : {
                  // Sin padding para imágenes normales
                  maxHeight: isFullscreen ? "100vh" : "85vh"
                }
          }
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />

        {/* Info de ajuste (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
            <p>Modo: {hasWhiteMargin ? "Contain + Padding" : "Cover"}</p>
            <p>Fullscreen: {isFullscreen ? "Sí" : "No"}</p>
          </div>
        )}
      </div>

      {/* Indicador de reproducción */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <p className="text-white text-sm font-medium">
          Vista previa - La tarjeta se enviará en loop de 10 segundos
        </p>
      </div>
    </div>
  );
}
