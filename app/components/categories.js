"use client";

export default function Categories() {
  const categories = [
    "Love & Romance",
    "Birthdays",
    "Holidays",
    "Family & Friends",
    "Thank You",
    "Pets",
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-10">
      {categories.map((cat) => (
        <div
          key={cat}
          className="rounded-xl border border-gray-200 bg-pink-50 py-4 px-3 text-center text-sm font-medium text-pink-600 hover:bg-pink-100 transition"
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
