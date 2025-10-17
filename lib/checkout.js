"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { EverwishAdmin } from "@/lib/admin";

export default function CheckoutModal({
  total = 5,
  gift,
  onClose,
  onGiftChange,
  onGiftRemove,
}) {
  const [plan, setPlan] = useState("animated");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(3.99);
  const [preview, setPreview] = useState("/videos/sample-card.mp4");
  const [processing, setProcessing] = useState(false);

  /* 🔹 Actualiza automáticamente descripción y preview */
  useEffect(() => {
    if (plan === "animated") {
      setPrice(3.99);
      setDescription(
        "🎬 Animated MP4 Card — Add movement and sparkle to your digital greeting!"
      );
      setPreview("/videos/sample-card.mp4");
    } else {
      setPrice(7.99);
      setDescription(
        "💖 Heartfelt Photo Card — A static image with a positive, personal message."
      );
      setPreview("/images/sample-heartfelt.jpg");
    }
  }, [plan]);

  const handlePurchase = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      EverwishAdmin.completePurchase(plan, price);
      alert(
        `✅ Purchase completed successfully (${plan === "animated" ? "Animated" : "Heartfelt"}) — $${price.toFixed(
          2
        )}`
      );
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[500]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-md p-6 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* 🔘 Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
          >
            ✖
          </button>

          {/* 💳 Título */}
          <h2 className="text-center text-2xl font-semibold text-purple-600 mb-4">
            💝 Checkout
          </h2>

          {/* 🪄 Selector de plan */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setPlan("animated")}
              className={`px-4 py-2 rounded-full font-semibold ${
                plan === "animated"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Animated — $3.99
            </button>
            <button
              onClick={() => setPlan("heartfelt")}
              className={`px-4 py-2 rounded-full font-semibold ${
                plan === "heartfelt"
                  ? "bg-pink-500 text-white shadow"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Heartfelt — $7.99
            </button>
          </div>

          {/* 📜 Descripción */}
          <p className="text-center text-gray-600 mb-4">{description}</p>

          {/* 🖼️ Preview dinámico */}
          <div className="relative rounded-2xl overflow-hidden border mb-5">
            {plan === "animated" ? (
              <video
                src={preview}
                className="w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={preview}
                alt="Heartfelt Card"
                className="w-full object-cover"
              />
            )}
          </div>

          {/* 🎁 Gift opcional */}
          {gift && (
            <div className="flex items-center justify-between bg-pink-50 p-3 rounded-xl mb-4">
              <span className="text-gray-700 font-medium">
                🎁 {gift.label} — ${gift.amount}
              </span>
              <button
                onClick={onGiftRemove}
                className="text-sm text-pink-600 underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* 🧾 Total */}
          <div className="flex justify-between items-center mb-4 border-t pt-3">
            <span className="text-gray-700 font-medium">Total:</span>
            <span className="text-xl font-bold text-purple-600">
              ${(price + (gift?.amount || 0)).toFixed(2)}
            </span>
          </div>

          {/* 🛒 Botón de pago */}
          <button
            onClick={handlePurchase}
            disabled={processing}
            className={`w-full py-3 rounded-full font-semibold text-white shadow ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {processing ? "Processing..." : "Confirm Purchase"}
          </button>

          {/* 🕊️ Footer */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Payments are secure and encrypted.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
