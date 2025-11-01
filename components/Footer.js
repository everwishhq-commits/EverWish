"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-600 py-10 mt-16 border-t border-pink-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* © Marca */}
        <p className="text-sm font-medium tracking-wide">
          © {currentYear} <span className="font-bold text-pink-500">Everwish</span>. All rights reserved.
        </p>

        {/* Links */}
        <nav className="flex space-x-6 text-sm">
          <a href="/about" className="hover:text-pink-500 transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-pink-500 transition-colors">
            Contact
          </a>
          <a href="/privacy" className="hover:text-pink-500 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-pink-500 transition-colors">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
