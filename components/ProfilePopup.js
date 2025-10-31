"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function ProfilePopup({ open = true, onClose, onCreateNew, onViewExample }) {
  // 🧩 Bloquea el scroll del fondo cuando el popup está activo
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center relative border border-pink-100"
          >
            {/* ✕ Botón de cerrar */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-full"
            >
              ✕
            </button>

            {/* 💖 Contenido */}
            <h2 className="text-2xl font-bold text-pink-600 mb-3">
              Welcome to Everwish 💖
            </h2>

            <p className="text-gray-600 mb-3 leading-relaxed">
              This is your personal space to create, send, and receive digital cards — 
              pure moments of joy. ✨
            </p>

            <p className="text-gray-600 mb-3 leading-relaxed">
              🪶 Every card you make is saved automatically, so you can revisit or 
              continue it anytime from your Everwish space.
            </p>

            <p className="text-gray-600 mb-3 leading-relaxed">
              💌 After your first secure purchase, you’ll receive your unique Everwish ID 
              directly by email for safe access anytime.
            </p>

            <p className="text-gray-600 mb-3 leading-relaxed">
              🎁 You’ll also see cards others have sent you — all in one magical place.
            </p>

            <p className="text-gray-700 font-semibold mt-4">
              Start by choosing a card below 💌
            </p>

            {/* 🔘 Botones de acción */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onCreateNew}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition focus:ring-2 focus:ring-pink-300"
              >
                ✨ Create a New Card
              </button>

              <button
                onClick={onViewExample}
                className="bg-yellow-400 hover:bg-yellow-500 text-[#3b2b1f] font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition focus:ring-2 focus:ring-yellow-300"
              >
                🎁 View Example
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
                }
