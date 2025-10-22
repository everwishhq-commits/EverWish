"use client";
import Categories from "@/components/categories";

export default function CategoriesPage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-[#fff5f8] text-gray-800 px-4 py-10">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-4 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Discover every Everwish theme and celebration ✨
      </p>

      {/* Carrusel principal con categorías base */}
      <div className="w-full max-w-5xl">
        <Categories />
      </div>
    </main>
  );
}
