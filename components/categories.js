"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays", keywords: ["holiday", "season", "party", "celebration"] },
  { name: "Birthday", emoji: "🎂", color: "bg-pink-200", slug: "birthdays", keywords: ["birthday", "cake", "celebrate", "happy"] },
  { name: "Love", emoji: "💘", color: "bg-rose-200", slug: "love-romance", keywords: ["love", "romance", "heart", "affection"] },
  { name: "Family", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships", keywords: ["family", "parents", "kids", "relationship"] },
  { name: "Baby", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting", keywords: ["baby", "newborn", "parenting", "cute"] },
  { name: "Wedding", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries", keywords: ["wedding", "anniversary", "marriage", "engagement"] },
  { name: "Congrats", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones", keywords: ["congratulations", "achievement", "success"] },
  { name: "Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation", keywords: ["graduation", "school", "college", "achievement"] },
  { name: "Work", emoji: "💼", color: "bg-cyan-200", slug: "work-professional", keywords: ["work", "career", "job", "business"] },
  { name: "Home", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving", keywords: ["home", "house", "move", "new place"] },
  { name: "Health", emoji: "🩺", color: "bg-teal-200", slug: "health-support", keywords: ["health", "wellness", "support", "healing"] },
  { name: "Sympathy", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance", keywords: ["sympathy", "condolence", "remembrance", "peace"] },
  { name: "Encouragement", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation", keywords: ["motivation", "encourage", "positivity"] },
  { name: "Thank You", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation", keywords: ["thank", "appreciation", "gratitude"] },
  { name: "Invitations", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events", keywords: ["invitation", "event", "party", "celebrate"] },
  { name: "Spiritual", emoji: "🕯️", color: "bg-orange-200", slug: "spiritual-mindfulness", keywords: ["spiritual", "mindfulness", "peace", "meditation"] },
  { name: "Art & Culture", emoji: "🎨", color: "bg-stone-200", slug: "art-cultural", keywords: ["art", "culture", "creativity", "painting"] },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens", keywords: ["kids", "teens", "children", "fun"] },
  { name: "Humor", emoji: "😄", color: "bg-rose-100", slug: "humor-memes", keywords: ["humor", "funny", "meme", "laugh"] },
  { name: "Pets", emoji: "🐾", color: "bg-green-100", slug: "pets", keywords: ["pets", "animals", "dogs", "cats"] },
  { name: "Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because", keywords: ["everyday", "message", "simple", "note"] },
  { name: "Gifts", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises", keywords: ["gift", "present", "surprise", "special"] },
  { name: "Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes", keywords: ["quote", "inspiration", "wisdom", "words"] },
  { name: "Travel", emoji: "✈️", color: "bg-cyan-100", slug: "travel-adventures", keywords: ["travel", "adventure", "trip", "journey"] },
  { name: "Food & Drinks", emoji: "🍰", color: "bg-pink-100", slug: "food-drinks", keywords: ["food", "drink", "coffee", "dessert"] },
  { name: "Nature", emoji: "🌿", color: "bg-green-200", slug: "nature", keywords: ["nature", "outdoors", "earth", "plants"] },
  { name: "Friendship", emoji: "🤝", color: "bg-orange-100", slug: "friendship", keywords: ["friend", "companionship", "bond", "connection"] },
  { name: "Hobbies", emoji: "🎮", color: "bg-blue-300", slug: "hobbies", keywords: ["hobby", "fun", "games", "activity"] },
  { name: "Sports", emoji: "⚽", color: "bg-lime-100", slug: "sports", keywords: ["sports", "soccer", "game", "fitness"] },
  { name: "Custom & AI", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai", keywords: ["ai", "custom", "artificial", "unique"] },
];

export default function SimpleCategories() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const searchLower = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(searchLower) ||
      cat.keywords.some((kw) => kw.toLowerCase().includes(searchLower))
    );
  });

  return (
    <section id="categories" className="text-center py-14">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search cards — love, friendship, happiness..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🟣 Categorías filtradas */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        {filteredCategories.map((cat, i) => (
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
