"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/* 🎨 Opciones por categoría (10 por cada una) */
const CATEGORIES = {
  easter: {
    options: {
      "Flowers 🌸": ["🌷", "🌼", "🌸"],
      "Bunnies 🐰": ["🐰"],
      "Eggs 🥚": ["🥚"],
      "Chicks 🐣": ["🐣"],
      "Butterflies 🦋": ["🦋"],
      "Grass 🌿": ["🌿"],
      "Sun ☀️": ["☀️"],
      "Clouds ☁️": ["☁️"],
      "Carrots 🥕": ["🥕"],
      "Basket 🧺": ["🧺"],
    },
  },
  halloween: {
    options: {
      "Pumpkins 🎃": ["🎃"],
      "Ghosts 👻": ["👻"],
      "Candies 🍬": ["🍬"],
      "Bats 🦇": ["🦇"],
      "Skulls 💀": ["💀"],
      "Spiders 🕷️": ["🕷️"],
      "Webs 🕸️": ["🕸️"],
      "Bones 🦴": ["🦴"],
      "Lanterns 🪔": ["🪔"],
      "Moons 🌙": ["🌙"],
    },
  },
  july4: {
    options: {
      "Fireworks 🎆": ["🎆"],
      "Flags 🇺🇸": ["🇺🇸"],
      "Stars ⭐": ["⭐"],
      "Eagles 🦅": ["🦅"],
      "Hearts ❤️": ["❤️"],
      "Balloons 🎈": ["🎈"],
      "Sparkles ✨": ["✨"],
      "Lights 💡": ["💡"],
      "Parade 🎉": ["🎉"],
      "Confetti 🎊": ["🎊"],
    },
  },
  animals: {
    options: {
      "Paws 🐾": ["🐾"],
      "Dogs 🐶": ["🐶"],
      "Cats 🐱": ["🐱"],
      "Bones 🦴": ["🦴"],
      "Balls 🎾": ["🎾"],
      "Fish 🐟": ["🐟"],
      "Birds 🐦": ["🐦"],
      "Hearts ❤️": ["❤️"],
      "Bowls 🥣": ["🥣"],
      "Stars ✨": ["✨"],
    },
  },
  love: {
    options: {
      "Hearts ❤️": ["❤️"],
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
  },
  default: {
    options: {
      "Stars ✨": ["✨"],
      "Moons 🌙": ["🌙"],
      "Clouds ☁️": ["☁️"],
      "Lights 💡": ["💡"],
      "Dreams 🌈": ["🌈"],
      "Sparkles ✨": ["✨"],
      "Balloons 🎈": ["🎈"],
      "Hearts ❤️": ["❤️"],
      "Snow ❄️": ["❄️"],
      "Confetti 🎊": ["🎊"],
    },
  },
};

/* 🔎 slug → categoría */
export function getAnimationsForSlug(slug = "") {
  const s = (slug || "").toLowerCase();
  if (s.includes("easter")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("animal") || s.includes("pet")) return "animals";
  if (s.includes("love") || s.includes("valentine")) return "love";
  return "default";
}

/* 📋 opciones (10 textos) para el dropdown */
export function getAnimationOptionsForSlug(slug = "") {
  const cat = getAnimationsForSlug(slug);
  return Object.keys(CATEGORIES[cat].options);
}

/* ✨ Overlay único: SOLO la animación seleccionada */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const cat = useMemo(() => getAnimationsForSlug(slug), [slug]);

  // set activo (solo lo del dropdown)
  const activeSet = useMemo(() => {
    const options = CATEGORIES[cat].options;
    return options[animation] || options[Object.keys(options)[0]];
  }, [cat, animation]);

  // regenerar partículas INMEDIATAMENTE cuando cambia la opción
  useEffect(() => {
    const total = 18;
    const next = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${16 + Math.random() * 22}px`,
      delay: Math.random() * 0.3,          // ⚡ casi inmediato al cambiar
      duration: 16 + Math.random() * 10,   // 🐢 lento y armonioso
      opacity: 0.45 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 30,   // leves variaciones horizontales
      startY: 110 + Math.random() * 10,    // siempre desde abajo
      endY: -10,
    }));
    setItems(next);
  }, [activeSet]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animation} // fuerza remount instantáneo
        className="fixed inset-0 pointer-events-none z-[500] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {items.map((it) => (
          <motion.div
            key={it.id}
            initial={{ y: `${it.startY}vh`, opacity: 0, scale: 0.9 }}
            animate={{
              y: `${it.endY}vh`,
              opacity: it.opacity,
              scale: 1,
              x: [0, it.drift, -it.drift, 0],
              rotate: [0, 8, -6, 0],
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
