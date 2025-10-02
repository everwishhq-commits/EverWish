"use client";
import { Star, Heart, Baby, Cake } from "lucide-react";

export default function Categories() {
  const items = [
    { label: "Cumpleaños", icon: <Cake className="w-6 h-6 text-pink-500" /> },
    { label: "Felicidades", icon: <Star className="w-6 h-6 text-yellow-500" /> },
    { label: "Bebé", icon: <Baby className="w-6 h-6 text-sky-500" /> },
    { label: "Amor", icon: <Heart className="w-6 h-6 text-red-500" /> },
  ];

  return (
    <div className="flex justify-center gap-6 mt-8 flex-wrap">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-white shadow-md rounded-full p-4 w-20 h-20 justify-center"
        >
          {item.icon}
          <span className="text-xs font-semibold mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
