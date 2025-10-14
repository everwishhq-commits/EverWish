"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-14 shadow-md" : "h-20"
      } bg-white`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6">
        
        {/* 🔹 Logo perfectamente centrado en móvil, tablet y desktop */}
        <motion.div
          initial={{ scale: 0.9, y: 0 }}
          animate={{
            scale: isScrolled ? 0.8 : 0.9,
            y: isScrolled
              ? 0
              : typeof window !== "undefined"
              ? window.innerWidth < 640
                ? 8 // 📱 móviles
                : window.innerWidth < 1024
                ? 4 // 💻 tablets
                : 2 // 🖥️ desktops
              : 0,
          }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer flex items-center justify-center py-3 md:py-2"
        >
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Everwish"
              width={isScrolled ? 55 : 75}
              height={45}
              priority
              className="object-contain w-auto h-auto select-none"
            />
          </Link>
        </motion.div>

        {/* 🔸 Menú principal */}
        <nav className="flex items-center gap-3 md:gap-6 text-gray-800 font-semibold text-xs md:text-base">
          <Link
            href="/categories"
            className={`${isActive("/categories") ? "text-pink-500 underline" : ""}`}
          >
            Categories
          </Link>

          {/* 🔹 Botón principal My Everwish Space */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-3 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm transition-all shadow-sm"
          >
            💌 My Everwish Space
          </button>
        </nav>
      </div>

      {/* 🔮 POPUP My Everwish Space */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>

              <h2 className="text-pink-500 text-lg md:text-xl font-bold mb-3">
                💖 Welcome to Everwish
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                This is your personal space to create, send, and receive digital cards —
                just pure moments of joy. ✨
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                🪶 In your personal panel, every card you make is saved here automatically
                to manage. After a secure purchase you’ll receive an{" "}
                <strong>Everwish ID</strong>.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                🎁 You’ll also find cards that others have sent you.  
                Start by choosing a card below 💌
              </p>

              <input
                type="text"
                placeholder="Everwish ID or Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Phone number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition-all mb-3">
                Access My Space 💌
              </button>

              {/* 👇 Opción alternativa sin login */}
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 text-sm hover:underline"
              >
                👀 View cards without signing in
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
                }
