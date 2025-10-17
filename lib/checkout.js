"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutModal({
  total,
  gift,
  slug,
  planOptions,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [selectedPlan, setSelectedPlan] = useState("signature");

  const plan = planOptions.find((p) => p.id === selectedPlan);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[500]"
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

          <h2 className="text-center text-xl font-semibold text-purple-600 mb-2">
            Checkout seguro con Stripe 💜
          </h2>
          <p className="text-center text-gray-500 text-sm mb-5">
            Tus datos se procesan de forma segura por Stripe.
          </p>

          <div className="border rounded-2xl p-4 bg-gray-50 mb-5">
            <p className="text-sm text-gray-600 mb-2 text-center">
              Both include your personalized message and instant delivery 💞
            </p>
            {planOptions.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`cursor-pointer border rounded-xl p-3 mb-2 transition ${
                  selectedPlan === p.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {p.title} — ${p.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-gray-700">
            <p className="flex justify-between">
              <span>Everwish Card</span> <span>${plan.price.toFixed(2)}</span>
            </p>
            {gift && (
              <p className="flex justify-between mt-1">
                <span>
                  Gift Card ({gift.label}){" "}
                  <button
                    onClick={onGiftRemove}
                    className="text-pink-500 underline ml-1"
                  >
                    Remove
                  </button>
                </span>
                <span>${gift.amount}</span>
              </p>
            )}
            <p className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>
                ${(plan.price + (gift?.amount || 0)).toFixed(2)}
              </span>
            </p>
          </div>

          <button className="mt-5 w-full bg-purple-500 text-white py-3 rounded-full font-semibold shadow hover:bg-purple-600">
            Confirm & Pay ${(plan.price + (gift?.amount || 0)).toFixed(2)} 💜
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
              }
