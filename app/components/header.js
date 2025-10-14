"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfilePopup from "./ProfilePopup";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "h-16 shadow-md" : "h-24"
      } bg-white flex items-center`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
        {/* ---------- LOGO ---------- */}
        <div
          className={`transition-all duration-500 ${
            isScrolled ? "w-16" : "w-24 md:w-28"
          } cursor-pointer flex justify-center items-center`}
          style={{ transform: "translateY(4px)" }} // 🔽 Baja un poco el logo
        >
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Everwish"
              width={120}
              height={60}
              className="object-contain w-full h-auto"
            />
          </Link>
        </div>

        {/* ---------- MENÚ ---------- */}
        <nav className="flex items-center gap-4 md:gap-7 text-gray-800 font-semibold text-xs md:text-base tracking-wide transition-all duration-500">
          {/* 💌 My Everwish Space */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition text-xs md:text-sm"
          >
            💌 My Everwish Space
          </button>

          <Link
            href="/cart"
            className={`${isActive("/cart") ? "text-pink-500 underline" : ""}`}
          >
            Cart
          </Link>
          <Link
            href="/planes"
            className={`${isActive("/planes") ? "text-pink-500 underline" : ""}`}
          >
            Planes
          </Link>
          <Link
            href="/promo"
            className={`${isActive("/promo") ? "text-pink-500 underline" : ""}`}
          >
            Promo
          </Link>
          <Link
            href="/categories"
            className={`${isActive("/categories") ? "text-pink-500 underline" : ""}`}
          >
            Categorías
          </Link>
        </nav>
      </div>

      {/* ---------- POPUP ---------- */}
      {showPopup && (
        <ProfilePopup
          onClose={() => setShowPopup(false)}
          onCreateNew={() => {
            setShowPopup(false);
            window.location.href = "/cards";
          }}
          onViewExample={() => {
            setShowPopup(false);
            window.location.href = "/example";
          }}
        />
      )}
    </header>
  );
        }
