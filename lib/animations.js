"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const categories = {
  default: {
    options: {
      "ninguna animación": [],
      "corazones ❤️": ["❤️"],
      "estrellas ✨": ["✨"],
      "flores 🌸": ["🌸"],
      "confeti 🎊": ["🎊"],
      "nubes ☁️": ["☁️"],
      "globos 🎈": ["🎈"],
    },
  },
};

export function getanimationoptionsforslug() {
  return Object.keys(categories.default.options);
}

export function animationoverlay({ animation }) {
  const [items, setitems] = useState([]);

  const activeset = useMemo(() => {
    const options = categories.default.options;
    return options[animation] || [];
  }, [animation]);

  useEffect(() => {
    if (!activeset.length) {
      setitems([]);
      return;
    }
    const total = 20;
    const next = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeset[Math.floor(Math.random() * activeset.length)],
      left: `${Math.random() * 100}%`,
      size: `${16 + Math.random() * 20}px`,
      delay: Math.random() * 0.2,
      duration: 12 + Math.random() * 8,
      opacity: 0.4 + Math.random() * 0.4,
    }));
    setitems(next);
  }, [activeset]);

  if (!items.length) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animation}
        className="fixed inset-0 pointer-events-none z-[500] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {items.map((it) => (
          <motion.div
            key={it.id}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: it.opacity,
              x: [0, 10, -10, 0],
              rotate: [0, 6, -6, 0],
            }}
            transition={{
              duration: it.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: it.delay,
            }}
            style={{
              position: "absolute",
              left: it.left,
              fontSize: it.size,
              userSelect: "none",
            }}
          >
            {it.emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
