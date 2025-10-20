"use client";
import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { slug: "halloween", emoji: "🎃", title: "Halloween" },
    { slug: "christmas", emoji: "🎄", title: "Christmas" },
    { slug: "valentines", emoji: "💘", title: "Valentine’s Day" },
    { slug: "birthday", emoji: "🎂", title: "Birthdays" },
    { slug: "mothersday", emoji: "🌸", title: "Mother’s Day" },
    { slug: "fathersday", emoji: "👔", title: "Father’s Day" },
    { slug: "easter", emoji: "🐰", title: "Easter" },
    { slug: "thanksgiving", emoji: "🦃", title: "Thanksgiving" },
    { slug: "anniversary", emoji: "💞", title: "Anniversary" },
    { slug: "love", emoji: "💝", title: "Love" },
    { slug: "pets", emoji: "🐶", title: "Pets & Animals" },
    { slug: "independenceday", emoji: "🦅", title: "July 4th / Independence Day" },
    { slug: "wedding", emoji: "💍", title: "Weddings" },
    { slug: "graduation", emoji: "🎓", title: "Graduation" },
    { slug: "condolences", emoji: "🕊️", title: "Condolences" },
    { slug: "newbaby", emoji: "👶", title: "New Baby" },
    { slug: "general", emoji: "💌", title: "Everyday" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pt-24 pb-20 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Explore Categories 💌
      </h1>
      <p className="text-gray-600 mb-10 text-base md:text-lg">
        Choose a theme to explore animated Everwish cards ✨
      </p>

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
      </div>
    </main>
  );
    }
