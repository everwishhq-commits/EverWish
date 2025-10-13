"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your Everwish card and gift details will
          be sent to the recipient shortly. 💌
        </p>
        <Link
          href="/"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold"
        >
          Back to Everwish
        </Link>
      </motion.div>
    </main>
  );
}
