"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow transition-all duration-500 z-40 ${
        scrolled ? "h-14" : "h-24"
      }`}
    >
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between h-full px-6">
        {/* Logo */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "w-20 md:w-24 absolute left-6 top-1/2 -translate-y-1/2"
              : "w-28 md:w-32"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Everwish Logo"
            width={150}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Menú */}
        <nav
          className={`transition-all duration-500 text-gray-800 font-medium text-sm md:text-base flex flex-wrap gap-x-6 gap-y-2 justify-center ${
            scrolled ? "ml-28" : "mt-16"
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
