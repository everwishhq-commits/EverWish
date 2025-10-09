"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// 💡 Lista de categorías principales
const mainCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays" },
  { name: "Birthdays", emoji: "🎂", color: "bg-pink-200", slug: "birthdays" },
  { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships" },
  { name: "Babies & Parenting", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting" },
  { name: "Weddings & Anniversaries", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries" },
  { name: "Congratulations & Milestones", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones" },
  { name: "School & Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation" },
  { name: "Work & Professional", emoji: "💼", color: "bg-cyan-200", slug: "work-professional" },
  { name: "House & Moving", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving" },
  { name: "Health & Support", emoji: "🩺", color: "bg-teal-200", slug: "health-support" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance" },
  { name: "Encouragement & Motivation", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation" },
  { name: "Thank You & Appreciation", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation" },
  { name: "Invitations & Events", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events" },
  { name: "Spiritual & Mindfulness", emoji: "🕯️", color: "bg-orange-200", slug: "spiritual-mindfulness" },
  { name: "Art & Culture", emoji: "🎨", color: "bg-stone-200", slug: "art-culture" },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens" },
  { name: "Humor & Memes", emoji: "😄", color: "bg-rose-100", slug: "humor-memes" },
  { name: "Pets & Animal Lovers", emoji: "🐾", color: "bg-green-100", slug: "pets" },
  { name: "Just Because & Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
  { name: "Gifts & Surprises", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises" },
  { name: "Inspirations & Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes" },
  { name: "Custom & AI Creations", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai" },
];

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const [showAI, setShowAI] = useState(false);

  // 🔍 Filtrar resultados
  const filtered = mainCategories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
        Explore our Categories
      </h1>
      <p className="text-gray-500 mb-8">
        Find the perfect card for every moment 💖
      </p>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowAI(false);
          }}
          className="w-full max-w-md border border-gray-300 rounded-full px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* 🧭 Carrusel */}
      {filtered.length > 0 ? (
        <Swiper
          slidesPerView={2.3}
          spaceBetween={15}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3.5, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 25 },
          }}
          modules={[Autoplay]}
          className="overflow-visible custom-scroll pb-10"
        >
          {filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <Link href={`/categories/${cat.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className={`${cat.color} rounded-3xl shadow-md hover:shadow-xl flex flex-col items-center justify-center p-6 aspect-square`}
                >
                  <span className="text-5xl mb-3">{cat.emoji}</span>
                  <p className="font-semibold text-sm md:text-base text-gray-800">
                    {cat.name}
                  </p>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // 💫 Popup si no hay resultados
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center mt-20"
          >
            <p className="text-gray-600 mb-4">
              No results found for “{query}”
            </p>
            <button
              onClick={() => setShowAI(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
            >
              Create with AI 💫
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* 🌟 Modal AI */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            key="ai-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center w-80 max-w-sm"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Create your unique card ✨
              </h2>
              <p className="text-gray-600 mb-6">
                Let Everwish AI design a card for <b>{query || "you"}</b>!
              </p>
              <button
                onClick={() => alert("✨ Opening AI Creator...")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
              >
                Start Now
              </button>
              <button
                onClick={() => setShowAI(false)}
                className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
         }
