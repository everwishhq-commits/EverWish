"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** 🔎 Detecta la categoría por el slug */
export function getAnimationsForSlug(slug = "") {
  const s = String(slug).toLowerCase();
  if (s.includes("easter") || s.includes("bunny")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("usa") || s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("pet") || s.includes("animal")) return "animals";
  if (s.includes("valentine") || s.includes("love") || s.includes("heart")) return "love";
  if (s.includes("christmas") || s.includes("xmas")) return "christmas";
  if (s.includes("birthday")) return "birthday";
  return "default";
}

/** 🎨 10 opciones por categoría (texto del dropdown) */
const CATEGORY_OPTIONS = {
  easter: [
    "flowers", "bunnies", "eggs", "chicks", "butterflies",
    "grass", "sun", "clouds", "carrots", "basket",
  ],
  halloween: [
    "pumpkins", "ghosts", "candies", "bats", "skulls",
    "spiders", "webs", "bones", "lanterns", "moons",
  ],
  july4: [
    "fireworks", "flags", "stars", "eagles", "hearts",
    "balloons", "sparkles", "lights", "parade", "confetti",
  ],
  animals: [
    "paws", "dogs", "cats", "bones", "balls",
    "fish", "birds", "hearts", "bowls", "twinkles",
  ],
  love: [
    "hearts", "kisses", "roses", "rings", "cupid",
    "stars", "balloons", "gifts", "doves", "music",
  ],
  christmas: [
    "snowflakes", "gifts", "stars", "flakes", "lights",
    "sparkle", "hats", "snowmen", "candy", "magic",
  ],
  birthday: [
    "confetti", "candles", "balloons", "gifts", "sparkles",
    "glow", "cake", "flowers", "streamers", "hearts",
  ],
  default: [
    "sparkles", "petals", "confetti", "stars", "hearts",
    "glow", "lights", "shimmer", "ribbons", "twinkle",
  ],
};

/** 🧩 Mapa opción → set de emojis (uno solo por vez) */
const SETS = {
  // easter
  flowers: ["🌷","🌼","🌸"],
  bunnies: ["🐰"],
  eggs: ["🥚"],
  chicks: ["🐣"],
  butterflies: ["🦋"],
  grass: ["🌿"],
  sun: ["☀️"],
  clouds: ["☁️"],
  carrots: ["🥕"],
  basket: ["🧺"],
  // halloween
  pumpkins: ["🎃"],
  ghosts: ["👻"],
  candies: ["🍬"],
  bats: ["🦇"],
  skulls: ["💀"],
  spiders: ["🕷️"],
  webs: ["🕸️"],
  bones: ["🦴"],
  lanterns: ["🪔"],
  moons: ["🌙"],
  // july4
  fireworks: ["🎆"],
  flags: ["🇺🇸"],
  stars: ["⭐"],
  eagles: ["🦅"],
  hearts: ["❤️"],
  balloons: ["🎈"],
  sparkles: ["✨"],
  lights: ["💡"],
  parade: ["🎉"],
  confetti: ["🎊"],
  // animals
  paws: ["🐾"],
  dogs: ["🐶"],
  cats: ["🐱"],
  balls: ["🎾"],
  fish: ["🐟"],
  birds: ["🐦"],
  bowls: ["🥣"],
  twinkles: ["✨"],
  // love
  kisses: ["💋"],
  roses: ["🌹"],
  rings: ["💍"],
  cupid: ["🏹"],
  gifts: ["🎁"],
  doves: ["🕊️"],
  music: ["🎶"],
  // christmas
  snowflakes: ["❄️"],
  flakes: ["❄️"],
  hats: ["🎅"],
  snowmen: ["⛄"],
  candy: ["🍬"],
  magic: ["💫"],
  // birthday
  candles: ["🕯️"],
  glow: ["🌟"],
  cake: ["🎂"],
  flowers_bd: ["💐"], // por si alguien usa "flowers" dentro de birthday
  streamers: ["🎊"],
  // default
  petals: ["🌸"],
  ribbons: ["🎀"],
  shimmer: ["💫"],
  twinkle: ["🌟"],
};

/** 📋 Devuelve las 10 opciones para el dropdown según el slug */
export function getAnimationOptionsForSlug(slug = "") {
  const key = getAnimationsForSlug(slug);
  return CATEGORY_OPTIONS[key] || CATEGORY_OPTIONS.default;
}

/**
 * ✨ AnimationOverlay (única animación activa)
 * - Siempre encima de todo (z-[1000])
 * - Movimiento suave, pocas partículas
 * - Remonta al instante cuando cambia `animation`
 */
export function AnimationOverlay({ animation }) {
  const [items, setItems] = useState([]);
  const key = `overlay-${animation}`;

  // set de emojis activo (si no existe, usa sparkles)
  const active = SETS[animation] || ["✨"];

  useEffect(() => {
    // partículas moderadas y variadas
    const total = 16;
    const ns = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: active[i % active.length],
      left: Math.random() * 100,
      startY: 110 + Math.random() * 30, // inicia abajo
      endY: -10 - Math.random() * 20,   // termina arriba
      delay: Math.random() * 0.4,       // entra casi inmediato
      duration: 16 + Math.random() * 10, // lento: 16–26s
      rot: (Math.random() * 12) - 6,
      scale: 0.8 + Math.random() * 0.5,
      drift: (Math.random() * 30) - 15, // deriva lateral
      opacity: 0.45 + Math.random() * 0.35,
    }));
    setItems(ns);
  }, [animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 z-[1000] pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}  // 🌟 remount rápido
      >
        {items.map((p) => (
          <motion.span
            key={p.id}
            className="absolute select-none"
            style={{
              left: `${p.left}%`,
              top: `${p.startY}vh`,
              fontSize: `${16 + Math.random() * 20}px`,
              opacity: p.opacity,
            }}
            initial={{ y: 0, x: 0, scale: p.scale, rotate: 0, opacity: 0 }}
            animate={{
              y: `${p.endY - p.startY}vh`,
              x: [0, p.drift, 0],
              rotate: [0, p.rot, -p.rot, 0],
              opacity: [0, p.opacity, p.opacity * 0.9],
              scale: [p.scale, p.scale * 1.1, p.scale],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
