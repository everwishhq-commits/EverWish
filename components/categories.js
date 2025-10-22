"use client";

import Link from "next/link";

const categories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays" },
  { name: "Birthday", emoji: "🎂", color: "bg-pink-200", slug: "birthdays" },
  { name: "Love", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
  { name: "Family", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships" },
  { name: "Baby", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting" },
  { name: "Wedding", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries" },
  { name: "Congrats", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones" },
  { name: "Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation" },
  { name: "Work", emoji: "💼", color: "bg-cyan-200", slug: "work-professional" },
  { name: "Home", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving" },
  { name: "Health", emoji: "🩺", color: "bg-teal-200", slug: "health-support" },
  { name: "Sympathy", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance" },
  { name: "Encouragement", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation" },
  { name: "Thank You", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation" },
  { name: "Invitations", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events" },
  { name: "Spiritual", emoji: "🕯️", color: "bg-orange-200", slug: "spiritual-mindfulness" },
  { name: "Art & Culture", emoji: "🎨", color: "bg-stone-200", slug: "art-cultural" },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens" },
  { name: "Humor", emoji: "😄", color: "bg-rose-100", slug: "humor-memes" },
  { name: "Pets", emoji: "🐾", color: "bg-green-100", slug: "pets" },
  { name: "Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
  { name: "Gifts", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises" },
  { name: "Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes" },
  { name: "Travel", emoji: "✈️", color: "bg-cyan-100", slug: "travel-adventures" },
  { name: "Food & Drinks", emoji: "🍰", color: "bg-pink-100", slug: "food-drinks" },
  { name: "Nature", emoji: "🌿", color: "bg-green-200", slug: "nature" },
  { name: "Friendship", emoji: "🤝", color: "bg-orange-100", slug: "friendship" },
  { name: "Hobbies", emoji: "🎮", color: "bg-blue-300", slug: "hobbies" },
  { name: "Sports", emoji: "⚽", color: "bg-lime-100", slug: "sports" },
  { name: "Custom & AI Creations", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai" },
];

export default function SimpleCategories() {
  return (
    <section id="categories" className="text-center py-14">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
        Categories
      </h2>

      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        {categories.map((cat, i) => (
          <Link key={i} href={`/categories/${cat.slug}`}>
            <div
              className={`${cat.color} w-24 h-24 md:w-28 md:h-28 rounded-full shadow-md flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <span className="text-4xl md:text-5xl mb-1">{cat.emoji}</span>
            </div>
            <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
