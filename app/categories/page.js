"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Congratulations & Milestones", emoji: "🏆", slug: "congrats-milestones", color: "#FFF3C4" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Work & Professional", emoji: "💼", slug: "work-professional", color: "#D9F3FF" },
  { name: "House & Moving", emoji: "🏡", slug: "house-moving", color: "#E8FFF3" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance", color: "#F3F3F3" },
  { name: "Encouragement & Motivation", emoji: "🌟", slug: "encouragement-motivation", color: "#FFF5D9" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#FFF0E5" },
  { name: "Invitations & Events", emoji: "✉️", slug: "invitations-events", color: "#FFD9E8" },
  { name: "Spiritual & Mindfulness", emoji: "🕯️", slug: "spiritual-mindfulness", color: "#EDEAFF" },
  { name: "Art & Cultural", emoji: "🎨", slug: "art-cultural", color: "#FFEDDF" },
  { name: "Kids & Teens", emoji: "🧸", slug: "kids-teens", color: "#FFE6FA" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because", color: "#FDE6E6" },
  { name: "Gifts & Surprises", emoji: "🎁", slug: "gifts-surprises", color: "#E7E9FF" },
  { name: "Inspirations & Quotes", emoji: "📝", slug: "inspirations-quotes", color: "#E8F6FF" },
  { name: "Custom & AI Creations", emoji: "🤖", slug: "custom-ai-creations", color: "#E5FFE2" },
  { name: "Celebrations", emoji: "🎊", slug: "celebrations", color: "#FFF0C7" },
  { name: "Holidays", emoji: "🏖️", slug: "holidays", color: "#E4FFF7" },
  { name: "Adventure", emoji: "🗺️", slug: "adventure", color: "#E8ECFF" },
  { name: "Friendship", emoji: "🤝", slug: "friendship", color: "#FFEAF5" },
  { name: "Festivals", emoji: "🎭", slug: "festivals", color: "#FEEAFF" },
  { name: "Season Greetings", emoji: "❄️", slug: "season-greetings", color: "#EAF4FF" }
];

export default function CategoriesGridPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Discover every Everwish theme and celebration ✨
      </p>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-12 w-full">
        <input
          type="text"
          placeholder="Search any theme — e.g. yeti, turtle, love, holidays..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/80"
        />
      </div>

      {/* 🧩 Cuadrícula de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="cursor-pointer flex flex-col items-center justify-center rounded-3xl shadow-md border border-pink-100 text-gray-800 font-semibold p-6 hover:border-pink-200 hover:bg-pink-50"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-5xl mb-3">{cat.emoji}</span>
              <span className="text-sm md:text-base text-center">{cat.name}</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matching categories for “{search}”
          </p>
        )}
      </div>
    </main>
  );
   }
