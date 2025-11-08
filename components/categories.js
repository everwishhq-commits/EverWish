"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "swiper/css";

const allCategories = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" }, 
  { name: "Diversity & Connection", emoji: "🧩", slug: "diversity-connection", color: "#E7E9FF" },
  { name: "Sports", emoji: "🏟️", slug: "sports", color: "#FFE6FA" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions", color: "#E8FFF3" },
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar videos desde API
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        
        console.log("📹 Total videos cargados:", data.videos?.length || 0);
        console.log("📦 Estructura de datos:", data);
        
        // Debug: mostrar primeros 3 videos
        if (data.videos && data.videos.length > 0) {
          console.log("🎬 Primeros 3 videos de ejemplo:");
          data.videos.slice(0, 3).forEach((v, i) => {
            console.log(`  ${i + 1}.`, {
              name: v.name,
              category: v.category,
              categories: v.categories,
              subcategory: v.subcategory,
              tags: v.tags
            });
          });
        }
        
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error cargando /api/videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Filtrar categorías según palabra buscada
  useEffect(() => {
    const q = search.toLowerCase().trim();
    
    // Sin búsqueda → mostrar todas
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    console.log("🔍 Buscando:", q);
    console.log("📹 Total videos disponibles:", videos.length);

    // Encontrar categorías que tienen videos con la palabra buscada
    const categoriesWithMatch = new Set();
    let videosFound = 0;

    videos.forEach((video) => {
      // Buscar en: object, nombre, tags, categorías, subcategoría
      const searchableText = [
        video.name,
        video.object,
        ...(video.categories || [video.category]),
        video.subcategory,
        video.slug,
        ...(video.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (searchableText.includes(q)) {
        videosFound++;
        console.log(`  ✅ Match encontrado en:`, {
          name: video.name,
          categories: video.categories || [video.category],
          subcategory: video.subcategory,
          searchable: searchableText
        });
        
        // Agregar TODAS las categorías del video
        if (video.categories && Array.isArray(video.categories)) {
          video.categories.forEach(cat => {
            categoriesWithMatch.add(cat.toLowerCase().trim());
          });
        } else if (video.category) {
          categoriesWithMatch.add(video.category.toLowerCase().trim());
        }
      }
    });

    console.log(`🎯 Videos encontrados: ${videosFound}`);
    console.log("📦 Categorías con coincidencias:", [...categoriesWithMatch]);

    // Filtrar categorías base
    const matches = allCategories.filter((cat) => {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      return [...categoriesWithMatch].some((matchCat) => {
        const normalized = matchCat.replace(/&/g, "and").replace(/\s+/g, "-");
        return (
          normalized.includes(catSlug) ||
          catSlug.includes(normalized) ||
          matchCat.includes(catName) ||
          catName.includes(matchCat)
        );
      });
    });

    console.log("✅ Categorías filtradas:", matches.map(m => m.name));
    setFiltered(matches.length > 0 ? matches : []);
  }, [search, videos]);

  // 🎯 Navegar a categoría con query de búsqueda
  const handleCategoryClick = (cat) => {
    if (search.trim()) {
      router.push(`/category/${cat.slug}?q=${encodeURIComponent(search)}`);
    } else {
      router.push(`/category/${cat.slug}`);
    }
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, turtle, love..."
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
        loop={filtered.length > 3}
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
              <div onClick={() => handleCategoryClick(cat)}>
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
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="w-full flex justify-center">
            <p className="text-gray-500 text-sm mt-8">
              No matching categories for "{search}"
            </p>
          </div>
        )}
      </Swiper>
    </section>
  );
          }
