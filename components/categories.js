"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const router = useRouter();

  // 🎠 CATEGORÍAS PRINCIPALES (carrusel)
  useEffect(() => {
    setCategories([
      { name: "Love & Romance", icon: "💖", slug: "love-romance", color: "#FFE4EC" },
      { name: "Family & Relationships", icon: "👨‍👩‍👧", slug: "family-relationships", color: "#E7E7FF" },
      { name: "Babies & Parenting", icon: "👶", slug: "babies-parenting", color: "#FFF1D6" },
      { name: "Friendship", icon: "🤝", slug: "friendship", color: "#E7FFF5" },
      { name: "Birthdays", icon: "🎂", slug: "birthdays", color: "#FFF3E0" },
      { name: "Celebrations", icon: "🎉", slug: "celebrations", color: "#FFEFEF" },
      { name: "Encouragement", icon: "🌈", slug: "encouragement", color: "#F0FFF0" },
      { name: "Pets & Animal Lovers", icon: "🐾", slug: "pets-animal-lovers", color: "#E8F9FF" },
      { name: "Work & Success", icon: "💼", slug: "work-success", color: "#F9EFFF" },
      { name: "Get Well Soon", icon: "💐", slug: "get-well-soon", color: "#FFF0F5" },
      { name: "Thank You", icon: "🙏", slug: "thank-you", color: "#FFF9E3" },
      { name: "Anniversaries", icon: "💍", slug: "anniversaries", color: "#E3FFE9" },
      { name: "Weddings", icon: "👰", slug: "weddings", color: "#FFF0E8" },
      { name: "New Baby", icon: "🍼", slug: "new-baby", color: "#E8FBFF" },
      { name: "Holidays", icon: "🎄", slug: "holidays", color: "#FFF5E6" },
      { name: "Halloween", icon: "🎃", slug: "halloween", color: "#FFECD1" },
      { name: "Christmas", icon: "🎁", slug: "christmas", color: "#E7F9E7" },
      { name: "Easter", icon: "🐰", slug: "easter", color: "#FFF0F5" },
      { name: "New Year", icon: "🎆", slug: "new-year", color: "#EAF4FF" },
      { name: "Valentine’s Day", icon: "💌", slug: "valentines-day", color: "#FFE4E9" },
      { name: "Mother’s Day", icon: "🌸", slug: "mothers-day", color: "#FFF6F9" },
      { name: "Father’s Day", icon: "🧢", slug: "fathers-day", color: "#E6F3FF" },
      { name: "Graduation", icon: "🎓", slug: "graduation", color: "#F0FFF0" },
      { name: "Thanksgiving", icon: "🦃", slug: "thanksgiving", color: "#FFF8E3" },
      { name: "Condolences", icon: "🕊️", slug: "condolences", color: "#F9FAFB" },
      { name: "Motivation", icon: "🔥", slug: "motivation", color: "#FFF1F0" },
      { name: "Seasonal", icon: "🌤️", slug: "seasonal", color: "#E8F7FF" },
      { name: "Sports & Team Spirit", icon: "⚽", slug: "sports-team", color: "#F5FFF1" },
      { name: "Congratulations", icon: "🏆", slug: "congratulations", color: "#FFFDEB" },
      { name: "Travel & Adventure", icon: "✈️", slug: "travel-adventure", color: "#E8F7FF" },
    ]);
  }, []);

  // 🔍 FILTRO PRINCIPAL — busca en index.json y devuelve categoría
  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setFiltered([]);
        return;
      }

      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        const q = query.toLowerCase();

        // busca coincidencias por nombre o subcategoría
        const matches = data.filter(
          (item) =>
            item.name?.toLowerCase().includes(q) ||
            item.object?.toLowerCase().includes(q) ||
            item.subcategory?.toLowerCase().includes(q)
        );

        if (matches.length > 0) {
          const catSlug = matches[0].category?.toLowerCase().replace(/\s+/g, "-");
          const found = categories.find(
            (c) => c.slug.toLowerCase() === catSlug || c.name.toLowerCase() === matches[0].category?.toLowerCase()
          );
          setFiltered(found ? [found] : []);
        } else {
          setFiltered([]);
        }
      } catch (err) {
        console.error("❌ Error searching index.json:", err);
      }
    }

    search();
  }, [query, categories]);

  const handleClick = (slug) => router.push(`/category/${slug}`);

  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categories</h2>

      {/* 🔎 Barra de búsqueda */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any theme — e.g. yeti, turtle, love"
        className="w-80 max-w-full px-5 py-3 mb-6 border border-pink-100 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
      />

      {/* 🎨 Categorías filtradas o todas */}
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {(filtered.length > 0 ? filtered : categories).map((cat, i) => (
          <button
            key={i}
            onClick={() => handleClick(cat.slug)}
            className="w-28 h-28 flex flex-col items-center justify-center rounded-full shadow-md border border-pink-100 hover:shadow-lg transition-all duration-200"
            style={{ backgroundColor: cat.color }}
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="text-sm font-medium text-gray-700 text-center px-2">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* 🌱 No results */}
      {filtered.length === 0 && query.trim() && (
        <p className="text-gray-400 mt-6">No matches found 🌱</p>
      )}
    </section>
  );
        }
