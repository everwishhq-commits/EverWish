"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays" },
  { name: "Birthday", emoji: "🎂", slug: "birthday" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries" },
  { name: "Congratulations & Milestones", emoji: "🏆", slug: "congrats-milestones" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation" },
  { name: "Work & Professional", emoji: "💼", slug: "work-professional" },
  { name: "House & Moving", emoji: "🏡", slug: "house-moving" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance" },
  { name: "Encouragement & Motivation", emoji: "🌟", slug: "encouragement-motivation" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation" },
  { name: "Invitations & Events", emoji: "✉️", slug: "invitations-events" },
  { name: "Spiritual & Mindfulness", emoji: "🕯️", slug: "spiritual-mindfulness" },
  { name: "Art & Cultural", emoji: "🎨", slug: "art-cultural" },
  { name: "Kids & Teens", emoji: "🧸", slug: "kids-teens" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because" },
  { name: "Gifts & Surprises", emoji: "🎁", slug: "gifts-surprises" },
  { name: "Inspirations & Quotes", emoji: "📝", slug: "inspirations-quotes" },
  { name: "Custom & AI Creations", emoji: "🤖", slug: "custom-ai-creations" },
  { name: "Celebrations", emoji: "🎊", slug: "celebrations" },
  { name: "Holidays", emoji: "🏖️", slug: "holidays" },
  { name: "Adventure", emoji: "🗺️", slug: "adventure" },
  { name: "Friendship", emoji: "🤝", slug: "friendship" },
  { name: "Festivals", emoji: "🎭", slug: "festivals" },
  { name: "Season Greetings", emoji: "❄️", slug: "season-greetings" }
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error cargando index.json:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) return setFiltered(allCategories);

    const matches = new Set();
    videos.forEach((item) => {
      const match =
        item.name.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      if (match) {
        allCategories.forEach((cat) => {
          if (item.name.toLowerCase().includes(cat.slug.split("-")[0])) {
            matches.add(cat.name);
          }
        });
      }
    });

    const filteredCats =
      matches.size > 0
        ? allCategories.filter((cat) => matches.has(cat.name))
        : [];

    setFiltered(filteredCats);
  }, [search, videos]);

  return (
    <section id="categories" className="text-center py-12 px-2">
      {/* ✅ Título único */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, love, birthday..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel circular con animación sutil */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={8} // 🔹 espacio reducido entre categorías
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={900}
        breakpoints={{
          0: { slidesPerView: 2.2, spaceBetween: 6 },
          640: { slidesPerView: 3.2, spaceBetween: 8 },
          1024: { slidesPerView: 5, spaceBetween: 10 },
        }}
        modules={[Autoplay]}
        className="overflow-visible pb-8 pt-4"
        style={{ overflow: "visible" }}
      >
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-pink-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto overflow-visible">
                  <motion.span
                    className="text-4xl sm:text-5xl"
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {cat.emoji}
                  </motion.span>
                </div>
                <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                  {cat.name}
                </p>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matching categories for “{search}”
          </p>
        )}
      </Swiper>
    </section>
  );
  }
