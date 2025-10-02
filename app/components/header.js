"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 bg-white shadow transition-all duration-500 ${
        scrolled ? "py-2" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center md:flex-row md:justify-between px-4">
        {/* Logo */}
        <div
          className={`transition-all duration-500 ${
            scrolled ? "scale-75 self-start md:self-center" : "scale-100"
          }`}
        >
          <Image src="/logo.png" alt="everwish" width={160} height={60} />
        </div>

        {/* Menú */}
        <nav
          className={`flex gap-6 mt-3 md:mt-0 transition-all duration-500 ${
            scrolled ? "justify-start" : "justify-center"
          }`}
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
