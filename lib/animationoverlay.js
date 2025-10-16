"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 🎨 AnimationOverlay
 * Aplica partículas animadas con direcciones variadas y movimientos suaves.
 * Las animaciones cambian su punto de partida y dirección para evitar uniformidad.
 */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);

  // cantidad y velocidad controladas
  const particleCount = 18; // ni pocas ni saturadas
  const baseSpeed = 12; // segundos por ciclo

  // generador aleatorio de dirección (arriba, abajo, izquierda, derecha o diagonal)
  const randomDirection = () => {
    const directions = [
      { x: 0, y: -100 }, // arriba
      { x: 0, y: 100 }, // abajo
      { x: -100, y: 0 }, // izquierda
      { x: 100, y: 0 }, // derecha
      { x: 60, y: -80 }, // diagonal derecha arriba
      { x: -60, y: -80 }, // diagonal izquierda arriba
      { x: 80, y: 60 }, // diagonal derecha abajo
      { x: -80, y: 60 }, // diagonal izquierda abajo
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  useEffect(() => {
    const newItems = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      dir: randomDirection(),
    }));
    setItems(newItems);
  }, [slug, animation]);

  // Definir emojis por tipo de animación
  const animationSets = {
    animals: ["🐾", "🐶", "🐱", "🐾", "🦴", "🐾", "🐕", "🐈", "🦴", "🐾"],
    easter: ["🥚", "🐇", "🌸", "🌷", "🐰", "🌼", "🐣", "🥕", "🌻", "🌺"],
    halloween: ["🎃", "👻", "🍬", "🕸️", "🦇", "🕷️", "🍭", "💀", "🕯️", "👺"],
    july4: ["🎆", "🎇", "🦅", "🇺🇸", "⭐", "🧨", "🎉", "🎊", "🎇", "🗽"],
    christmas: ["🎄", "🎁", "✨", "⭐", "☃️", "❄️", "🕯️", "🎀", "🦌", "🧣"],
    love: ["❤️", "💖", "💞", "💘", "💕", "💓", "💟", "💗", "💋", "🌹"],
    birthday: ["🎈", "🎉", "🎂", "🎁", "✨", "🎊", "🎀", "🧁", "🍰", "🎇"],
    spring: ["🌸", "🌼", "🌷", "🌹", "🌻", "🌺", "🌿", "🌾", "🍃", "☘️"],
    newyear: ["🎆", "🎇", "🍾", "🥂", "🎉", "✨", "🎊", "⭐", "🎇", "🕛"],
    valentines: ["💘", "💞", "💌", "❤️", "💖", "💋", "🌹", "💗", "💕", "💘"],
  };

  const chosenSet = animationSets[animation] || animationSets["spring"];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[150]">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl select-none opacity-70"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 1, 0.2],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: baseSpeed + Math.random() * 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {chosenSet[item.id % chosenSet.length]}
        </motion.span>
      ))}
    </div>
  );
}
