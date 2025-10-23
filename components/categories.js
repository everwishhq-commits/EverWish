"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

// 🎨 Lista base de categorías (nombres limpios y visibles)
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Christmas", emoji: "🎄", slug: "christmas", color: "#EAF4FF" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#FFF0E5" },
  { name: "Inspirations & Quotes", emoji: "📝", slug: "inspirations-quotes", color: "#E8F6FF" },
  { name: "Adventure", emoji: "🗺️", slug: "adventure", color: "#E8ECFF" },
  { name: "Friendship", emoji: "🤝", slug: "friendship", color: "#FFEAF5" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Gifts & Surprises", emoji: "🎁", slug: "gifts-surprises", color: "#E7E9FF" },
  { name: "Just Because", emoji: "💌", slug: "just-because", color: "#FDE6E6" },
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState(allCategories);

  // ✅ Carga index.json
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error("index.json not found");
        const data = await res.json();
        setVideos(data);
      } catch {
        console.warn("⚠️ index.json no encontrado — usando modo local");
      }
    }
    load();
  }, []);

  // 🔍 Sincroniza búsqueda
  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFiltered(allCategories);
      return;
    }

    // Buscar coincidencias dentro del index.json
    const matchedCategories = new Set();

    videos.forEach((v) => {
      const allText = [
        v.name,
        v.object,
        v.category,
        v.subcategory,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .map((t) => t.toLowerCase());

      if (allText.some((t) => t.includes(term))) {
        if (v.categories?.length)
          v.categories.forEach((c) => matchedCategories.add(c));
        else if (v.category) matchedCategories.add(v.category);
      }
    });

    // Filtrar categorías visibles según coincidencias
    const newFiltered =
      matchedCategories.size > 0
        ? allCategories.filter((c) =>
            [...matchedCategories].some((m) =>
              c.name.toLowerCase().includes(m.toLowerCase())
            )
          )
        : allCategories.filter((c) =>
            c.name.toLowerCase().includes(term)
          );

    setFiltered(newFiltered);
  }, [search, videos]);

  // 🚀 Enviar búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    const match = filtered[0];
    if (match) router.push(`/category/${match.slug}`);
    else alert(`No results found for "${search}"`);
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔍 Barra de búsqueda limpia y sin autofill */}
      <form
        onSubmit={handleSubmit}
        className="relative flex justify-center mb-10"
        autoComplete="off"
      >
        <input
          type="text"
          name="search"
          autoComplete="off"
          spellCheck="false"
          placeholder="Search any theme — e.g. yeti, turtle, love, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </form>

      {/* 🎠 Carrusel de categorías */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides
        loop
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={1000}
        breakpoints={{
          0: { slidesPerView: 2.2, spaceBetween: 8 },
          640: { slidesPerView: 3.5, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 18 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.length > 0 ? (
          filtered.map((cat) => (
            <SwiperSlide key={cat.slug}>
              <button
                type="button"
                onClick={() => router.push(`/category/${cat.slug}`)}
                className="w-full"
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
              </button>
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
