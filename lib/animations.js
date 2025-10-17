"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ===========================================================
   🎨 AnimationOverlay – sincronizada con el editor y rápida al cambiar
   =========================================================== */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  // Cantidad moderada
  const particleCount = 14;
  const baseSpeed = 22; // segundos por ciclo

  // Direcciones de movimiento variadas
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

  // Emojis por categoría
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
    default: ["✨", "⭐", "🌙", "☁️", "🌈"],
  };

  const chosenSet = animationSets[animation] || animationSets.default;

  /* 🟢 Inicialización inmediata y cambio instantáneo */
  useEffect(() => {
    const newItems = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      emoji: chosenSet[i % chosenSet.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      dir: randomDirection(),
      delay: Math.random() * 0.3, // aparece casi de inmediato
    }));
    setItems(newItems);
    setKey((k) => k + 1); // fuerza re-render al cambiar
  }, [slug, animation]);

  return (
    <motion.div
      key={key}
      className="fixed inset-0 pointer-events-none overflow-hidden z-[150]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-3xl select-none opacity-80"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: baseSpeed + Math.random() * 6, // lento y fluido
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ===========================================================
   🔻 Detecta categoría según el slug (nombre del video)
   =========================================================== */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();
  if (slug.includes("easter")) return "easter";
  if (slug.includes("halloween") || slug.includes("ghost")) return "halloween";
  if (slug.includes("july") || slug.includes("4th")) return "july4";
  if (slug.includes("animal") || slug.includes("pet")) return "animals";
  if (slug.includes("love") || slug.includes("heart")) return "love";
  if (slug.includes("birthday")) return "birthday";
  if (slug.includes("christmas")) return "christmas";
  if (slug.includes("newyear")) return "newyear";
  if (slug.includes("valentine")) return "valentines";
  return "default";
}

/* ===========================================================
   🔻 Devuelve las 10 opciones del dropdown según categoría
   =========================================================== */
export function getAnimationOptionsForSlug(slug) {
  const category = getAnimationsForSlug(slug);
  const options = {
    easter: [
      "Flowers 🌸", "Bunnies 🐰", "Eggs 🥚", "Chicks 🐣", "Butterflies 🦋",
      "Grass 🌿", "Sun ☀️", "Clouds ☁️", "Carrots 🥕", "Basket 🧺"
    ],
    halloween: [
      "Pumpkins 🎃", "Ghosts 👻", "Candies 🍬", "Bats 🦇", "Skulls 💀",
      "Spiders 🕷️", "Webs 🕸️", "Bones 🦴", "Lanterns 🪔", "Moons 🌙"
    ],
    july4: [
      "Fireworks 🎆", "Flags 🇺🇸", "Stars ⭐", "Eagles 🦅", "Hearts ❤️",
      "Balloons 🎈", "Sparkles ✨", "Lights 💡", "Parade 🎉", "Confetti 🎊"
    ],
    animals: [
      "Paws 🐾", "Dogs 🐶", "Cats 🐱", "Bones 🦴", "Balls 🎾",
      "Fish 🐟", "Birds 🐦", "Hearts ❤️", "Bowls 🥣", "Stars ✨"
    ],
    love: [
      "Hearts ❤️", "Kisses 💋", "Roses 🌹", "Rings 💍", "Cupid 🏹",
      "Stars ✨", "Balloons 🎈", "Gifts 🎁", "Doves 🕊️", "Music 🎶"
    ],
    default: [
      "Stars ✨", "Moons 🌙", "Clouds ☁️", "Lights 💡", "Dreams 🌈",
    ],
  };
  return options[category] || options.default;
}
