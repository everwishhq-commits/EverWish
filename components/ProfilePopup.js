"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * 💖 ProfilePopup
 * Ventana inicial del espacio personal Everwish
 */
export default function ProfilePopup({ open = true, onClose, onCreateNew, onViewExample }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose} // permite cerrar al hacer click fuera del contenido
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()} // evita cerrar si se hace click dentro
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center relative overflow-hidden"
        >
          {/* 🔘 Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-lg focus:outline-none"
            aria-label="Close popup"
          >
            ✕
          </button>

          {/* 💖 Contenido principal */}
          <h2 className="text-2xl font-bold text-pink-600 mb-3">💖 Welcome to Everwish</h2>

          <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
            <p>
              This is your personal space to create, send, and receive digital cards — just pure moments of joy. ✨
            </p>
            <p>
              🪶 In your personal panel, every card you make is automatically saved so you can easily manage or continue it later.
            </p>
            <p>
              💌 After your first secure purchase, you’ll receive your unique Everwish ID — sent directly to your email for safe access anytime.
            </p>
            <p>
              🎁 You’ll also find the cards that others have sent to you, all in one magical place.
            </p>
          </div>

          <p className="text-gray-700 font-semibold mt-5">
            Start by choosing a card below 💌
          </p>

          {/* 🎨 Botones principales */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onCreateNew}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition shadow-sm"
            >
              ✨ Create a New Card
            </button>

            <button
              onClick={onViewExample}
              className="bg-yellow-400 hover:bg-yellow-500 text-[#3b2b1f] font-semibold py-3 rounded-full transition shadow-sm"
            >
              🎁 View Example
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
