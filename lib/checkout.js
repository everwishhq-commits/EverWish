"use client";

import { motion } from "framer-motion";

export default function CheckoutModal({
  total,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-[90%] max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
          💳 Checkout
        </h2>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Base card price:</span>
            <span>$5.00</span>
          </div>

          {gift && (
            <div className="flex justify-between text-gray-700">
              <span>
                {gift.store} Gift Card{" "}
                <button
                  onClick={onGiftRemove}
                  className="text-pink-500 text-sm underline ml-1"
                >
                  Remove
                </button>
              </span>
              <span>${gift.amount}</span>
            </div>
          )}

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 font-semibold text-gray-700"
          >
            Back
          </button>
          <button
            onClick={onGiftChange}
            className="rounded-full bg-pink-200 px-5 py-2 font-semibold text-pink-700 hover:bg-pink-300"
          >
            Add Gift
          </button>
        </div>

        <button
          onClick={() => {
            alert("✅ Purchase completed! (demo mode)");
            onClose();
          }}
          className="mt-4 w-full rounded-full bg-purple-500 px-5 py-3 font-semibold text-white hover:bg-purple-600"
        >
          Proceed to Payment
        </button>
      </motion.div>
    </motion.div>
  );
}
