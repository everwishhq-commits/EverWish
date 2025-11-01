"use client";

export default function ResultsGrid({ cards }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-3 hover:scale-105 transition cursor-pointer"
        >
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          <p className="mt-2 font-semibold text-gray-800 text-sm">
            {card.name}
          </p>
          <p className="text-xs text-gray-500">{card.category}</p>
        </div>
      ))}
    </div>
  );
}
