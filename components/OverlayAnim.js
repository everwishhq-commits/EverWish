"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAnimationsForSlug } from "@/lib/animations";

/**
 * 🌟 Overlayanim
 * Capa de partículas animadas (emojis o efectos visuales)
 * sobre las tarjetas o videos de Everwish.
 */
export default function Overlayanim({ slug = "", animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // 🔹 Obtener configuración de animación según slug
    const { emojis, direction, density, speed } =
      getAnimationsForSlug(slug, animation);

    // 🔹 Generar partículas aleatorias
    const newParticles = Array.from({ length: density }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: speed + Math.random() * 2,
      size: 14 + Math.random() * 18,
    }));

    setParticles(newParticles);
  }, [slug, animation]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[150] overflow-visible flex items-center justify-center"
      style={{ opacity: 0.9 }}
    >
      {particles.map((p) => (
        <Particle key={p.id} {...p} animationType={animation} />
      ))}
    </div>
  );
}

/* ✨ Subcomponente individual (una partícula animada) */
function Particle({ emoji, left, top, delay, duration, size, animationType }) {
  const lower = animationType.toLowerCase();

  // 🌀 Movimiento personalizado según tipo de animación
  let animate = {};
  if (lower.includes("confetti") || lower.includes("snow") || lower.includes("candy")) {
    animate = { y: [top - 20, top + 80], opacity: [0.9, 1, 0], rotate: [0, 360] };
  } else if (lower.includes("paw") || lower.includes("spark") || lower.includes("bloom")) {
    animate = { y: [top + 20, top - 80], opacity: [0, 1, 0.4], scale: [1, 1.2, 1] };
  } else if (lower.includes("ribbon") || lower.includes("stream")) {
    animate = { x: [left - 50, left + 50], opacity: [0.8, 1, 0], rotate: [0, -15, 15, 0] };
  } else if (lower.includes("firework") || lower.includes("burst")) {
    animate = { scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 360, 0] };
  } else {
    animate = { y: [top, top - 50], opacity: [0, 1, 0], scale: [1, 1.1, 1] };
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={animate}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        fontSize: `${size}px`,
        filter: "blur(0.2px)",
        pointerEvents: "none",
      }}
    >
      {emoji}
    </motion.div>
  );
}
