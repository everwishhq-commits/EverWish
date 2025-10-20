"use client";
import Link from "next/link";

export default function CategoriesPage() {
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
    { slug: "mothersday", emoji: "🌸", title: "Mother’s Day" },
    { slug: "fathersday", emoji: "👔", title: "Father’s Day" },
    { slug: "wedding", emoji: "💍", title: "Wedding" },
    { slug: "engagement", emoji: "💍", title: "Engagement" },
    { slug: "newbaby", emoji: "👶", title: "New Baby" },
    { slug: "birthday", emoji: "🎂", title: "Birthday" },
    { slug: "love", emoji: "💌", title: "Love" },
    { slug: "friendship", emoji: "🤝", title: "Friendship" },

    // 🌿 Sentiments
    { slug: "condolences", emoji: "🕊️", title: "Condolences" },
    { slug: "getwell", emoji: "🌻", title: "Get Well Soon" },
    { slug: "thinkingofyou", emoji: "💭", title: "Thinking of You" },
    { slug: "appreciationday", emoji: "🌟", title: "Appreciation Day" },

    // 🐾 Fun & Everyday
    { slug: "petsandanimals", emoji: "🐶", title: "Pets & Animals" },
    { slug: "graduation", emoji: "🎓", title: "Graduation" },
    { slug: "promotion", emoji: "💼", title: "Promotion" },
    { slug: "general", emoji: "✨", title: "Everyday" },
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
