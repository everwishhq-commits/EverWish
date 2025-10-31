"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 text-gray-700 py-10 mt-20 border-t border-pink-100">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        {/* Logo / Marca */}
        <p className="font-semibold text-lg tracking-wide text-gray-800">
          © {year} <span className="text-pink-500 font-bold">Everwish</span>
        </p>

        {/* Enlaces */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
          <a
            href="#"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="#"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Terms
          </a>
        </nav>
      </div>

      {/* Lema opcional Everwish */}
      <p className="mt-8 text-center text-gray-400 text-xs">
        Share love, joy, and memories — one Everwish at a time 💌
      </p>
    </footer>
  );
}
