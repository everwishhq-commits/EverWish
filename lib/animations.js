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
    if (!active || !category) return;
    setItems(animationSets[category.toLowerCase()] || []);
  }, [category, active]);

  if (!active || !items.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
      {items.map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ y: "120%", opacity: 0 }}
          animate={{
            y: "-20%",
            opacity: [0.2, 1, 0],
            x: ["0%", `${Math.random() * 100 - 50}%`],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
          className="absolute text-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-5%",
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
            }
