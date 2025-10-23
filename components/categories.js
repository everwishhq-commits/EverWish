"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Categories() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]); // categorías principales
  const [subcategories, setSubcategories] = useState([]); // subcategorías
  const [filtered, setFiltered] = useState([]); // resultados combinados
  const router = useRouter(); // ✅ solo una vez

  // 🎠 CATEGORÍAS PRINCIPALES (para carrusel)
  useEffect(() => {
    setCategories([
      { name: "Love & Romance", icon: "💖", slug: "love-romance" },
      { name: "Family & Relationships", icon: "👨‍👩‍👧", slug: "family-relationships" },
      { name: "Babies & Parenting", icon: "👶", slug: "babies-parenting" },
      { name: "Friendship", icon: "🤝", slug: "friendship" },
      { name: "Birthdays", icon: "🎂", slug: "birthdays" },
      { name: "Celebrations", icon: "🎉", slug: "celebrations" },
      { name: "Encouragement", icon: "🌈", slug: "encouragement" },
      { name: "Pets & Animal Lovers", icon: "🐾", slug: "pets-animal-lovers" },
      { name: "Work & Success", icon: "💼", slug: "work-success" },
      { name: "Get Well Soon", icon: "💐", slug: "get-well-soon" },
      { name: "Thank You", icon: "🙏", slug: "thank-you" },
      { name: "Anniversaries", icon: "💍", slug: "anniversaries" },
      { name: "Weddings", icon: "👰", slug: "weddings" },
      { name: "New Baby", icon: "🍼", slug: "new-baby" },
      { name: "Holidays", icon: "🎄", slug: "holidays" },
      { name: "Halloween", icon: "🎃", slug: "halloween" },
      { name: "Christmas", icon: "🎁", slug: "christmas" },
      { name: "Easter", icon: "🐰", slug: "easter" },
      { name: "New Year", icon: "🎆", slug: "new-year" },
      { name: "Valentine’s Day", icon: "💌", slug: "valentines-day" },
      { name: "Mother’s Day", icon: "🌸", slug: "mothers-day" },
      { name: "Father’s Day", icon: "🧢", slug: "fathers-day" },
      { name: "Graduation", icon: "🎓", slug: "graduation" },
      { name: "Thanksgiving", icon: "🦃", slug: "thanksgiving" },
      { name: "Condolences", icon: "🕊️", slug: "condolences" },
      { name: "Motivation", icon: "🔥", slug: "motivation" },
      { name: "Seasonal", icon: "🌤️", slug: "seasonal" },
      { name: "Sports & Team Spirit", icon: "⚽", slug: "sports-team" },
      { name: "Congratulations", icon: "🏆", slug: "congratulations" },
      { name: "Travel & Adventure", icon: "✈️", slug: "travel-adventure" },
    ]);
  }, []);

  // 📂 SUBCATEGORÍAS DESDE JSON
  useEffect(() => {
    async function loadSubcategories() {
      try {
        const res = await fetch("/data/subcategories.json", { cache: "no-store" });
        const data = await res.json();
        const flat = [];

        Object.entries(data).forEach(([categorySlug, subs]) => {
          subs.forEach((sub) => {
            flat.push({
              categorySlug,
              name_en: sub.name_en,
              name_es: sub.name_es,
              slug: sub.slug,
            });
          });
        });

        setSubcategories(flat);
      } catch (err) {
        console.error("❌ Error loading subcategories:", err);
      }
    }

    loadSubcategories();
  }, []);

  // 🔍 BÚSQUEDA COMBINADA (categorías + subcategorías)
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const lower = query.toLowerCase();

    // Buscar en categorías principales
    const catResults = categories.filter(
      (c) => c.name.toLowerCase().includes(lower) || c.slug.toLowerCase().includes(lower)
    );

    // Buscar en subcategorías
    const subResults = subcategories.filter(
      (s) =>
        s.name_en.toLowerCase().includes(lower) ||
        s.name_es.toLowerCase().includes(lower) ||
        s.categorySlug.toLowerCase().includes(lower)
    );

    // Combinar ambos resultados y quitar duplicados
    const combined = [
      ...catResults.map((c) => ({
        name: c.name,
        icon: c.icon,
        slug: c.slug,
        type: "category",
      })),
      ...subResults.map((s) => ({
        name: s.name_en,
        icon: "🌸",
        slug: s.categorySlug,
        type: "subcategory",
      })),
    ];

    const unique = combined.filter(
      (item, index, self) => index === self.findIndex((t) => t.slug === item.slug)
    );

    setFiltered(unique);
  }, [query, categories, subcategories]);

  const handleClick = (slug) => router.push(`/category/${slug}`);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search any theme — e.g. yeti, turtle, love"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-8 text-gray-700 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-center shadow-sm"
      />

      {/* 🎠 Carrusel visible si no hay búsqueda */}
      {!query && (
        <div className="w-full max-w-5xl mb-8">
          <Swiper
            spaceBetween={20}
            slidesPerView={3.2}
            breakpoints={{
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  onClick={() => handleClick(cat.slug)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-pink-100 shadow-sm hover:shadow-md rounded-3xl px-6 py-6 text-gray-700 font-semibold text-center cursor-pointer"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <p className="text-sm">{cat.name}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* 🏷️ Resultados de búsqueda */}
      {query && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
          {filtered.length > 0 ? (
            filtered.map((r, i) => (
              <motion.button
                key={i}
                onClick={() => handleClick(r.slug)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-pink-100 shadow-sm hover:shadow-md rounded-3xl px-6 py-4 text-gray-700 font-semibold text-center w-[140px] h-[140px] flex flex-col justify-center items-center hover:border-pink-300"
              >
                <span className="text-3xl mb-2">{r.icon}</span>
                <span className="text-sm text-center">{r.name}</span>
              </motion.button>
            ))
          ) : (
            <p className="text-gray-400 mt-4">No matches found 🌱</p>
          )}
        </div>
      )}
    </div>
  );
}
