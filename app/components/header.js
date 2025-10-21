"use client";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 py-3 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-700">🌸 Everwish</h1>
        <nav className="flex gap-4 text-gray-600">
          <a href="/" className="hover:text-pink-500">Home</a>
          <a href="/test" className="hover:text-pink-500">Test</a>
          <a href="/admin" className="hover:text-pink-500">Admin</a>
        </nav>
      </div>
    </header>
  );
}
