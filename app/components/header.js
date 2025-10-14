"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // 🔹 Scroll effect para animar logo
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Cargar usuario guardado localmente
  useEffect(() => {
    try {
      const stored = localStorage.getItem("everwishUser");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-14 shadow-md" : "h-20"
      } bg-white`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6 h-full">
        {/* 🔸 Logo con animación */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isScrolled ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
          className={`cursor-pointer flex items-center`}
        >
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Everwish"
              width={isScrolled ? 80 : 120}
              height={60}
              priority
              className="object-contain w-auto h-auto select-none"
            />
          </Link>
        </motion.div>

        {/* 🔸 Menú general */}
        <nav className="flex items-center gap-3 md:gap-6 text-gray-800 font-bold text-xs md:text-base">
          <Link
            href="/planes"
            className={`${isActive("/planes") ? "text-pink-500 underline" : ""}`}
          >
            Planes
          </Link>
          <Link
            href="/promo"
            className={`${isActive("/promo") ? "text-pink-500 underline" : ""}`}
          >
            Promo
          </Link>
          <Link
            href="/categories"
            className={`${
              isActive("/categories") ? "text-pink-500 underline" : ""
            }`}
          >
            Categorías
          </Link>

          {/* 🔹 Botón My Everwish Space */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white text-xs md:text-sm font-semibold px-3 py-2 rounded-full shadow transition whitespace-nowrap"
          >
            {user ? `Hi, ${user.name?.split(" ")[0] || "User"} 💖` : "My Everwish Space"}
          </button>
        </nav>
      </div>

      {/* 🔹 Margen inferior para evitar que se pegue al contenido */}
      <div className="h-2 md:h-3" />

      {/* 🔹 Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 text-center relative shadow-2xl"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            {user ? (
              <>
                <h2 className="text-xl font-bold text-pink-600 mb-2">
                  💖 Welcome back, {user.name?.split(" ")[0] || "friend"}!
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Your Everwish ID: <strong>{user.id}</strong>
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/my-cards"
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-full"
                  >
                    View My Cards
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("everwishUser");
                      setUser(null);
                      setShowPopup(false);
                    }}
                    className="text-gray-500 hover:text-red-500 text-sm mt-2"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-pink-600 mb-2">
                  💖 Welcome to Everwish
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  This is your personal space to create, send, and receive
                  digital cards — just pure moments of joy. ✨
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  Enter your <b>Everwish ID or email</b> and your{" "}
                  <b>phone number</b> to access your space.
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
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full"
                  >
                    Access My Space 💌
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </header>
  );
}
