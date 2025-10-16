"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Sub-animaciones por categoría */
const animationCategories = {
  easter: { default: ["🌷"], options: { "Flowers 🌸": ["🌷","🌼","🌸"], "Bunnies 🐰": ["🐰"], /* … etc */ } },
  halloween: { default: ["🎃"], options: { "Pumpkins 🎃": ["🎃"], "Ghosts 👻": ["👻"], /* … */ } },
  july4: { default: ["🎆"], options: { "Fireworks 🎆": ["🎆"], "Flags 🇺🇸": ["🇺🇸"], /* … */ } },
  animals: { default: ["🐾"], options: { "Paws 🐾": ["🐾"], "Dogs 🐶": ["🐶"], /* … */ } },
  love: { default: ["💖"], options: { "Hearts ❤️": ["❤️"], "Kisses 💋": ["💋"], /* … */ } },
  default: { default: ["✨"], options: { "Stars ✨": ["✨"], "Moons 🌙": ["🌙"], /* … */ } },
};

/* 🔹 Mapea slug → categoría */
export function getAnimationsForSlug(slug) {
  const s = slug.toLowerCase();
  if (s.includes("easter")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("animal") || s.includes("pet")) return "animals";
  if (s.includes("love") || s.includes("heart")) return "love";
  return "default";
}

/* 🌟 Capa de partículas */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  const category = getAnimationsForSlug(slug);
  const categoryData = animationCategories[category];
  const activeSet =
    categoryData.options[animation] ||
    categoryData.default ||
    animationCategories.default.default;

  useEffect(() => {
    const total = 18;
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 22 + 16}px`,
      delay: Math.random() * 2,   // menos delay inicial
      duration: Math.random() * 10 + 18,  // 18-28 segundos de subida
      opacity: Math.random() * 0.4 + 0.4,
    }));
    setItems(newItems);
    // Forzar remount instantáneo
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
        transition={{ duration: 0.2 }}  // entrada rápida
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: "110vh", opacity: 0, scale: 0.8 }}
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

/* 🔻 Para poblar el dropdown dinámicamente */
export function getAnimationOptionsForSlug(slug) {
  const cat = getAnimationsForSlug(slug);
  const catData = animationCategories[cat];
  return Object.keys(catData.options);
}
