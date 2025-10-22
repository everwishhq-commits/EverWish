"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SubcategoriesPage() {
  const { slug } = useParams(); // Ejemplo: seasonal-holidays
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json");
        const data = await res.json();

        // Buscar subcategorías únicas dentro de esta categoría principal
        const matched = data.filter((item) =>
          item.categories?.some((cat) =>
            cat.toLowerCase().replace(/\s+/g, "-").includes(slug)
          )
        );

        // Agrupar por subcategoría (ej: halloween, christmas, thanksgiving)
        const groups = Array.from(new Set(matched.map((i) => i.category))).filter(Boolean);
        setSubcategories(groups);
      } catch (err) {
        console.error("❌ Error cargando subcategorías:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-[#fff5f8]">
        <p className="animate-pulse text-lg">
          Loading {slug.replace("-", " ")} celebrations ✨
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Explore the celebrations and moments inside this category 🎉
      </p>

      {subcategories.length === 0 ? (
        <p className="text-gray-500 text-center">No subcategories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full">
          {subcategories.map((sub, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/subcategory/${sub.toLowerCase().replace(/\s+/g, "-")}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 hover:shadow-lg p-6 flex flex-col items-center justify-center"
            >
              <span className="text-5xl mb-2">
                {getEmojiForSubcategory(sub)}
              </span>
              <span className="text-gray-800 font-semibold capitalize text-center">
                {sub}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

// 🌸 Mapa de emojis sugeridos (puedes ampliarlo)
function getEmojiForSubcategory(name) {
  const map = {
    halloween: "🎃",
    christmas: "🎄",
    thanksgiving: "🦃",
    "4th of july": "🦅",
    easter: "🐰",
    newyear: "🎆",
  };
  const key = name?.toLowerCase() || "";
  return map[key] || "✨";
      }
