"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SubcategoryDetailPage() {
  const { slug } = useParams(); // Ejemplo: halloween
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json");
        const data = await res.json();

        const filtered = data.filter(
          (item) =>
            item.category.toLowerCase().replace(/\s+/g, "-").includes(slug) ||
            item.subcategory.toLowerCase().replace(/\s+/g, "-").includes(slug)
        );

        setCards(filtered);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
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
          Loading {slug.replace("-", " ")} cards...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      <button
        onClick={() => router.back()}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Discover beautiful Everwish cards for this celebration ✨
      </p>

      {cards.length === 0 ? (
        <p className="text-gray-500 text-center">No cards found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl w-full">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/edit/${card.name}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
            >
              <video
                src={card.file}
                className="object-cover w-full aspect-[4/5]"
                playsInline
                muted
                loop
              />
              <div className="text-center py-3 text-gray-700 font-medium text-sm">
                {card.object}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
          }
