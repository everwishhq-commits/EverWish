"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-40">
      {/* Contenedor interno para controlar transición */}
      <div className="relative mx-auto w-full max-w-6xl">
        {/* Altura del header (varía según estado) */}
        <div className={`${scrolled ? "h-16" : "h-28"} transition-all duration-700 ease-in-out`} />

        {/* LOGO: posición absoluta que se anima del centro a la izquierda */}
        <div
          className={`absolute top-3 transition-all duration-700 ease-in-out
            ${scrolled ? "left-4 -translate-x-0 scale-90" : "left-1/2 -translate-x-1/2 scale-100"}`}
        >
          <Image
            src="/logo.png"
            alt="Everwish"
            width={170}
            height={64}
            priority
            className="object-contain"
          />
        </div>

        {/* MENÚ: inicia debajo del logo; con scroll sube y se alinea a la derecha */}
        <nav
          className={`transition-all duration-700 ease-in-out flex flex-wrap items-center gap-x-6 gap-y-2
            text-gray-800 font-medium
            ${scrolled ? "h-16 pl-28 justify-end" : "h-auto pt-20 justify-center"}`}
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
