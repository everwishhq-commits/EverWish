"use client";
import { useState, useEffect } from "react";

export default function Header({ show }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-all duration-700 z-40 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo ya colocado en el header */}
        <img
          src="/logo.png"
          alt="Everwish Logo"
          className={`transition-all duration-700 ${
            scrolled ? "w-12 h-12" : "w-16 h-16"
          }`}
        />

        {/* Menú */}
        <nav className="flex space-x-6 text-gray-700 font-medium">
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
