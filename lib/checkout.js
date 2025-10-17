"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * 💳 CheckoutModal – pago seguro con Stripe
 * ------------------------------------------
 * Props:
 *  - total: número base (ej. 5)
 *  - gift: objeto con { name, amount }
 *  - onGiftChange: abre nuevamente el popup de gift
 *  - onGiftRemove: elimina el regalo
 *  - onClose: cierra el modal
 */

export default function CheckoutModal({
  total,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [style, setStyle] = useState("Signature");

  // precios base
  const styles = {
    Signature: { price: 7.99, desc: "A dynamic animated experience with motion, photo, and effects that bring your message to life." },
    Heartfelt: { price: 3.99, desc: "A calm, elegant design for sending warm and meaningful wishes." },
  };

  const finalTotal =
    (style === "Signature" ? styles.Signature.price : styles.Heartfelt.price) +
    (gift?.amount || 0);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-[95%] max-w-lg bg-white rounded-3xl p-6 shadow-2xl text-gray-700 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-pink-600">
            Checkout seguro con Stripe 💜
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Tus datos se procesan de forma segura por Stripe.
        </p>

        {/* 🔹 Datos del remitente */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Sender *</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input placeholder="Full name" className="input" />
          <input placeholder="Email" className="input" />
          <input placeholder="Phone" className="input" />
        </div>

        {/* 🔹 Datos del destinatario */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Recipient *</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input placeholder="Full name" className="input" />
          <input placeholder="Email" className="input" />
          <input placeholder="Phone" className="input" />
        </div>

        {/* 🔹 Selector de estilo */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-800 mb-2">
            Choose your Everwish style ✨
          </p>
          <div className="space-y-3">
            <label
              className={`flex flex-col items-start p-3 border rounded-xl cursor-pointer transition ${
                style === "Signature"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-200"
              }`}
              onClick={() => setStyle("Signature")}
            >
              <span className="font-semibold">
                💎 Signature — ${styles.Signature.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">
                {styles.Signature.desc}
              </span>
            </label>

            <label
              className={`flex flex-col items-start p-3 border rounded-xl cursor-pointer transition ${
                style === "Heartfelt"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-200"
              }`}
              onClick={() => setStyle("Heartfelt")}
            >
              <span className="font-semibold">
                💌 Heartfelt — ${styles.Heartfelt.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">
                {styles.Heartfelt.desc}
              </span>
            </label>
          </div>
        </div>

        {/* 🔹 Resumen de pedido */}
        <div className="border-t pt-4 mb-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Order summary
          </h3>
          <div className="flex justify-between text-sm mb-1">
            <span>
              Everwish Card ({style}){" "}
              <span className="text-gray-400">– ${styles[style].price.toFixed(2)}</span>
            </span>
          </div>

          {gift && (
            <div className="flex justify-between text-sm items-center">
              <span>
                Gift Card ({gift.name} ${gift.amount})
              </span>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={onGiftChange}
                  className="text-pink-600 hover:underline"
                >
                  Change
                </button>
                <button
                  onClick={onGiftRemove}
                  className="text-gray-400 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between font-semibold mt-3">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* 🔹 Simulación campo tarjeta */}
        <div className="flex items-center gap-2 border rounded-xl px-3 py-3 mb-5 text-sm text-gray-500">
          💳
          <input
            type="text"
            placeholder="Card number"
            className="flex-1 outline-none"
          />
          <input
            type="text"
            placeholder="MM / YY"
            className="w-20 outline-none"
          />
          <input
            type="text"
            placeholder="CVC"
            className="w-16 outline-none"
          />
        </div>

        {/* 🔹 Botón de pago */}
        <button
          onClick={() => alert("Payment simulated 💜")}
          className="w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white py-3 font-semibold transition shadow-md"
        >
          Confirm & Pay ${finalTotal.toFixed(2)} 💜
        </button>
      </motion.div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #f472b6;
          outline: none;
          box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.2);
        }
      `}</style>
    </motion.div>
  );
          }
