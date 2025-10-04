"use client";

const categories = [
  { name: "Birthday", icon: "🎂", color: "bg-yellow-200" },
  { name: "Baby", icon: "👶", color: "bg-blue-200" },
  { name: "Love", icon: "❤️", color: "bg-pink-200" },
  { name: "Graduation", icon: "🎓", color: "bg-green-200" },
  { name: "Condolences", icon: "🕊️", color: "bg-gray-200" },
  { name: "Gifts", icon: "🎁", color: "bg-orange-200" },
  { name: "Thank You", icon: "🙏", color: "bg-purple-200" },
];

export default function Categories() {
  return (
    <div className="bg-white rounded-t-3xl shadow-lg py-10 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Categories
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-20 h-20 md:w-24 md:h-24 ${cat.color} rounded-full flex items-center justify-center shadow-md`}
            >
              <span className="text-3xl md:text-4xl">{cat.icon}</span>
            </div>
            <p className="mt-3 text-sm md:text-base font-semibold text-gray-700">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
