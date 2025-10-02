"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-14 shadow-md" : "h-20"
      } bg-white flex items-center`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4">
        {/* Logo */}
        <div
          className={`flex-shrink-0 transition-all duration-500 ${
            isScrolled ? "w-24" : "w-32"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Everwish"
            width={150}
            height={80}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Menú */}
        <nav className="flex flex-wrap justify-center gap-6 text-gray-800 font-bold text-sm md:text-base mt-2 md:mt-0">
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
