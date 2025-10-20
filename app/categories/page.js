"use client";
import Link from "next/link";
import { useState } from "react";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const categories = [
    // 🎉 Holidays
    { slug: "newyear", emoji: "🎆", title: "New Year" },
    { slug: "valentines", emoji: "💘", title: "Valentine’s Day" },
    { slug: "easter", emoji: "🐰", title: "Easter" },
    { slug: "july4th", emoji: "🦅", title: "4th of July" },
    { slug: "thanksgiving", emoji: "🦃", title: "Thanksgiving" },
    { slug: "christmas", emoji: "🎄", title: "Christmas" },
    { slug: "halloween", emoji: "🎃", title: "Halloween" },

    // 💕 Love & Family
    { slug: "anniversary", emoji: "💞", title: "Anniversary" },
    { slug: "engagement", emoji: "💍", title: "Engagement" },
    { slug: "wedding", emoji: "💎", title: "Wedding" },
    { slug: "mothersday", emoji: "🌸", title: "Mother’s Day" },
    { slug: "fathersday", emoji: "👔", title: "Father’s Day" },
    { slug: "newbaby", emoji: "👶", title: "New Baby" },
    { slug: "birthday", emoji: "🎂", title: "Birthday" },
    { slug: "love", emoji: "💌", title: "Love" },
    { slug: "friendship", emoji: "🤝", title: "Friendship" },

    // 🌿 Sentiments & Support
    { slug: "condolences", emoji: "🕊️", title: "Condolences" },
    { slug: "sympathy", emoji: "💧", title: "Sympathy" },
    { slug: "getwell", emoji: "🌻", title: "Get Well Soon" },
    { slug: "thinkingofyou", emoji: "💭", title: "Thinking of You" },
    { slug: "thankyou", emoji: "🙏", title: "Thank You" },
    { slug: "appreciationday", emoji: "🌟", title: "Appreciation Day" },
    { slug: "teacherappreciation", emoji: "🍎", title: "Teacher Appreciation" },

    // 💼 Achievements
    { slug: "graduation", emoji: "🎓", title: "Graduation" },
    { slug: "promotion", emoji: "💼", title: "Promotion" },
    { slug: "retirement", emoji: "🧓", title: "Retirement" },

    // 🐾 Everyday & Fun
    { slug: "petsandanimals", emoji: "🐶", title: "Pets & Animals" },
    { slug: "everyday", emoji: "✨", title: "Everyday" },
  ];

  const filtered = categories.filter((cat) =>
    cat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pt-24 pb-20 px-6 text-center relative">
      {/* 🔹 Barra decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-b-full shadow-md"></div>

      {/* 🔹 Título */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 mt-10 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Explore Categories 💌
      </h1>
      <p className="text-gray-600 mb-6 text-base md:text-lg">
        Choose a theme to explore animated Everwish cards ✨
      </p>

      {/* 🔹 Barra de búsqueda */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full p-3 rounded-full border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none text-gray-700"
        />
      </div>

      {/* 🔹 Cuadrícula */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filtered.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all p-6 flex flex-col items-center justify-center border border-pink-100"
          >
            <span className="text-5xl mb-2">{cat.emoji}</span>
            <p className="font-semibold text-gray-800">{cat.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
    }
