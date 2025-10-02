"use client";

const categories = [
  { name: "Cumpleaños", color: "bg-pink-100", emoji: "🎂" },
  { name: "Felicidades", color: "bg-yellow-100", emoji: "⭐" },
  { name: "Bebé",        color: "bg-blue-100",  emoji: "👶" },
  { name: "Amor",        color: "bg-red-100",   emoji: "❤️" },
  { name: "Graduación",  color: "bg-green-100", emoji: "🎓" },
  { name: "Regalos",     color: "bg-purple-100",emoji: "🎁" },
];

export default function Categories() {
  return (
    <section aria-labelledby="cats-title">
      <h2 id="cats-title" className="text-2xl font-bold text-center mb-8">Categorías</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-lg border border-white text-3xl`}>
              {cat.emoji}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
