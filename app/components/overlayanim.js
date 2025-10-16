"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAnimationSet } from "@/lib/animations";

export default function Overlayanim({ slug = "", animation = "" }) {
  const [particles, setParticles] = useState([]);
  const { emojis, direction, density, speed } = getAnimationSet(slug, animation);

  useEffect(() => {
    const newParticles = Array.from({ length: density }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 14 + Math.random() * 14,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      duration: speed + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, [slug, animation]);

  const yMove = direction === "up" ? -70 : direction === "down" ? 70 : 0;
  const xMove = direction === "left" ? -60 : direction === "right" ? 60 : 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-[150]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0.8, 1, 0],
            x: [0, xMove],
            y: [0, yMove],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            filter: "blur(0.4px)",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
