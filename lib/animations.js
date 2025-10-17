"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/* ===========================================================
   🔎 Detección de categoría por slug (sin cambiar nombres)
   =========================================================== */
export function getAnimationsForSlug(slug = "") {
  const s = String(slug).toLowerCase();
  if (s.includes("easter") || s.includes("bunny")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("animal") || s.includes("pet") || s.includes("dog") || s.includes("cat")) return "animals";
  if (s.includes("love") || s.includes("valentine") || s.includes("heart")) return "love";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("christmas") || s.includes("navidad")) return "christmas";
  if (s.includes("newyear") || s.includes("year")) return "newyear";
  return "default";
}

/* ===========================================================
   🔻 Opciones (10) por categoría para el dropdown (sin cambiar nombres)
   =========================================================== */
export function getAnimationOptionsForSlug(slug) {
  const cat = getAnimationsForSlug(slug);
  const OPTIONS = {
    easter: [
      "Flowers 🌸","Bunnies 🐰","Eggs 🥚","Chicks 🐣","Butterflies 🦋",
      "Grass 🌿","Sun ☀️","Clouds ☁️","Carrots 🥕","Basket 🧺",
    ],
    halloween: [
      "Pumpkins 🎃","Ghosts 👻","Candies 🍬","Bats 🦇","Skulls 💀",
      "Spiders 🕷️","Webs 🕸️","Bones 🦴","Lanterns 🪔","Moons 🌙",
    ],
    july4: [
      "Fireworks 🎆","Flags 🇺🇸","Stars ⭐","Eagles 🦅","Hearts ❤️",
      "Balloons 🎈","Sparkles ✨","Lights 💡","Parade 🎉","Confetti 🎊",
    ],
    animals: [
      "Paws 🐾","Dogs 🐶","Cats 🐱","Bones 🦴","Balls 🎾",
      "Fish 🐟","Birds 🐦","Hearts ❤️","Bowls 🥣","Stars ✨",
    ],
    love: [
      "Hearts ❤️","Kisses 💋","Roses 🌹","Rings 💍","Cupid 🏹",
      "Stars ✨","Balloons 🎈","Gifts 🎁","Doves 🕊️","Music 🎶",
    ],
    birthday: [
      "Confetti 🎊","Cake 🎂","Balloons 🎈","Gifts 🎁","Party 🎉",
      "Sparkles ✨","Candles 🕯️","Hats 🎩","Stars ⭐","Ribbons 🎀",
    ],
    christmas: [
      "Snow ❄️","Tree 🎄","Gifts 🎁","Stars ⭐","Lights ✨",
      "Santa 🎅","Socks 🧦","Candy 🍬","Bells 🔔","Snowman ⛄",
    ],
    newyear: [
      "Fireworks 🎆","Balloons 🎈","Stars ⭐","Confetti 🎊","Sparkles ✨",
      "Champagne 🍾","Glasses 🥂","Clock 🕛","Party 🎉","Lights 💡",
    ],
    default: [
      "Stars ✨","Moons 🌙","Clouds ☁️","Lights 💡","Dreams 🌈",
    ],
  };
  return OPTIONS[cat] || OPTIONS.default;
}

/* ===========================================================
   🧩 Mapa (opción → emojis concretos) por categoría
   =========================================================== */
