"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 🎯 REDIRECCIÓN AUTOMÁTICA A MYSPACE DESPUÉS DE 2 SEGUNDOS
    const timer = setTimeout(() => {
      router.push("/myspace");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md"
      >
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your Everwish card has been created and sent! 💌
        </p>
        
        <div className="flex items-center justify-center gap-2 text-pink-500 font-semibold">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
          <span>Redirecting to MySpace...</span>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You'll be logged in automatically
        </p>
      </motion.div>
    </main>
  );
}
