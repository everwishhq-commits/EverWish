"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * 🪶 ResultsGrid
 * Muestra las tarjetas (cards) encontradas en una búsqueda o categoría.
 */
export default function ResultsGrid({ cards = [] }) {
  const router = useRouter();

  if (!cards || cards.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8 text-sm">
        No cards found 💫
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 px-2 sm:px-0">
      {cards.map((card) => (
        <div
          key={card.slug || card.id}
          onClick={() => router.push(`/edit/${card.slug || card.id}`)}
          className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer group"
        >
          <div className="relative w-full h-32 rounded-xl overflow-hidden">
            <Image
              src={card.image || "/placeholder.png"}
              alt={card.name || "Everwish Card"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover rounded-xl group-hover:brightness-105 transition-all duration-300"
            />
          </div>

          <p className="mt-3 font-semibold text-gray-800 text-sm truncate">
            {card.name || "Untitled Card"}
          </p>

          <p className="text-xs text-gray-500">
            {card.category || "General"}
          </p>
        </div>
      ))}
    </div>
  );
}
