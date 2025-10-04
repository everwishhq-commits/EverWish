"use client";
import Image from "next/image";
import cards from "../data/cards.json"; // 👈 Importamos las tarjetas desde JSON

export default function Carousel() {
  return (
    <div className="relative mt-6">
      {/* Contenedor horizontal con scroll */}
      <div className="flex gap-6 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory">
        {cards.map((card, index) => (
          <div
            key={index}
            className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-between p-4 snap-center transition-transform hover:scale-105"
          >
            {/* Imagen */}
            <Image
              src={card.image}
              alt={card.title}
              width={220}
              height={300}
              className="rounded-xl object-cover"
            />

            {/* Texto */}
            <div className="mt-3 text-center">
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador dots (estático, opcional) */}
      <div className="flex justify-center gap-2 mt-2">
        {cards.map((_, idx) => (
          <span
            key={idx}
            className="w-2 h-2 rounded-full bg-gray-400 opacity-60"
          ></span>
        ))}
      </div>
    </div>
  );
}
