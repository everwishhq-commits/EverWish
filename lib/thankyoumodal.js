"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ThankYouModal({ sender, onClose }) {
  const handleSend = () => {
    alert(`Message sent to ${sender}!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[600]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-md relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>

          <h2 className="text-center text-xl font-semibold text-pink-600 mb-3">
            💖 Send a Thank You
          </h2>

          <textarea
            className="w-full rounded-xl border p-3 text-center text-gray-700 focus:border-pink-400 focus:ring-pink-400"
            rows={3}
            placeholder="Write your thank-you message..."
          />

          <button
            onClick={handleSend}
            className="mt-4 w-full rounded-full bg-pink-500 text-white font-semibold py-3 hover:bg-pink-600 shadow"
          >
            💌 Send
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
