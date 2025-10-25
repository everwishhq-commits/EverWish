"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

// ✅ Lista fija de categorías principales
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#E9FFF4" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Work & Professional", emoji: "👩‍💼", slug: "work-professional", color: "#E8FFF3" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance", color: "#F3F3F3" },
  { name: "Congratulations & Milestones", emoji: "🏆", slug: "congrats-milestones", color: "#FFF3C4" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Adventure & Nature", emoji: "🗺️", slug: "adventure-nature", color: "#E8ECFF" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#E7E9FF" },
  { name: "House & Moving", emoji: "🏡", slug: "house-moving", color: "#FFD9E8" },
  { name: "Babies & Parenting", emoji: "🍼", slug: "babies-parenting", color: "#FDE6E6" },
  { name: "Universal", emoji: "✨", slug: "universal", color: "#E5FFE2" },
];

// 🧹 Limpieza de texto
function normalizeText(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);

  // 🔍 Búsqueda directa solo en categorías principales
  useEffect(() => {
    const q = normalizeText(search);
    if (!q) {
      setFiltered(allCategories);
    } else {
      const matches = allCategories.filter(
        (cat) =>
          normalizeText(cat.name).includes(q) ||
          normalizeText(cat.slug).includes(q)
      );
      setFiltered(matches);
    }
  }, [search]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filtered.length > 0) {
      router.push(`/category/${filtered[0].slug}`);
    }
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Explore Categories 💌
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          autoComplete="off"
          placeholder="Search a category — e.g. birthday, love, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel de categorías */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides
        loop
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={1000}
        breakpoints={{
          0: { slidesPerView: 2.4, spaceBetween: 10 },
          640: { slidesPerView: 3.4, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 18 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.map((cat, i) => (
          <SwiperSlide key={i}>
            <motion.div
              className="flex flex-col items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.07 }}
              onClick={() => router.push(`/category/${cat.slug}`)}
            >
              <motion.div
                className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md"
                style={{ backgroundColor: cat.color }}
              >
                <motion.span
                  className="text-4xl sm:text-5xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cat.emoji}
                </motion.span>
              </motion.div>
              <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                {cat.name}
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
                  }
