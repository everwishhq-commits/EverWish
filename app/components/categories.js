"use client";

const categories = [
  { name: "Cumpleaños", color: "bg-pink-100", icon: "🎂" },
  { name: "Felicidades", color: "bg-yellow-100", icon: "⭐" },
  { name: "Bebé", color: "bg-blue-100", icon: "👶" },
  { name: "Amor", color: "bg-red-100", icon: "❤️" },
  { name: "Graduación", color: "bg-green-100", icon: "🎓" },
  { name: "Regalos", color: "bg-purple-100", icon: "🎁" },
];

export default function Categories() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-lg border border-gray-200 text-3xl`}
            >
              {cat.icon}
            </div>
            <p className="mt-2 text-sm font-semibold">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
