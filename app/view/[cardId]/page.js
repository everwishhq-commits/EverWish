"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AnimationOverlay } from "@/lib/animations";

export default function ViewCardPage() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    async function loadCard() {
      try {
        // Simular carga de tarjeta desde Drive
        // En producción, deberías tener un endpoint /api/cards/[cardId]
        
        // Por ahora, extraer info del cardId
        const slug = cardId.split('-')[0] || 'birthday';
        
        // Buscar el video correspondiente
        const res = await fetch("/api/videos");
        const data = await res.json();
        const videos = data.videos || [];
        
        const video = videos.find(v => v.name.includes(slug)) || videos[0];
        
        if (video) {
          setVideoSrc(video.file);
          setCard({
            id: cardId,
            slug: video.name,
            message: "Wishing you love and happiness! ✨",
            sender: { name: "Someone Special" },
            recipient: { name: "You" },
            animation: "✨ Sparkles",
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading card:", err);
        setError("Card not found");
        setLoading(false);
      }
    }

    if (cardId) {
      loadCard();
    }
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-bold text-pink-600"
        >
          Loading your card... ✨
        </motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Card Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This card may have been removed or the link is incorrect.
          </p>
          <a
            href="https://everwish.cards"
            className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition inline-block"
          >
            Create Your Own Card
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animación de fondo */}
      {card.animation && (
        <AnimationOverlay
          slug={card.slug}
          animation={card.animation}
          intensity="normal"
          opacityLevel={0.7}
          emojiCount={15}
        />
      )}

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Encabezado */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2"
            >
              You Received a Card! 💌
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700"
            >
              From <span className="font-bold text-pink-600">{card.sender.name}</span>
            </motion.p>
          </div>

          {/* Card Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-100">
            {/* Video */}
            <div className="relative aspect-video bg-black">
              {videoSrc && (
                <video
                  src={videoSrc}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              )}
            </div>

            {/* Message */}
            <div className="p-8">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 border border-pink-200">
                <p className="text-gray-800 text-lg leading-relaxed italic text-center">
                  &quot;{card.message}&quot;
                </p>
                <p className="text-right text-pink-600 font-semibold mt-4">
                  — {card.sender.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video) {
                      video.currentTime = 0;
                      video.play();
                    }
                  }}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition"
                >
                  🔁 Replay Card
                </button>
                
                <a
                  href="https://everwish.cards"
                  className="px-6 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition text-center"
                >
                  ✨ Create Your Own
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Made with ❤️ using{" "}
              <a
                href="https://everwish.cards"
                className="text-pink-500 font-semibold hover:underline"
              >
                Everwish
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
