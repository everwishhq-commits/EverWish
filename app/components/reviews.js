"use client";

const reviews = [
  {
    name: "John D.",
    text: "Everwish helped me send a beautiful card for my sister’s graduation. It was quick, easy, and meaningful.",
  },
  {
    name: "Sophia L.",
    text: "I love how simple it is to customize and share. My friend was so happy with her birthday surprise!",
  },
  {
    name: "Michael R.",
    text: "A creative way to celebrate important moments. Definitely using it again!",
  },
];

export default function Reviews() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">What people are saying</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="text-gray-700 italic">"{rev.text}"</p>
            <p className="mt-4 font-semibold text-gray-900">- {rev.name}</p>
          </div>
        ))}
      </div>
      <button className="mt-8 px-6 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition">
        See all reviews
      </button>
    </div>
  );
}
