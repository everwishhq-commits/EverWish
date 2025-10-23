"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

// 🩷 Lista principal (se mantiene tu diseño)
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Congratulations & Milestones", emoji: "🏆", slug: "congrats-milestones", color: "#FFF3C4" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Celebrations", emoji: "🎊", slug: "celebrations", color: "#FFF0C7" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "Adventure", emoji: "🗺️", slug: "adventure", color: "#E8ECFF" },
  { name: "Friendship", emoji: "🤝", slug: "friendship", color: "#FFEAF5" },
  { name: "Holidays", emoji: "🏖️", slug: "holidays", color: "#E4FFF7" },
  { name: "Season Greetings", emoji: "❄️", slug: "season-greetings", color: "#EAF4FF" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#FFF0E5" },
  { name: "Inspirations & Quotes", emoji: "📝", slug: "inspirations-quotes", color: "#E8F6FF" },
  { name: "Gifts & Surprises", emoji: "🎁", slug: "gifts-surprises", color: "#E7E9FF" },
  { name: "Art & Cultural", emoji: "🎨", slug: "art-cultural", color: "#FFEDDF" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because", color: "#FDE6E6" }
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState(allCategories);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Cargar videos/index.json una vez
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error("File not found");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.warn("⚠️ No se pudo cargar videos/index.json (modo local sin errores)");
      }
    }
    loadVideos();
  }, []);

  // 🔍 Buscar coincidencias mientras se escribe
  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFiltered(allCategories);
      setSuggestions([]);
      return;
    }

    // 1️⃣ Buscar coincidencias dentro del index.json
    const matches = new Set();
    const termMatches = [];

    videos.forEach((v) => {
      const fields = [
        v.name,
        v.object,
        v.category,
        v.subcategory,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .map((t) => t.toLowerCase());

      if (fields.some((t) => t.includes(term))) {
        if (v.categories?.length) v.categories.forEach((c) => matches.add(c));
        else if (v.category) matches.add(v.category);
        termMatches.push(...fields.filter((t) => t.includes(term)));
      }
    });

    // 2️⃣ Mostrar sugerencias (limitadas)
    setSuggestions([...new Set(termMatches)].slice(0, 5));

    // 3️⃣ Filtrar categorías visibles en el carrusel
    if (matches.size > 0) {
      setFiltered(allCategories.filter((c) => matches.has(c.name)));
    } else {
      setFiltered(
        allCategories.filter((c) =>
          c.name.toLowerCase().includes(term)
        )
      );
    }
  }, [search, videos]);

  // 🚀 Cuando el usuario da Enter o clic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    // Si hay resultados filtrados
    if (filtered.length > 0) {
      router.push(`/category/${filtered[0].slug}`);
      return;
    }

    alert(`No matches found for "${search}"`);
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>

      {/* 🔍 Barra de búsqueda */}
      <form onSubmit={handleSubmit} className="relative flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. yeti, turtle, love, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
        {/* 🔽 Sugerencias */}
        {suggestions.length > 0 && (
          <div className="absolute top-12 bg-white border border-gray-200 rounded-xl shadow-md w-80 md:w-96 z-10">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSearch(s)}
                className="block w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* 🎠 Carrusel */}
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
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
