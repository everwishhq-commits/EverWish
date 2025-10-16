"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🧩 Mapa de animaciones por nombre */
const animationSets = {
  pumpkins: ["🎃", "👻", "🕸️", "🍬"],
  ghosts: ["👻", "💀", "🕯️", "🦇"],
  skulls: ["💀", "🕸️", "🦴", "👻"],
  candies: ["🍬", "🍭", "🍫", "🧁"],
  animals: ["🐶", "🐱", "🐾", "🐕", "🐩"],
  easter: ["🐰", "🥚", "🌷", "🐣", "🌼"],
  july4: ["🎆", "🇺🇸", "⭐", "🦅"],
  hearts: ["❤️", "💋", "💕", "💖"],
  stars: ["⭐", "🌟", "✨"],
  moons: ["🌙", "⭐", "🪄"],
};

/* 🔹 Determina las animaciones según el slug */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();

  if (slug.includes("halloween") || slug.includes("ghost"))
    return ["pumpkins", "candies", "ghosts", "skulls"];
  if (slug.includes("easter")) return ["easter"];
  if (slug.includes("july")) return ["july4"];
  if (slug.includes("love") || slug.includes("heart")) return ["hearts"];
  if (slug.includes("animal") || slug.includes("pet")) return ["animals"];
  return ["stars", "moons"];
}

/* 🌟 Renderiza partículas flotantes */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  /* 🔁 Genera las partículas al cambiar animación */
  useEffect(() => {
    const symbols = animationSets[animation] || animationSets.stars;
    const total = 22; // cantidad de elementos
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: symbols[Math.floor(Math.random() * symbols.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 18}px`,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 6, // 6–10s, natural
      opacity: Math.random() * 0.6 + 0.3,
    }));
    setItems(newItems);
    setKey((k) => k + 1); // fuerza reinicio suave
  }, [animation, slug]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 pointer-events-none z-[500] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              y: "110vh",
              opacity: 0,
              scale: 0.8,
              rotate: 0,
            }}
            animate={{
              y: "-10vh",
              opacity: item.opacity,
              scale: 1,
              rotate: Math.random() * 40 - 20,
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
              zIndex: 999,
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
