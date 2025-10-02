"use client";

const categories = [
  { name: "Birthday", color: "bg-pink-200", emoji: "🎂" },
  { name: "Congrats", color: "bg-yellow-200", emoji: "⭐" },
  { name: "Baby", color: "bg-blue-200", emoji: "👶" },
  { name: "Love", color: "bg-red-200", emoji: "❤️" },
  { name: "Graduation", color: "bg-green-200", emoji: "🎓" },
  { name: "Gifts", color: "bg-purple-200", emoji: "🎁" },
];

export default function Categories() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-md text-3xl`}
            >
              {cat.emoji}
            </div>
            <p className="mt-2 text-sm font-semibold">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
