"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

const allCategories = [
  { name: "Seasonal & Global Celebrations", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Birthdays & Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Love, Weddings & Anniversaries", emoji: "💍", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "👨‍👩‍👧‍👦", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" },
  { name: "Everyday & Appreciation", emoji: "💌", slug: "everyday-appreciation", color: "#FDE6E6" },
  { name: "Creativity & Expression", emoji: "🎨", slug: "creativity-expression", color: "#FFEDDF" },
  { name: "Diversity & Connection", emoji: "🧩", slug: "diversity-connection", color: "#E7E9FF" },
  { name: "Kids & Teens", emoji: "🧸", slug: "kids-teens", color: "#FFE6FA" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
  { name: "Life Journeys & Transitions", emoji: "🏡", slug: "life-journeys-transitions", color: "#E8FFF3" },
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar videos reales desde el API
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error cargando /api/videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Buscar coincidencias (por categoría o subcategoría)
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    const foundCategories = new Set();

    videos.forEach((item) => {
      const searchableText = [
        item.slug,
        item.category,
        item.subcategory,
        item.title,
      ]
        .join(" ")
        .toLowerCase();

      if (searchableText.includes(q)) {
        if (item.category) foundCategories.add(item.category.trim());
      }
    });

    const matches = allCategories.filter((cat) =>
      [...foundCategories].some((f) =>
        f.toLowerCase().includes(cat.name.toLowerCase().split("&")[0].trim())
      )
    );

    setFiltered(matches.length > 0 ? matches : []);
  }, [search, videos]);

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. love, new year, turtle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel de categorías */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={1000}
        breakpoints={{
          0: { slidesPerView: 2.3, spaceBetween: 10 },
          640: { slidesPerView: 3.4, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 18 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <Link href={`/category/${cat.slug}`}>
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.07 }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md"
                    style={{ backgroundColor: cat.color }}
                  >
                    <motion.span
                      className="text-4xl sm:text-5xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {cat.emoji}
                    </motion.span>
                  </motion.div>
                  <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                    {cat.name}
                  </p>
                </motion.div>
              </Link>
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
