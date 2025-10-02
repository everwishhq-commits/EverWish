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
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center md:flex-row md:justify-between md:items-center">
        {/* Logo en header */}
        <img
          src="/logo.png"
          alt="Everwish Logo"
          className={`transition-all duration-700 ${
            scrolled ? "w-12 h-12 self-start" : "w-20 h-20"
          }`}
        />

        {/* Menú */}
        <nav
          className={`mt-3 md:mt-0 flex space-x-6 text-gray-700 font-medium transition-all duration-700 ${
            scrolled ? "self-end" : ""
          }`}
        >
          <a href="#">Login</a>
          <a href="#">Cart</a>
          <a href="#">Planes</a>
          <a href="#">Promo del Mes</a>
          <a href="#">Categorías</a>
        </nav>
      </div>
    </header>
  );
}
