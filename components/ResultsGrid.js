"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ResultsGrid({ cards = [], onSelect }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No cards found 💭 Try another search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-6 px-2 sm:px-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.slug || i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          onClick={() => onSelect?.(card)}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-pink-50 
                     overflow-hidden cursor-pointer transition-all duration-200"
        >
          {/* 📸 Imagen */}
          <div className="relative w-full aspect-[4/3] bg-pink-50">
            <Image
              src={card.image || `/cards/${card.filename || "default"}.jpg`}
              alt={card.name || card.object || "Everwish Card"}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={i < 6}
            />
          </div>

          {/* 📝 Texto */}
          <div className="p-3 text-center">
            <p className="font-semibold text-gray-800 text-sm truncate">
              {card.name ||
                card.value ||
                card.object?.replace(/-/g, " ") ||
                "Untitled"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {card.category1 || card.category2 || "General"}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
