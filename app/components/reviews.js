"use client";

const reviews = [
  { text: "Everwish made my day truly special!", author: "Sophia R." },
  { text: "Such a simple way to send love instantly.", author: "Michael T." },
  { text: "Beautiful cards and smooth experience.", author: "Emma L." },
];

export default function Reviews() {
  return (
    <div className="bg-pink-50 rounded-3xl py-12 px-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6">What people say</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 text-sm text-gray-700"
          >
            <p className="italic">"{review.text}"</p>
            <p className="mt-2 font-semibold text-gray-900">- {review.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
