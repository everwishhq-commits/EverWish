"use client";
import { useState, useEffect } from "react";

export default function Header({ show }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-all duration-700 z-40 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center transition-all duration-700">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Everwish Logo"
          className={`transition-all duration-700 ${
            scrolled ? "w-12 h-12 self-start" : "w-20 h-20"
          }`}
        />

        {/* Menú */}
        <nav
          className={`flex flex-wrap justify-center gap-4 mt-2 transition-all duration-700 ${
            scrolled ? "self-end -mt-10" : ""
          }`}
        >
          <a href="#">Login</a>
          <a href="#">Cart</a>
          <a href="#">Planes</a>
          <a href="#">Promo</a>
          <a href="#">Categorías</a>
        </nav>
      </div>
    </header>
  );
}
