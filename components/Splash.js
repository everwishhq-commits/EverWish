"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const step1 = setTimeout(() => setProgress(40), 400);
    const step2 = setTimeout(() => setProgress(75), 900);
    const step3 = setTimeout(() => setProgress(100), 1300);

    // ✨ Parpadeo del logo
    const blink = setInterval(() => setFade((f) => !f), 450);

    // ⏱️ Oculta splash suavemente
    const finish = setTimeout(() => {
      clearInterval(blink);
      setVisible(false);
      if (typeof onFinish === "function") setTimeout(onFinish, 400); // pequeño delay para fade
    }, 2000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finish);
      clearInterval(blink);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                     bg-gradient-to-b from-pink-50 via-white to-pink-100"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 🌸 Logo con animación */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{
              scale: fade ? 1 : 0.96,
              opacity: fade ? 1 : 0.5,
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Image
              src="/logo.png"
              alt="Everwish Logo"
              width={180}
              height={180}
              priority
              className="select-none"
            />
          </motion.div>

          {/* 🌈 Barra de progreso */}
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-6 shadow-inner">
            <motion.div
              className="h-full bg-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
