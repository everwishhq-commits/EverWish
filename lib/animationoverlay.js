"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 🌈 AnimationOverlay – partículas flotantes elegantes
 */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);

  const total = 18; // cantidad equilibrada
  const baseSpeed = 20; // velocidad lenta

  const randomDirection = () => {
    const dirs = [
      { x: 0, y: -100 },
      { x: 0, y: 100 },
      { x: -100, y: 0 },
      { x: 100, y: 0 },
      { x: 60, y: -80 },
      { x: -60, y: -80 },
      { x: 80, y: 60 },
      { x: -80, y: 60 },
    ];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  useEffect(() => {
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: getEmoji(animation, slug),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      dir: randomDirection(),
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setItems(newItems);
  }, [slug, animation]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[999]">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl select-none"
          style={{ left: item.left, top: item.top }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [item.opacity, 1, item.opacity],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.1, 0.9],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: baseSpeed + Math.random() * 8,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* 🧩 Emojis por tipo */
function getEmoji(animation, slug) {
  const sets = {
    halloween: ["🎃", "👻", "🕸️", "🦇", "🍬", "💀"],
    easter: ["🐰", "🥚", "🌷", "🐣", "🥕"],
    love: ["❤️", "💋", "🌹", "💞", "💖"],
    animals: ["🐾", "🐶", "🐱", "🐕", "🐈"],
    july4: ["🎆", "🇺🇸", "🦅", "⭐", "🎇"],
    christmas: ["🎄", "🎁", "❄️", "☃️", "⭐"],
    default: ["✨", "🌙", "💫", "🌈"],
  };

  if (slug.includes("halloween")) return randomOf(sets.halloween);
  if (slug.includes("easter")) return randomOf(sets.easter);
  if (slug.includes("love")) return randomOf(sets.love);
  if (slug.includes("animal")) return randomOf(sets.animals);
  if (slug.includes("july")) return randomOf(sets.july4);
  if (slug.includes("christmas")) return randomOf(sets.christmas);
  return randomOf(sets.default);
}

/* 🔸 Selección aleatoria */
function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
                                             }
