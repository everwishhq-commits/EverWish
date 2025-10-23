"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

// 🩷 Categorías principales (diseño Everwish)
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

  // 🔹 Cargar /public/videos/index.json
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error("index.json not found");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error loading /videos/index.json:", err);
      }
    }
    loadVideos();
  }, []);

  // 🚀 Al presionar Enter o Buscar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const term = search.toLowerCase().trim();

    // Buscar coincidencia en index.json
    const found = videos.find((v) =>
      [
        v.name,
        v.object,
        v.category,
        v.subcategory,
        ...(v.categories || []),
      ]
        .filter(Boolean)
        .map((t) => t.toLowerCase())
        .some((t) => t.includes(term))
    );

    if (found) {
      const category =
        (found.categories && found.categories[0]) ||
        found.category ||
        found.subcategory ||
        "general";

      // Normalizar slug
      const slug = category.toLowerCase().replace(/\s+/g, "-");
      router.push(`/category/${slug}`);
    } else {
      alert(`No matches found for "${search}"`);
    }
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>

      {/* 🔍 Barra de búsqueda */}
      <form onSubmit={handleSubmit} className="flex justify-center mb-10">
        <input
          type="text"
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
        {allCategories.map((cat) => (
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
        ))}
      </Swiper>
    </section>
  );
}
