"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// 🌸 CATEGORÍAS LIMPIAS Y UNIFICADAS
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Professions & Appreciation", emoji: "👩‍🏫", slug: "professions-appreciation", color: "#E8FFF3" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Congratulations & Milestones", emoji: "🏆", slug: "congrats-milestones", color: "#FFF3C4" },
  { name: "Home & Life Changes", emoji: "🏡", slug: "home-life-changes", color: "#E8FFF3" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance", color: "#F3F3F3" },
  { name: "Gifts & Surprises", emoji: "🎁", slug: "gifts-surprises", color: "#E7E9FF" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "Adventure & Nature", emoji: "🗺️", slug: "adventure-nature", color: "#E8ECFF" },
  { name: "Kids & Teens", emoji: "🧸", slug: "kids-teens", color: "#FFE6FA" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because", color: "#FDE6E6" },
  { name: "Invitations & Events", emoji: "✉️", slug: "invitations-events", color: "#FFD9E8" },
  { name: "Inspirations & Quotes", emoji: "📝", slug: "inspirations-quotes", color: "#E8F6FF" },
  { name: "Custom & AI Creations", emoji: "🤖", slug: "custom-ai-creations", color: "#E5FFE2" },
];

export default function Categories() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);
  const [glossary, setGlossary] = useState({});

  // 📥 Cargar videos + glosario
  useEffect(() => {
    async function loadData() {
      try {
        const [videosRes, glossaryRes] = await Promise.all([
          fetch("/videos/index.json", { cache: "no-store" }),
          fetch("/data/glossary.json", { cache: "no-store" })
        ]);

        const [videosData, glossaryData] = await Promise.all([
          videosRes.json(),
          glossaryRes.json()
        ]);

        setVideos(Array.isArray(videosData) ? videosData : []);
        setGlossary(glossaryData || {});
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    }
    loadData();
  }, []);

  // 🔍 Filtrar según búsqueda (usa glosario + videos)
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    const foundCategories = new Set();

    // Buscar en los nombres / tags de videos
    videos.forEach((item) => {
      const text = [
        item.name,
        item.object,
        item.subcategory,
        item.category,
        ...(item.tags || []),
        ...(item.categories || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (text.includes(q)) {
        if (item.categories?.length > 0) {
          item.categories.forEach((c) => foundCategories.add(c));
        } else if (item.category) {
          foundCategories.add(item.category.trim());
        }
      }
    });

    // Buscar también en el glosario
    for (const [catName, info] of Object.entries(glossary)) {
      if (info.keywords.some((word) => word.toLowerCase().includes(q))) {
        foundCategories.add(catName);
      }
    }

    // Cruzar con las categorías visibles
    const matches = allCategories.filter((cat) =>
      [...foundCategories].some(
        (f) =>
          f.toLowerCase().replace("&", "and").includes(cat.name.toLowerCase().split("&")[0].trim()) ||
          f.toLowerCase().includes(cat.slug)
      )
    );

    setFiltered(matches.length > 0 ? matches : []);
  }, [search, videos, glossary]);

  // 🧭 Enter para buscar
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/categories?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const isHome = pathname === "/";

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          inputMode="search"
          placeholder="Search any theme — e.g. turtle, mountain, love..."
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
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <Link
                href={`/category/${cat.slug}${search ? `?search=${encodeURIComponent(search)}` : ""}`}
              >
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
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
