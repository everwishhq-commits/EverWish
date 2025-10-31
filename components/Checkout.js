"use client";

import { useState } from "react";

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      // Aquí podrías conectar tu lógica de pago (Stripe, PayPal, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("✅ Payment successful! Thank you for supporting Everwish 💝");
    } catch (err) {
      console.error("❌ Error during checkout:", err);
      alert("There was an issue processing your payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-pink-50 via-white to-pink-100 text-gray-700 px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Complete Your Everwish ✨
      </h1>

      <p className="text-center text-gray-500 max-w-md mb-10">
        This checkout confirms your card and sends your personalized Everwish
        message. Once completed, you’ll receive a confirmation instantly.
      </p>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-transform ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600 active:scale-95"
        }`}
      >
        {isProcessing ? "Processing..." : "Confirm & Send 💌"}
      </button>
    </div>
  );
}
