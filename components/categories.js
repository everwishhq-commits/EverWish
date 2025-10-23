"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Christmas", emoji: "🎄", slug: "christmas", color: "#E6FFF2" },
  { name: "Halloween", emoji: "🎃", slug: "halloween", color: "#FFF0D8" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because", color: "#FDE6E6" },
];

const normalize = (s = "") =>
  s.toString().toLowerCase().replace(/&/g, "and").replace(/[^\p{L}\p{N}]+/gu, "-").trim();

export default function Categories() {
  const router = useRouter();
  const params = useSearchParams();
  const queryParam = params.get("search") || "";
  const [search, setSearch] = useState(queryParam);
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar videos reales
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("⚠️ Error cargando videos:", e);
      }
    })();
  }, []);

  // ⏱️ Debounce: espera 1 segundo antes de filtrar/redirigir
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(`/categories?search=${encodeURIComponent(search)}`);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  // 🔍 Filtrar categorías con coincidencias reales
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    const matches = new Set();

    for (const v of videos) {
      const text = [
        v.name,
        v.object,
        v.category,
        v.subcategory,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      // 🧠 Coincidencia flexible
      if (text.includes(q)) {
        if (Array.isArray(v.categories) && v.categories.length > 0) {
          for (const c of v.categories) {
            matches.add(normalize(c));
          }
        } else if (v.category) {
          matches.add(normalize(v.category));
        }
      }
    }

    const result = allCategories.filter(
      (c) =>
        matches.has(normalize(c.name)) ||
        matches.has(normalize(c.slug)) ||
        c.name.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, videos]);

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      {search && (
        <p className="text-sm text-gray-500 mb-2">
          Showing results for: <b className="text-pink-500">{search}</b>
        </p>
      )}

      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Explore Main Categories 💌
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          name="category-search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          inputMode="search"
          placeholder="Search any theme — e.g. yeti, turtle, love, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel */}
      {filtered.length > 0 ? (
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
          ))}
        </Swiper>
      ) : (
        <p className="text-gray-500 text-sm mt-8">
          No matching categories for “{search}”
        </p>
      )}
    </section>
  );
            }
