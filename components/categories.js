"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

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
          if (
            item.categories?.some(
              (c) => c.toLowerCase().includes(cat.slug.split("-")[0])
            )
          ) {
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
    <section id="categories" className="text-center py-12 px-2 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, love, birthday..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 overflow-hidden">
        <Swiper
          slidesPerView={3.2}
          spaceBetween={12}
          centeredSlides
          loop
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 2.2, spaceBetween: 10 },
            640: { slidesPerView: 3.2, spaceBetween: 12 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
          }}
          modules={[Autoplay]}
          className="pt-8 pb-10 overflow-visible"
        >
          {filtered.length > 0 ? (
            filtered.map((cat, i) => (
              <SwiperSlide key={i} className="flex justify-center">
                <motion.div
                  className="flex flex-col items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto"
                    style={{ backgroundColor: cat.color }}
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(255,182,193,0.25)",
                        "0 0 16px rgba(255,214,165,0.35)",
                        "0 0 20px rgba(255,255,240,0.3)",
                        "0 0 10px rgba(255,182,193,0.25)"
                      ],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
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
              </SwiperSlide>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-8">
              No matching categories for “{search}”
            </p>
          )}
        </Swiper>
      </div>
    </section>
  );
   }
