"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * 🌸 Everwish Results Grid v3
 * Muestra las tarjetas encontradas por el buscador o categorías.
 * Totalmente adaptable y visualmente limpio.
 */

export default function ResultsGrid({ cards = [] }) {
  if (!cards || cards.length === 0) {
    return (
      <p className="text-gray-500 italic text-center mt-6">
        No cards found. Try another keyword 💡
      </p>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 justify-items-center mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05, rotate: 0.5 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden w-[150px] sm:w-[180px] md:w-[200px] cursor-pointer group"
        >
          {/* 📸 Imagen */}
          <Link href={card.file || "#"}>
            <div className="relative w-full aspect-square bg-gray-50">
              {card.thumbnail ? (
                <Image
                  src={card.thumbnail}
                  alt={card.object || "Everwish Card"}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                  No image
                </div>
              )}
            </div>
          </Link>

          {/* 🏷️ Info */}
          <div className="p-3 text-center">
            <h3 className="font-semibold text-gray-800 text-sm truncate">
              {card.object || card.name || "Unnamed"}
            </h3>

            {card.category && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {card.category}
              </p>
            )}

            {/* 💖 Etiquetas opcionales */}
            {card.subcategory && (
              <p className="text-[11px] text-pink-500 mt-1 font-medium">
                {card.subcategory}
              </p>
            )}
          </div>

          {/* ✨ Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-pink-100/0 group-hover:bg-pink-100/40 transition-all"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />

          {/* 🌸 Iconito Everwish */}
          <div className="absolute bottom-2 right-2 text-[10px] text-pink-400 opacity-80 select-none">
            Everwish ✨
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
            }
