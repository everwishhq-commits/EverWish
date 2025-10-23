"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// ⚠️ Usa tus categorías reales; NO cambio tus nombres/slug.
// (Puedes extender esta lista si lo deseas)
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Just Because & Everyday", emoji: "💌", slug: "just-because", color: "#FDE6E6" },
];

const norm = (s = "") =>
  s.toString().toLowerCase().replace(/&/g, "and").replace(/[^\p{L}\p{N}]+/gu, "-").trim();

export default function Categories() {
  const router = useRouter();
  const params = useSearchParams();

  // toma /categories?search=...
  const initial = params.get("search") || "";
  const [search, setSearch] = useState(initial);
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // Carga el índice real (tu script de 1400 líneas ya genera esto)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando /videos/index.json", e);
      }
    })();
  }, []);

  // Refleja el término en la URL (sin navegar de página ni romper nada)
  useEffect(() => {
    const t = setTimeout(() => {
      const q = encodeURIComponent(search || "");
      router.replace(`/categories${q ? `?search=${q}` : ""}`);
    }, 300); // debounce suave
    return () => clearTimeout(t);
  }, [search, router]);

  // Filtra categorías principales cuando hay término
  useEffect(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    // Coincidimos por: name, slug, y TODO el texto de los videos (name, tags, object, category, subcategory, categories)
    const matchedCatSlugs = new Set();

    for (const v of videos) {
      const hayTexto = [
        v.name,
        v.object,
        v.category,
        v.subcategory,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);

      if (!hayTexto) continue;

      // Preferimos categories[] si existe; si no, usamos category
      if (Array.isArray(v.categories) && v.categories.length) {
        for (const c of v.categories) matchedCatSlugs.add(norm(c));
      } else if (v.category) {
        matchedCatSlugs.add(norm(v.category));
      }
    }

    // Si no hubo match en videos, también permitimos match directo por nombre/slug de la categoría
    const result = allCategories.filter(
      (c) =>
        matchedCatSlugs.has(norm(c.name)) ||
        matchedCatSlugs.has(norm(c.slug)) ||
        c.name.toLowerCase().includes(q) ||
        norm(c.slug).includes(norm(q))
    );

    setFiltered(result.length ? result : []);
  }, [search, videos]);

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>

      {/* 🔎 Barra de búsqueda (sin autofill del navegador) */}
      <div className="flex justify-center mb-10">
        <input
          type="search"
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
          {filtered.map((cat) => (
            <SwiperSlide key={cat.slug}>
              <Link href={`/category/${cat.slug}`}>
                <motion.div className="flex flex-col items-center justify-center cursor-pointer" whileHover={{ scale: 1.07 }}>
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
                  <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">{cat.name}</p>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-gray-500 text-sm mt-8">
          No matching categories for “{search || " " }”
        </p>
      )}
    </section>
  );
      }
