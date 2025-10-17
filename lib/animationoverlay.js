"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 🎨 AnimationOverlay — sincronizada con el editor principal
 * Aplica partículas (emojis o íconos) con movimiento armónico, direcciones variables
 * y sincronización instantánea al cambiar animación.
 */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const particleCount = 14; // cantidad equilibrada (ni muchas ni pocas)

  // velocidad base (en segundos)
  const baseSpeed = 25;

  // direcciones aleatorias de movimiento
  const randomDirection = () => {
    const dirs = [
      { x: 0, y: -120 }, // arriba
      { x: 0, y: 120 }, // abajo
      { x: -100, y: 0 }, // izquierda
      { x: 100, y: 0 }, // derecha
      { x: 80, y: -80 }, // diagonal derecha arriba
      { x: -80, y: -80 }, // diagonal izquierda arriba
      { x: 80, y: 80 }, // diagonal derecha abajo
      { x: -80, y: 80 }, // diagonal izquierda abajo
    ];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  // conjuntos de emojis por animación
  const animationSets = {
    animals: ["🐾", "🐶", "🐱", "🦴", "🐾", "🐕", "🐈", "🦴", "🐾"],
    easter: ["🥚", "🐇", "🌸", "🌷", "🐰", "🌼", "🐣", "🥕", "🌻"],
    halloween: ["🎃", "👻", "🍬", "🕸️", "🦇", "🕷️", "💀", "🕯️"],
    july4: ["🎆", "🦅", "🇺🇸", "⭐", "🎉", "🎇", "🎊", "🗽"],
    christmas: ["🎄", "🎁", "✨", "☃️", "❄️", "🎀", "🦌"],
    love: ["❤️", "💖", "💞", "💘", "💋", "🌹", "💗", "💕"],
    birthday: ["🎈", "🎉", "🎂", "🎁", "🎊", "🧁", "🍰"],
    spring: ["🌸", "🌼", "🌷", "🌹", "🌻", "🌺", "🌿", "🍃"],
    newyear: ["🎆", "🍾", "🥂", "🎉", "✨", "⭐", "🎇"],
    valentines: ["💘", "💞", "💌", "❤️", "💖", "🌹", "💗", "💕"],
  };

  const chosenSet = animationSets[animation] || animationSets["spring"];

  /* ⚡ Regenera partículas al cambiar animación o tarjeta */
  useEffect(() => {
    const newItems = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      emoji: chosenSet[i % chosenSet.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.8, // casi inmediato
      dir: randomDirection(),
    }));
    setItems(newItems);
  }, [slug, animation]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[150]">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-3xl select-none opacity-70"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 1, 0.3],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: baseSpeed + Math.random() * 8, // lento y fluido (25–33s)
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
