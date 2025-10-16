"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Conjuntos de emojis / animaciones */
const animationSets = {
  easter: ["🐰", "🥚", "🌷", "🐣", "🌼", "🌸"],
  halloween: ["🎃", "👻", "🍬", "🦇", "💀", "🕸️"],
  july4: ["🎆", "🇺🇸", "🦅", "⭐", "🎇"],
  animals: ["🐶", "🐱", "🐾", "🦴", "🎾"],
  love: ["💖", "💋", "❤️", "💞", "✨"],
  default: ["🌙", "⭐", "🌟", "✨"],
};

/* 🧩 Devuelve las animaciones según la tarjeta */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();

  if (slug.includes("easter")) return ["easter"];
  if (slug.includes("halloween") || slug.includes("ghost")) return ["halloween"];
  if (slug.includes("july") || slug.includes("4th")) return ["july4"];
  if (slug.includes("animal") || slug.includes("pet")) return ["animals"];
  if (slug.includes("love") || slug.includes("heart")) return ["love"];
  return ["default"];
}

/* ✨ Capa de animación */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const activeSet =
      animationSets[animation] ||
      animationSets[getAnimationsForSlug(slug)[0]] ||
      animationSets.default;

    const total = 22;
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 22 + 18}px`,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 6,
      opacity: Math.random() * 0.5 + 0.4,
    }));
    setItems(newItems);
    setKey((k) => k + 1);
  }, [slug, animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              y: "110vh",
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: "-10vh",
              opacity: item.opacity,
              scale: 1,
              rotate: Math.random() * 30 - 15,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: item.left,
              fontSize: item.size,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
    }
