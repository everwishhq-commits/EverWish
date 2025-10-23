"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const norm = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim();

export default function Categories() {
  const router = useRouter();

  // UI
  const [query, setQuery] = useState("");

  // Datos
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [videoIndex, setVideoIndex] = useState([]);

  // =========================
  // 1) CATEGORÍAS (carrusel)
  // =========================
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
      { name: "Sympathy & Remembrance", icon: "🕊️", slug: "sympathy-remembrance" },
      { name: "Motivation", icon: "🔥", slug: "encouragement-motivation" },
      { name: "Seasonal & Holidays", icon: "🎊", slug: "seasonal-holidays" },
      { name: "Congratulations & Milestones", icon: "🏆", slug: "congrats-milestones" },
      { name: "Travel & Adventure", icon: "✈️", slug: "adventure" },
      { name: "Just Because", icon: "💌", slug: "just-because" },
    ]);
  }, []);

  // =========================
  // 2) SUBCATEGORÍAS (JSON)
  // =========================
  useEffect(() => {
    (async () => {
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
                slug: sub.slug, // slug de la subcategoría (ruta: /subcategory/[slug])
              });
            });
        });

        setSubcategories(flat);
      } catch (e) {
        console.error("Error loading subcategories.json", e);
      }
    })();
  }, []);

  // =========================
  // 3) TARJETAS (videos/index.json)
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        // normaliza cada item y guarda lo necesario para buscar y rutear
        const items = data.map((v) => {
          const catSlug =
            (v.categories || [])
              .map((c) => norm(c).replace(/\s+/g, "-"))
              .find(Boolean) || "";
          return {
            name: v.name,          // para /edit/[name]
            object: v.object || "", // título legible
            tags: (v.tags || []).join(" "),
            category: v.category || "",
            subcategory: v.subcategory || "",
            categorySlug: catSlug,
            subSlug: v.subcategory
              ? norm(v.subcategory).replace(/\s+/g, "-")
              : (v.category ? norm(v.category).replace(/\s+/g, "-") : ""),
          };
        });
        setVideoIndex(items);
      } catch (e) {
        console.error("Error loading videos/index.json", e);
      }
    })();
  }, []);

  // =========================
  // BÚSQUEDA COMBINADA
  // =========================
  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];

    // 1) Coincidencias en categorías
    const cat = categories
      .filter((c) => norm(c.name).includes(q) || norm(c.slug).includes(q))
      .map((c) => ({
        key: `cat:${c.slug}`,
        title: c.name,
        icon: c.icon,
        href: `/category/${c.slug}`,
        kind: "category",
      }));

    // 2) Coincidencias en subcategorías (en EN/ES)
    const subs = subcategories
      .filter(
        (s) =>
          norm(s.name_en).includes(q) ||
          norm(s.name_es).includes(q) ||
          norm(s.slug).includes(q)
      )
      .map((s) => ({
        key: `sub:${s.slug}`,
        title: s.name_en,
        icon: "🌸",
        href: `/subcategory/${s.slug}`,
        kind: "subcategory",
      }));

    // 3) Coincidencias en tarjetas (object, name, tags, category/subcategory)
    const vids = videoIndex
      .filter(
        (v) =>
          norm(v.object).includes(q) ||
          norm(v.name).includes(q) ||
          norm(v.tags).includes(q) ||
          norm(v.category).includes(q) ||
          norm(v.subcategory).includes(q)
      )
      .map((v) => ({
        key: `vid:${v.name}`,
        title: v.object || v.name,
        icon: "🎬",
        href: `/edit/${v.name}`,
        kind: "card",
        hint: v.subcategory || v.category || "",
      }));

    // Quita duplicados por href y devuelve
    const map = new Map();
    [...cat, ...subs, ...vids].forEach((r) => {
      if (!map.has(r.href)) map.set(r.href, r);
    });
    return [...map.values()];
  }, [query, categories, subcategories, videoIndex]);

  // =========================
  // UI (sin tocar tu diseño)
  // =========================
  const go = (href) => router.push(href);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Categories</h2>

      {/* 🔎 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search any theme — e.g. yeti, turtle, love"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-8 text-gray-700 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-center shadow-sm"
      />

      {/* 🎠 Carrusel cuando NO hay búsqueda */}
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
                  onClick={() => go(`/category/${cat.slug}`)}
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

      {/* 🔎 Resultados (categoría / subcategoría / tarjeta) */}
      {query && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
          {results.length === 0 ? (
            <p className="text-gray-400 mt-4">No matches found 🌱</p>
          ) : (
            results.map((r) => (
              <motion.button
                key={r.key}
                onClick={() => go(r.href)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-pink-100 shadow-sm hover:shadow-md rounded-3xl px-6 py-4 text-gray-700 font-semibold text-center w-[150px] h-[150px] flex flex-col justify-center items-center hover:border-pink-300"
                title={r.kind === "card" && r.hint ? `Card · ${r.hint}` : ""}
              >
                <span className="text-3xl mb-2">{r.icon}</span>
                <span className="text-sm text-center line-clamp-2">{r.title}</span>
                {r.kind === "card" && r.hint && (
                  <span className="mt-1 text-[11px] text-gray-400">{r.hint}</span>
                )}
              </motion.button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
