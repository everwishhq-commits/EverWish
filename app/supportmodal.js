"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SupportModal({ card, onReSend, onDispute, onClose }) {
  if (!card) return null;

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
            💬 Support & Reclaim
          </h2>
          <p className="text-center text-gray-500 text-sm mb-5">
            Having trouble with your card delivery? Choose an option below.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onReSend(card)}
              className="rounded-full bg-pink-200 text-pink-700 px-5 py-3 font-semibold shadow hover:bg-pink-300"
            >
              🔁 Re-send to recipient
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://everwish.store/chat-support",
                  "_blank"
                )
              }
              className="rounded-full bg-blue-200 text-blue-700 px-5 py-3 font-semibold shadow hover:bg-blue-300"
            >
              💬 Chat with Support
            </button>

            <button
              onClick={() => onDispute(card.id)}
              className="rounded-full bg-red-200 text-red-700 px-5 py-3 font-semibold shadow hover:bg-red-300"
            >
              ⚠️ Claim / Not Received
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