const OPTION_EMOJIS = {
  easter: {
    "Flowers 🌸": ["🌷","🌼","🌸"],
    "Bunnies 🐰": ["🐰","🐇"],
    "Eggs 🥚": ["🥚"],
    "Chicks 🐣": ["🐣"],
    "Butterflies 🦋": ["🦋"],
    "Grass 🌿": ["🌿"],
    "Sun ☀️": ["☀️"],
    "Clouds ☁️": ["☁️"],
    "Carrots 🥕": ["🥕"],
    "Basket 🧺": ["🧺"],
  },
  halloween: {
    "Pumpkins 🎃": ["🎃"],
    "Ghosts 👻": ["👻"],
    "Candies 🍬": ["🍬","🍭"],
    "Bats 🦇": ["🦇"],
    "Skulls 💀": ["💀"],
    "Spiders 🕷️": ["🕷️"],
    "Webs 🕸️": ["🕸️"],
    "Bones 🦴": ["🦴"],
    "Lanterns 🪔": ["🪔","🕯️"],
    "Moons 🌙": ["🌙"],
  },
  july4: {
    "Fireworks 🎆": ["🎆","🎇"],
    "Flags 🇺🇸": ["🇺🇸"],
    "Stars ⭐": ["⭐"],
    "Eagles 🦅": ["🦅"],
    "Hearts ❤️": ["❤️","💙"],
    "Balloons 🎈": ["🎈"],
    "Sparkles ✨": ["✨"],
    "Lights 💡": ["💡"],
    "Parade 🎉": ["🎉"],
    "Confetti 🎊": ["🎊"],
  },
  animals: {
    "Paws 🐾": ["🐾"],
    "Dogs 🐶": ["🐶","🐕"],
    "Cats 🐱": ["🐱","🐈"],
    "Bones 🦴": ["🦴"],
    "Balls 🎾": ["🎾"],
    "Fish 🐟": ["🐟"],
    "Birds 🐦": ["🐦"],
    "Hearts ❤️": ["❤️"],
    "Bowls 🥣": ["🥣"],
    "Stars ✨": ["✨"],
  },
  love: {
    "Hearts ❤️": ["❤️","💖","💕"],
    "Kisses 💋": ["💋"],
    "Roses 🌹": ["🌹"],
    "Rings 💍": ["💍"],
    "Cupid 🏹": ["🏹"],
    "Stars ✨": ["✨"],
    "Balloons 🎈": ["🎈"],
    "Gifts 🎁": ["🎁"],
    "Doves 🕊️": ["🕊️"],
    "Music 🎶": ["🎶"],
  },
  birthday: {
    "Confetti 🎊": ["🎊"],
    "Cake 🎂": ["🎂","🧁","🍰"],
    "Balloons 🎈": ["🎈"],
    "Gifts 🎁": ["🎁"],
    "Party 🎉": ["🎉"],
    "Sparkles ✨": ["✨"],
    "Candles 🕯️": ["🕯️"],
    "Hats 🎩": ["🎩","🥳"],
    "Stars ⭐": ["⭐"],
    "Ribbons 🎀": ["🎀"],
  },
  christmas: {
    "Snow ❄️": ["❄️"],
    "Tree 🎄": ["🎄"],
    "Gifts 🎁": ["🎁"],
    "Stars ⭐": ["⭐"],
    "Lights ✨": ["✨"],
    "Santa 🎅": ["🎅"],
    "Socks 🧦": ["🧦"],
    "Candy 🍬": ["🍬"],
    "Bells 🔔": ["🔔"],
    "Snowman ⛄": ["⛄"],
  },
  newyear: {
    "Fireworks 🎆": ["🎆","🎇"],
    "Balloons 🎈": ["🎈"],
    "Stars ⭐": ["⭐"],
    "Confetti 🎊": ["🎊"],
    "Sparkles ✨": ["✨"],
    "Champagne 🍾": ["🍾"],
    "Glasses 🥂": ["🥂"],
    "Clock 🕛": ["🕛"],
    "Party 🎉": ["🎉"],
    "Lights 💡": ["💡"],
  },
  default: {
    "Stars ✨": ["✨","⭐"],
    "Moons 🌙": ["🌙"],
    "Clouds ☁️": ["☁️"],
    "Lights 💡": ["💡"],
    "Dreams 🌈": ["🌈"],
  },
};

/* ===========================================================
   ✨ Overlay de partículas — lento, elegante, encima de todo
   =========================================================== */
export function AnimationOverlay({ slug, animation }) {
  // velocidad y cantidad (ajustables)
  const PARTICLES = 14;        // pocas, sin saturar
  const DURATION_MIN = 18;     // lentamente
  const DURATION_RAND = 10;    // +0..10s extra

  // resolvemos categoría y set activo
  const category = getAnimationsForSlug(slug);
  const optionSet = useMemo(() => {
    const catMap = OPTION_EMOJIS[category] || OPTION_EMOJIS.default;
    return catMap[animation] || ["✨"];
  }, [category, animation]);

  // direcciones variadas (no todas iguales)
  const dirs = useMemo(() => ([
    { x: 0, y: -120 },
    { x: 0, y: 120 },
    { x: -100, y: 0 },
    { x: 100, y: 0 },
    { x: 80, y: -80 },
    { x: -80, y: -80 },
    { x: 80, y: 80 },
    { x: -80, y: 80 },
  ]), []);

  const [particles, setParticles] = useState([]);

  // Monta inmediatamente y se regenera al cambiar la opción
  useEffect(() => {
    const next = Array.from({ length: PARTICLES }, (_, i) => ({
      id: i,
      emoji: optionSet[i % optionSet.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      dir: dirs[(i + 3) % dirs.length], // repartir direcciones
      delay: Math.random() * 0.15,      // aparece casi ya
      duration: DURATION_MIN + Math.random() * DURATION_RAND,
      opacity: 0.35 + Math.random() * 0.35,
      scale: 0.85 + Math.random() * 0.4,
      rot: (Math.random() * 16) - 8,
    }));
    setParticles(next);
  }, [optionSet, dirs]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[999]">
      {particles.map(p => (
        <motion.span
          key={`${animation}-${p.id}`}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${18 + Math.random() * 14}px`,
            opacity: p.opacity,
          }}
          initial={{ opacity: 0, scale: p.scale * 0.9 }}
          animate={{
            opacity: [p.opacity * 0.7, p.opacity, p.opacity * 0.7],
            x: p.dir.x,
            y: p.dir.y,
            rotate: [0, p.rot, -p.rot, 0],
            scale: [p.scale * 0.95, p.scale * 1.05, p.scale],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
       }
