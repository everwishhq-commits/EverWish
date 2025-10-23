"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// 🔧 Función para normalizar texto (para búsquedas)
const norm = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export default function Categories() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [videoIndex, setVideoIndex] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 🌸 CATEGORÍAS PRINCIPALES
  useEffect(() => {
    setCategories([
      { name: "Love & Romance", icon: "💖", slug: "love-romance" },
      { name: "Family & Relationships", icon: "👨‍👩‍👧", slug: "family-relationships" },
      { name: "Babies & Parenting", icon: "👶", slug: "babies-parenting" },
      { name: "Friendship", icon: "🤝", slug: "friendship" },
      { name: "Birthdays", icon: "🎂", slug: "birthday" },
      { name: "Celebrations", icon: "🎉", slug: "celebrations" },
      { name: "Encouragement", icon: "🌈", slug: "encouragement-motivation" },
      { name: "Pets & Animal Lovers", icon: "🐾", slug: "pets-animal-lovers" },
      { name: "Work & Professional", icon: "💼", slug: "work-professional" },
      { name: "Get Well Soon", icon: "💐", slug: "health-support" },
      { name: "Thank You", icon: "🙏", slug: "thank-you-appreciation" },
      { name: "Anniversaries", icon: "💍", slug: "weddings-anniversaries" },
      { name: "Weddings", icon: "👰", slug: "weddings-anniversaries" },
      { name: "New Baby", icon: "🍼", slug: "babies-parenting" },
      { name: "Holidays", icon: "🏖️", slug: "holidays" },
      { name: "Halloween", icon: "🎃", slug: "seasonal-holidays" },
      { name: "Christmas", icon: "🎄", slug: "seasonal-holidays" },
      { name: "Easter", icon: "🐰", slug: "seasonal-holidays" },
      { name: "New Year", icon: "🎆", slug: "seasonal-holidays" },
      { name: "Valentine’s Day", icon: "💌", slug: "love-romance" },
      { name: "Mother’s Day", icon: "🌸", slug: "family-relationships" },
      { name: "Father’s Day", icon: "🧢", slug: "family-relationships" },
      { name: "School & Graduation", icon: "🎓", slug: "school-graduation" },
      { name: "Thanksgiving", icon: "🦃", slug: "seasonal-holidays" },
      { name: "Condolences", icon: "🕊️", slug: "sympathy-remembrance" },
      { name: "Motivation", icon: "🔥", slug: "encouragement-motivation" },
      { name: "Sports & Team Spirit", icon: "⚽", slug: "sports-team" },
      { name: "Congratulations", icon: "🏆", slug: "congrats-milestones" },
      { name: "Travel & Adventure", icon: "✈️", slug: "adventure" },
      { name: "Just Because", icon: "💌", slug: "just-because" },
    ]);
  }, []);

  // 📂 SUBCATEGORÍAS
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/subcategories.json", { cache: "no-store" });
        const data = await res.json();
        const flat = [];
        Object.entries(data).forEach(([catSlug, subs]) => {
          subs.forEach((sub) => {
            flat.push({
              categorySlug: catSlug,
              name_en: sub.name_en,
              name_es: sub.name_es,
            });
          });
        });
        setSubcategories(flat);
      } catch (err) {
        console.error("Error loading subcategories.json", err);
      }
    })();
  }, []);

  // 🎬 TARJETAS (solo para analizar las palabras, no mostrar)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideoIndex(data);
      } catch (e) {
        console.error("Error loading videos/index.json", e);
      }
    })();
  }, []);

  // 🔍 FILTRAR CATEGORÍAS RELACIONADAS CON LA PALABRA
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const q = norm(query);

    // 1️⃣ Buscar en tarjetas: si una tarjeta contiene la palabra, recuperar su categoría
    const matchedCategories = new Set();

    videoIndex.forEach((item) => {
      const allText =
        `${item.name} ${item.object || ""} ${(item.tags || []).join(" ")} ${
          item.category || ""
        } ${(item.subcategory || "")}`.toLowerCase();

      if (allText.includes(q)) {
        if (item.category) matchedCategories.add(norm(item.category));
        if (item.subcategory) matchedCategories.add(norm(item.subcategory));
      }
    });

    // 2️⃣ Filtrar categorías principales o subcategorías que coincidan con esas palabras
    const matches = categories.filter((c) =>
      Array.from(matchedCategories).some((m) => norm(c.name).includes(m))
    );

    setFiltered(matches);
  }, [query, videoIndex, categories]);

  const handleClick = (slug) => router.push(`/category/${slug}`);

  // 🎨 DISEÑO ORIGINAL
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search any theme — e.g. yeti, turtle, July 4th"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-8 text-gray-700 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-center shadow-sm"
      />

      {/* 🎠 Carrusel si no hay búsqueda */}
      {!query && (
        <div className="w-full max-w-5xl mb-8">
          <Swiper
            spaceBetween={20}
            slidesPerView={3.2}
            breakpoints={{ 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.slug}>
                <motion.div
                  onClick={() => handleClick(cat.slug)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    className="rounded-full shadow-md p-6 flex items-center justify-center text-5xl"
                    style={{
                      backgroundColor:
                        ["#FFE3E3", "#E3FFF0", "#FFF6D9", "#E5E8FF", "#FFEFE3"][
                          Math.floor(Math.random() * 5)
                        ],
                    }}
                  >
                    {cat.icon}
                  </div>
                  <p className="text-gray-800 mt-3 font-medium text-sm text-center w-[110px] leading-tight">
                    {cat.name}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* 🔎 Resultados → sólo categorías relacionadas */}
      {query && (
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
          {filtered.length === 0 ? (
            <p className="text-gray-400 mt-4">No matches found 🌱</p>
          ) : (
            filtered.map((c) => (
              <motion.div
                key={c.slug}
                onClick={() => handleClick(c.slug)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className="rounded-full shadow-md p-6 flex items-center justify-center text-5xl"
                  style={{
                    backgroundColor:
                      ["#FFE3E3", "#E3FFF0", "#FFF6D9", "#E5E8FF", "#FFEFE3"][
                        Math.floor(Math.random() * 5)
                      ],
                  }}
                >
                  {c.icon}
                </div>
                <p className="text-gray-800 mt-3 font-medium text-sm text-center w-[110px] leading-tight">
                  {c.name}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
      }
