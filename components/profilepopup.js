"use client";

import { motion } from "framer-motion";

export default function ProfilePopup({ onClose, onCreateNew, onViewExample }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-8 text-center relative"
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        {/* Contenido principal */}
        <h2 className="text-2xl font-bold text-pink-600 mb-3">💖 Welcome to Everwish</h2>

        <p className="text-gray-600 mb-3 leading-relaxed">
          This is your personal space to create, send, and receive digital cards — just pure moments of joy. ✨
        </p>

        <p className="text-gray-600 mb-3 leading-relaxed">
          🪶 In your personal panel, every card you make is automatically saved so you can easily manage or continue it later.
        </p>

        <p className="text-gray-600 mb-3 leading-relaxed">
          💌 After your first secure purchase, you’ll receive your unique Everwish ID — sent directly to your email for safe access anytime.
        </p>

        <p className="text-gray-600 mb-3 leading-relaxed">
          🎁 You’ll also find the cards that others have sent to you, all in one magical place.
        </p>

        <p className="text-gray-700 font-semibold mt-4">
          Start by choosing a card below 💌
        </p>

        {/* Botones */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onCreateNew}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition"
          >
            ✨ Create a New Card
          </button>

          <button
            onClick={onViewExample}
            className="bg-yellow-400 hover:bg-yellow-500 text-[#3b2b1f] font-semibold py-3 rounded-full transition"
          >
            🎁 View Example
          </button>
        </div>
      </motion.div>
    </div>
  );
}
