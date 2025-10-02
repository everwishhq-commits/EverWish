"use client";
import { Cake, Star, Baby, Heart, GraduationCap, Gift } from "lucide-react";

const categories = [
  { name: "Cumpleaños", color: "bg-pink-200", icon: <Cake size={32} /> },
  { name: "Felicidades", color: "bg-yellow-200", icon: <Star size={32} /> },
  { name: "Bebé", color: "bg-blue-200", icon: <Baby size={32} /> },
  { name: "Amor", color: "bg-red-200", icon: <Heart size={32} /> },
  { name: "Graduación", color: "bg-green-200", icon: <GraduationCap size={32} /> },
  { name: "Regalos", color: "bg-purple-200", icon: <Gift size={32} /> },
];

export default function Categories() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-md`}
            >
              {cat.icon}
            </div>
            <p className="mt-2 text-sm font-semibold">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
