"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = Array.isArray(data) ? data : data.all || [];

        // 📊 Extraer todas las categorías únicas desde los videos
        const categorySet = new Set();
        allVideos.forEach((v) =>
          v.categories?.forEach((cat) => categorySet.add(cat.toLowerCase()))
        );

        // 🧩 Asignar emojis automáticos según el nombre
        const emojiMap = {
          halloween: "🎃",
          christmas: "🎄",
          valentines: "💘",
          love: "💞",
          birthday: "🎂",
          mothersday: "🌸",
          fathersday: "👔",
          newbaby: "👶",
          graduation: "🎓",
          wedding: "💍",
          condolences: "🕊️",
          spiritual: "🕯️",
          pets: "🐾",
          animals: "🐶",
          easter: "🐰",
          independence: "🦅",
          july4th: "🇺🇸",
          thanksgiving: "🦃",
          anniversary: "💖",
          celebration: "🎉",
          general: "💌",
          usa: "⭐",
          appreciationday: "🌟",
        };

        // 🧠 Convertir a array ordenado
        const sortedCats = Array.from(categorySet).sort();

        // 📋 Crear arreglo final
        const catList = sortedCats.map((cat) => ({
          slug: cat,
          title:
            cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " "),
          emoji: emojiMap[cat] || "✨",
        }));

        setCategories(catList);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pt-24 pb-20 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Explore Categories 💌
      </h1>
      <p className="text-gray-600 mb-10 text-base md:text-lg">
        Choose a theme to explore animated Everwish cards ✨
      </p>

      {/* 📂 Lista automática */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all p-6 flex flex-col items-center justify-center border border-pink-100"
          >
            <span className="text-5xl mb-2">{cat.emoji}</span>
            <p className="font-semibold text-gray-800">{cat.title}</p>
          </Link>
        ))}

        {categories.length === 0 && (
          <p className="col-span-full text-gray-400 italic">
            Loading categories...
          </p>
        )}
      </div>
    </main>
  );
      }
