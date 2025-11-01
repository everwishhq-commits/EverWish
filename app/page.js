"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Cargar las tarjetas desde el API
  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/cardsdata");
        if (!res.ok) throw new Error("No se pudo cargar cardsdata");

        const data = await res.json();

        // Validar respuesta
        if (!data || !Array.isArray(data.videos)) {
          console.warn("⚠️ Respuesta inesperada:", data);
          setCards([]);
        } else {
          setCards(data.videos);
        }
      } catch (err) {
        console.error("❌ Error cargando tarjetas:", err);
        setError("No se pudieron cargar las tarjetas 😢");
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  // 💬 Mensajes de estado
  if (loading) return <p className="text-center mt-10">Cargando tarjetas...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Everwish Cards
      </h1>

      {cards && cards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-3 hover:scale-105 transition cursor-pointer"
            >
              <video
                src={card.src}
                controls
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="mt-2 font-semibold text-gray-800 text-sm">
                {card.slug}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No hay tarjetas disponibles 😅
        </p>
      )}
    </div>
  );
                  }
