"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 bg-white shadow transition-all duration-500 ${
        scrolled ? "py-2" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div
          className={`transition-all duration-500 ${
            scrolled ? "scale-75" : "scale-100"
          }`}
        >
          <Image src="/logo.png" alt="everwish" width={140} height={60} />
        </div>

        {/* Menú */}
        <nav className="flex gap-6 text-sm md:text-base">
          <a href="#" className="hover:text-pink-600">Login</a>
          <a href="#" className="hover:text-pink-600">Cart</a>
          <a href="#" className="hover:text-pink-600">Planes</a>
          <a href="#" className="hover:text-pink-600">Promo</a>
          <a href="#" className="hover:text-pink-600">Categorías</a>
        </nav>
      </div>
    </header>
  );
}
