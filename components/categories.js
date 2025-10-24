"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

// ✅ Slugs corregidos y normalizados (todos coinciden con los de /data/categories.json)
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-and-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-and-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-and-relationships", color: "#E5EDFF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-and-animals", color: "#E9FFF4" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-and-graduation", color: "#E2FFD7" },
  { name: "Work & Professional", emoji: "👩‍💼", slug: "work-and-professional", color: "#E8FFF3" },
  { name: "Health & Support", emoji: "🩺", slug: "health-and-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-and-remembrance", color: "#F3F3F3" },
  { name: "Congratulations", emoji: "🏆", slug: "congratulations-and-milestones", color: "#FFF3C4" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-and-anniversaries", color: "#F3E5FF" },
  { name: "Adventure & Nature", emoji: "🗺️", slug: "adventure-and-nature", color: "#E8ECFF" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-and-memes", color: "#E7F7FF" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-and-appreciation", color: "#E7E9FF" },
  { name: "House & Moving", emoji: "🏡", slug: "house-and-moving", color: "#FFD9E8" },
  { name: "Babies & Parenting", emoji: "🍼", slug: "babies-and-parenting", color: "#FDE6E6" },
  { name: "Universal", emoji: "✨", slug: "universal", color: "#E5FFE2" },
];

// 🧹 Limpieza avanzada para coincidencias
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar index.json
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Filtrar solo categorías principales
  useEffect(() => {
    const q = normalizeText(search);
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    const foundMainCats = new Set();

    videos.forEach((v) => {
      const text = [
        v.object,
        v.subcategory,
        v.variant,
        ...(v.tags || []),
        ...(v.categories || []),
      ]
        .join(" ")
        .toLowerCase();

      if (text.includes(q)) {
        const mainCats = (v.categories || [])
          .map(normalizeText)
          .filter((c) =>
            allCategories.some((cat) => normalizeText(cat.slug) === c || normalizeText(cat.name).includes(c))
          );

        if (mainCats.length === 0) {
          if (text.includes("easter") || text.includes("halloween") || text.includes("christmas"))
            foundMainCats.add("seasonal-and-holidays");
          else if (text.includes("birthday")) foundMainCats.add("birthday");
          else if (text.includes("love") || text.includes("romance")) foundMainCats.add("love-and-romance");
          else if (text.includes("pet") || text.includes("dog") || text.includes("cat"))
            foundMainCats.add("pets-and-animals");
        } else {
          mainCats.forEach((c) => foundMainCats.add(c));
        }
      }
    });

    const matches = allCategories.filter((cat) =>
      foundMainCats.has(normalizeText(cat.slug))
    );

    setFiltered(matches.length > 0 ? matches : allCategories);
  }, [search, videos]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && search.trim()) {
      const first = filtered[0];
      if (first) {
        router.push(`/category/${first.slug}`);
        setTimeout(() => setSearch(""), 400);
      }
    }
  };

  const handleCategoryClick = (slug) => {
    router.push(`/category/${slug}`);
    setTimeout(() => setSearch(""), 400);
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          inputMode="search"
          placeholder="Search any theme — e.g. bunny, pumpkin, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel */}
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
              onClick={() => handleCategoryClick(cat.slug)}
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
