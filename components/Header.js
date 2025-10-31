"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Leer usuario guardado
  useEffect(() => {
    try {
      const stored = localStorage.getItem("everwishUser");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.warn("No se pudo leer el usuario:", e);
    }
  }, []);

  // Bloquear scroll cuando hay popup
  useEffect(() => {
    if (showPopup) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [showPopup]);

  const isActive = (path) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-14 shadow-md bg-white/95 backdrop-blur-md" : "h-20 bg-white"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-full">
        {/* 🔹 Logo animado */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isScrolled ? 0.85 : 0.95 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer flex items-center"
        >
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Everwish"
              width={isScrolled ? 52 : 68}
              height={52}
              priority
              className="object-contain w-auto h-auto select-none"
            />
          </Link>
        </motion.div>

        {/* 🔸 Navegación */}
        <nav className="flex items-center gap-4 md:gap-6 text-gray-800 font-semibold text-sm md:text-base">
          <Link
            href="/categories"
            className={`transition ${
              isActive("/categories")
                ? "text-pink-500 underline decoration-2 underline-offset-4"
                : "hover:text-pink-500"
            }`}
          >
            Categories
          </Link>

          <button
            onClick={() => setShowPopup(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white text-xs md:text-sm font-semibold px-4 py-2 md:px-5 md:py-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            {user ? `Hi, ${user.name?.split(" ")[0] || "User"} 💖` : "My Everwish Space"}
          </button>
        </nav>
      </div>

      {/* 🌸 Modal Everwish Space */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 text-center relative shadow-2xl"
            >
              {/* ✕ Cerrar */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>

              {/* 👤 Usuario registrado */}
              {user ? (
                <>
                  <h2 className="text-xl font-bold text-pink-600 mb-3">
                    💖 Welcome back, {user.name?.split(" ")[0] || "friend"}!
                  </h2>
                  <p className="text-gray-600 text-sm mb-5">
                    Everwish ID: <strong>{user.id}</strong>
                  </p>

                  <div className="flex flex-col gap-3 text-sm font-semibold">
                    <Link
                      href="/my-cards"
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-full"
                    >
                      My Cards 💌
                    </Link>
                    <Link
                      href="/received"
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-full"
                    >
                      Received Cards 🎁
                    </Link>
                    <Link
                      href="/plans"
                      className="bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-full"
                    >
                      Plans & Promos ⭐
                    </Link>
                    <Link
                      href="/settings"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-full"
                    >
                      Settings ⚙️
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("everwishUser");
                        setUser(null);
                        setShowPopup(false);
                      }}
                      className="text-gray-500 hover:text-red-500 mt-2 text-sm"
                    >
                      Leave my space 🌙
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-pink-600 mb-2">
                    💖 Welcome to Everwish
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Create, send, and receive digital cards full of magic ✨  
                    Each one becomes part of your personal space.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const id = e.target.idOrEmail.value.trim();
                      const phone = e.target.phone.value.trim();
                      const stored = JSON.parse(
                        localStorage.getItem("everwishUser") || "{}"
                      );
                      if (
                        stored &&
                        (stored.id === id ||
                          stored.email === id ||
                          stored.phone === phone)
                      ) {
                        alert("✅ Access granted!");
                        setUser(stored);
                        setShowPopup(false);
                      } else {
                        alert("❌ No account found. Try again.");
                      }
                    }}
                    className="flex flex-col gap-3"
                  >
                    <input
                      name="idOrEmail"
                      placeholder="Everwish ID or Email"
                      className="border rounded-xl p-3 text-sm text-center"
                      required
                    />
                    <input
                      name="phone"
                      placeholder="Phone number"
                      className="border rounded-xl p-3 text-sm text-center"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
                    >
                      Access My Space 💌
                    </button>
                  </form>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-pink-500 font-semibold mt-4 text-sm hover:underline"
                  >
                    Just view cards ✨
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
                }
