"use client";
import { Cake, Star, Baby, Heart, GraduationCap, Gift } from "lucide-react";

const categories = [
  { name: "Cumpleaños", color: "bg-pink-100", icon: <Cake size={28} className="text-pink-500" /> },
  { name: "Felicidades", color: "bg-yellow-100", icon: <Star size={28} className="text-yellow-500" /> },
  { name: "Bebé", color: "bg-blue-100", icon: <Baby size={28} className="text-blue-500" /> },
  { name: "Amor", color: "bg-red-100", icon: <Heart size={28} className="text-red-500" /> },
  { name: "Graduación", color: "bg-green-100", icon: <GraduationCap size={28} className="text-green-500" /> },
  { name: "Regalos", color: "bg-purple-100", icon: <Gift size={28} className="text-purple-500" /> },
];

export default function Categories() {
  return (
    <section className="text-center py-10">
      <h2 className="text-2xl font-extrabold mb-8 text-gray-800">Categorías</h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col items-center transition-transform hover:scale-110"
          >
            <div
              className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-lg border border-gray-200`}
            >
              {cat.icon}
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
