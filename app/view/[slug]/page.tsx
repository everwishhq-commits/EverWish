'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface CardData {
  id: string;
  recipientName: string;
  message: string;
  videoUrl: string;
  senderName: string;
  cardType: string;
  firstOpenedAt: string | null;
  timesOpened: number;
}

export default function ViewCardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCard();
  }, [slug]);

  const loadCard = async () => {
    try {
      // 1. Cargar datos de la tarjeta
      const response = await fetch(`/api/cards/${slug}`);

      if (!response.ok) {
        throw new Error('Tarjeta no encontrada');
      }

      const data = await response.json();
      setCard(data.card);

      // 2. Registrar vista
      await fetch(`/api/cards/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'view',
          timestamp: new Date().toISOString(),
        }),
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando tarjeta');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-2xl font-bold"
        >
          Cargando tu tarjeta... ✨
        </motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ⚠️ Oops!
          </h1>
          <p className="text-gray-600 mb-6">{error || 'Tarjeta no encontrada'}</p>
          
            href="https://everwish.cards"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Volver al inicio
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ¡Hola, {card.recipientName}! 💝
          </h1>
          <p className="text-xl text-white/90">
            {card.senderName} te envió una tarjeta especial
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="aspect-video bg-black">
            <video
              src={card.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              poster="/placeholder-video.jpg"
            >
              Tu navegador no soporta video HTML5.
            </video>
          </div>

          {/* Message Card */}
          <div className="p-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
              <p className="text-gray-800 text-lg leading-relaxed italic">
                "{card.message}"
              </p>
              <p className="text-right text-purple-600 font-semibold mt-4">
                - {card.senderName}
              </p>
            </div>

            {/* Stats */}
            {card.timesOpened > 1 && (
              <div className="text-center text-gray-500 text-sm">
                Has visto esta tarjeta {card.timesOpened} veces ✨
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          
            href="https://everwish.cards"
            className="text-white hover:text-white/80 transition underline"
          >
            🎁 Crea tu propia tarjeta en Everwish
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
