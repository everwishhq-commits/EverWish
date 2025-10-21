"use client";
export default function Categories() {
  const categories = [
    "Love & Romance",
    "Birthdays",
    "Seasonal & Holidays",
    "Family & Relationships",
  ];
  return (
    <div className="grid grid-cols-2 gap-4 text-center text-gray-700">
      {categories.map((c) => (
        <div key={c} className="p-4 border rounded-lg bg-gray-50">
          {c}
        </div>
      ))}
    </div>
  );
}
