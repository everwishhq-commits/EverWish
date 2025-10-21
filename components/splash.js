"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Splash({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) setTimeout(onFinish, 600); // espera la animación
    }, 2500); // duración total visible
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-rose-50 to-white z-50"
        >
          {/* LOGO o Ícono principal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center mb-4">
              <motion.img
                src="/logo-everwish.png"
                alt="Everwish Logo"
                className="w-12 h-12"
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </div>
            <motion.h1
              className="text-3xl font-bold text-gray-700"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Everwish
            </motion.h1>
            <motion.p
              className="text-sm text-gray-500 mt-1 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Making moments magical ✨
            </motion.p>
          </motion.div>

          {/* Partículas suaves */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-32 h-32 bg-pink-200/40 rounded-full blur-3xl top-10 left-10"
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />
            <motion.div
              className="absolute w-40 h-40 bg-rose-300/30 rounded-full blur-3xl bottom-10 right-10"
              animate={{ y: [0, 30, 0] }}
              transition={{ repeat: Infinity, duration: 8 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
                  }
