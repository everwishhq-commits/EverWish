"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 bg-white shadow transition-all duration-500 ${
        scrolled ? "py-2" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center px-4 gap-y-2 
                      justify-center md:justify-between">
        
        {/* Logo */}
        <div
          className={`transition-all duration-500 ${
            scrolled ? "scale-75" : "scale-100"
          }`}
        >
          <Image
            src="/logo.png"
            alt="everwish"
            width={scrolled ? 100 : 140}
            height={60}
            priority
          />
        </div>

        {/* Menú */}
        <nav
          className="flex flex-wrap justify-center gap-4 
                     text-sm sm:text-base md:text-lg"
        >
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
