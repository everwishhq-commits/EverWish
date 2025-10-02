"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-14 shadow-md" : "h-20"
      } bg-white`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6">
        {/* Logo */}
        <div
          className={`transition-all duration-500 ${
            isScrolled ? "w-12" : "w-16 md:w-24"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Everwish"
            width={120}
            height={60}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Menú */}
        <nav
          className={`flex flex-wrap items-center gap-3 md:gap-6 text-gray-800 font-bold text-xs md:text-base transition-all duration-500`}
        >
          <Link href="/login">Login</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/planes">Planes</Link>
          <Link href="/promo">Promo</Link>
          <Link href="/categorias">Categorías</Link>
        </nav>
      </div>
    </header>
  );
}
