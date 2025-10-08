"use client";
import { useState, useEffect } from "react";
import { getAllCards } from "../utils/cardsmanager";

export default function Categories() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Cargar las tarjetas de categorías
  useEffect(() => {
    const data = getAllCards();
    setCards(data);
  }, []);

  // Carrusel automático
  useEffect(() => {
    if (autoScroll && cards.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % cards.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [cards, autoScroll]);

  // Categorías macro (visuales)
  const mainCategories = [
    { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200" },
    { name: "Birthdays", emoji: "🎂", color: "bg-pink-200" },
    { name: "Love & Romance", emoji: "💘", color: "bg-rose-200" },
    { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200" },
    { name: "Weddings & Anniversaries", emoji: "💍", color: "bg-indigo-200" },
    { name: "Emotions & Motivation", emoji: "💫", color: "bg-lime-200" },
    { name: "Sympathy & Support", emoji: "🕊️", color: "bg-gray-200" },
    { name: "Thank You & Appreciation", emoji: "🙏", color: "bg-violet-200" },
    { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200" },
    { name: "Gifts & Surprises", emoji: "🎁", color: "bg-purple-100" },
  ];

  return (
    <section className="mt-12 bg-white rounded-3xl shadow-lg py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>

      {/* Carrusel tipo Netflix */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${mainCategories.length * 100}%`,
          }}
          onMouseEnter={() => setAutoScroll(false)}
          onMouseLeave={() => setAutoScroll(true)}
        >
          {mainCategories.map((cat, i) => (
            <div
              key={i}
              className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex flex-col items-center justify-center p-6 ${cat.color} rounded-2xl shadow-md cursor-pointer hover:scale-105 transition`}
              onClick={() => window.location.href = `/categories/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
            >
              <span className="text-4xl mb-2">{cat.emoji}</span>
              <p className="font-semibold text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Indicadores inferiores */}
        <div className="flex justify-center mt-4 space-x-2">
          {mainCategories.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${i === index ? "bg-gray-800" : "bg-gray-300"}`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
                }
