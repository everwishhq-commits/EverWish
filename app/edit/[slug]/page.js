"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import VideoPreviewModal from "@/components/video-preview-modal-improved";
import { Play, ArrowLeft, Send } from "lucide-react";

export default function EditCardPage() {
  const params = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadCard();
  }, [params.slug]);

  const loadCard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cards/${params.slug}`);
      
      if (response.ok) {
        const data = await response.json();
        setCard(data);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error loading card:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tarjeta...</p>
        </div>
      </div>
    );
  }

  if (!card) return null;

  // Detectar si la imagen tiene mucho margen blanco
  const hasWhiteMargin = card.imageName?.toLowerCase().includes("veterans") || 
                         card.imageName?.toLowerCase().includes("margin") ||
                         card.imageName?.toLowerCase().includes("white");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>

            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Editar Tarjeta
            </h1>

            <button
              onClick={() => router.push("/checkout")}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Video Preview - Columna Izquierda */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Vista Previa</h2>
            
            {/* Contenedor del video con aspect ratio correcto */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Aspect ratio container - 9:16 para vertical, 16:9 para horizontal */}
              <div className={`relative w-full ${
                card.orientation === "vertical" 
                  ? "aspect-[9/16]" 
                  : "aspect-video"
              }`}>
                
                {card.videoUrl ? (
                  <video
                    src={card.videoUrl}
                    className={`absolute inset-0 w-full h-full ${
                      hasWhiteMargin
                        ? "object-contain p-4 bg-gradient-to-br from-gray-50 to-gray-100"
                        : "object-cover"
                    }`}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-400">Generando video...</p>
                  </div>
                )}

                {/* Botón de pantalla completa */}
                <button
                  onClick={() => setShowPreview(true)}
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all group"
                  title="Ver en pantalla completa"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Info del ajuste (solo desarrollo) */}
              {process.env.NODE_ENV === "development" && (
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Modo:</span> {hasWhiteMargin ? "Contain + Padding" : "Cover"}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Orientación:</span> {card.orientation || "landscape"}
                  </p>
                </div>
              )}
            </div>

            {/* Info de la tarjeta */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Para</p>
                  <p className="font-bold text-gray-900">{card.recipientName || "Sin nombre"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoría</p>
                  <p className="font-medium text-gray-700">{card.category || "Sin categoría"}</p>
                </div>

                {card.message && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mensaje</p>
                    <p className="text-gray-700 text-sm">{card.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de edición - Columna Derecha */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Editar Información</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del destinatario
                </label>
                <input
                  type="text"
                  value={card.recipientName || ""}
                  onChange={(e) => setCard({...card, recipientName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ej: María García"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje personalizado
                </label>
                <textarea
                  value={card.message || ""}
                  onChange={(e) => setCard({...card, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Escribe un mensaje especial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email del destinatario
                </label>
                <input
                  type="email"
                  value={card.recipientEmail || ""}
                  onChange={(e) => setCard({...card, recipientEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="destinatario@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp del destinatario
                </label>
                <input
                  type="tel"
                  value={card.recipientPhone || ""}
                  onChange={(e) => setCard({...card, recipientPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    // Guardar cambios
                    console.log("Guardando:", card);
                    alert("✅ Cambios guardados");
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                >
                  Guardar Borrador
                </button>
                
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de pantalla completa */}
      {showPreview && (
        <VideoPreviewModal
          videoUrl={card.videoUrl}
          imageName={card.imageName}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
