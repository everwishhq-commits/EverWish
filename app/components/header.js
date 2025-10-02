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
      className={`fixed top-0 left-0 w-full bg-white shadow transition-all duration-500 z-40
      ${scrolled ? "h-16 flex-row justify-between px-6" : "h-28 flex-col items-center"}
      flex`}
    >
      {/* Logo */}
      <div
        className={`transition-all duration-500 ${
          scrolled ? "w-20" : "w-28"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Everwish Logo"
          width={160}
          height={70}
          className="object-contain"
        />
      </div>

      {/* Menú */}
      <nav
        className={`flex gap-6 font-medium text-gray-800 text-sm md:text-base transition-all duration-500 ${
          scrolled ? "mt-0" : "mt-3"
        }`}
      >
        <a href="#">Login</a>
        <a href="#">Cart</a>
        <a href="#">Planes</a>
        <a href="#">Promo</a>
        <a href="#">Categorías</a>
      </nav>
    </header>
  );
}
