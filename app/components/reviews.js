"use client";

const reviews = [
  { name: "Laura", text: "Hermosas tarjetas, todo súper rápido ✨", rating: 5 },
  { name: "Carlos", text: "El diseño está increíble. Muy recomendado.", rating: 5 },
  { name: "Ana", text: "Fácil de usar y entregas perfectas 🎁", rating: 5 },
];

export default function Reviews() {
  return (
    <section aria-labelledby="rev-title" className="mt-12">
      <h2 id="rev-title" className="text-2xl font-bold text-center mb-6">Reseñas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <article key={i} className="rounded-2xl bg-white shadow-md p-5 ring-1 ring-black/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
            </div>
            <p className="text-gray-700">{r.text}</p>
            <p className="mt-3 text-sm font-semibold text-gray-500">— {r.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
