// /lib/animations.js
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const animationSets = {
  pumpkins: ["🎃", "🧡", "🍬"],
  ghosts: ["👻", "💜", "🕸️"],
  paws: ["🐾", "🐶", "🐱"],
  hearts: ["💖", "💞", "💘"],
};

export default function AnimatedOverlay({ category, active }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!active) return;
    const set = animationSets[category] || animationSets["pumpkins"];
    const total = 14;
    const list = Array.from({ length: total }, () => ({
      emoji: set[Math.floor(Math.random() * set.length)],
      left: `${Math.random() * 100}%`,
      size: `${16 + Math.random() * 20}px`,
      duration: 20 + Math.random() * 8,
      delay: Math.random() * 2,
    }));
    setItems(list);
  }, [category, active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[120]">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{
            y: "-10%",
            opacity: [0.2, 1, 0.4],
            rotate: [0, 10, -10, 0],
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
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export { AnimatedOverlay as AnimationOverlay };
