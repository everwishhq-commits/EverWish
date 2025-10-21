"use client";
export default function Categories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-10">
      {["Love", "Birthday", "Holiday", "Family", "Thank You", "Pets"].map(
        (cat) => (
          <div
            key={cat}
            className="rounded-xl border border-gray-200 bg-pink-50 py-4 px-3 text-center text-sm font-medium text-pink-600"
          >
            {cat}
          </div>
        )
      )}
    </div>
  );
}
