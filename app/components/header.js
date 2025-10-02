"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-500 ${
        isScrolled ? "h-14" : "h-24"
      } flex flex-col items-center justify-center`}
    >
      {/* Logo */}
      <div
        className={`transition-all duration-500 ${
          isScrolled ? "scale-75 translate-x-[-120px]" : "scale-100"
        }`}
      >
        <img
          src="/logo.png"
          alt="Everwish"
          className="h-10 md:h-14 object-contain"
        />
      </div>

      {/* Menú */}
      <nav
        className={`transition-all duration-500 ${
          isScrolled ? "mt-0" : "mt-2"
        }`}
      >
        <ul className="flex flex-wrap gap-4 md:gap-6 text-gray-800 text-sm md:text-base font-medium justify-center">
          <li><a href="#">Login</a></li>
          <li><a href="#">Cart</a></li>
          <li><a href="#">Planes</a></li>
          <li><a href="#">Promo</a></li>
          <li><a href="#">Categorías</a></li>
        </ul>
      </nav>
    </header>
  );
}
