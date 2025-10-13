"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md"
      >
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          ❌ Payment Canceled
        </h1>
        <p className="text-gray-700 mb-6">
          It looks like you canceled the payment. Don’t worry — you can try
          again when you’re ready.
        </p>
        <Link
          href="/"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold"
        >
          Back to Everwish
        </Link>
      </motion.div>
    </main>
  );
}
