// lib/animations.js
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Categorías y opciones (10 por set) */
const animationCategories = {
  easter: {
    default: ["🌷"],
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
    default: ["🎃"],
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
    default: ["🎆"],
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
    default: ["🐾"],
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
    default: ["💖"],
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
    default: ["✨"],
    options: {
      "Stars ✨": ["✨"],
      "Moons 🌙": ["🌙"],
      "Clouds ☁️": ["☁️"],
      "Lights 💡": ["💡"],
      "Dreams 🌈": ["🌈"],
    },
  },
};

export function getAnimationsForSlug(slug = "") {
  const s = slug.toLowerCase();
  if (s.includes("easter")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("animal") || s.includes("pet")) return "animals";
  if (s.includes("love") || s.includes("heart")) return "love";
  return "default";
}
export function getAnimationOptionsForSlug(slug = "") {
  const cat = animationCategories[getAnimationsForSlug(slug)];
  return Object.keys(cat.options);
}

/* ✅ Overlay que:
   - se monta instantáneamente al entrar al editor
   - cambia inmediatamente al seleccionar otra opción
   - es lento/armónico y SIEMPRE por encima (z-[999])
*/
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
      delay: Math.random() * 0.6,        // ⏱️ aparece rápido
      duration: Math.random() * 10 + 18, // 🐢 18–28s
      opacity: Math.random() * 0.4 + 0.4,
    }));
    setItems(newItems);
    setKey((k) => k + 1); // fuerza remount = cambio inmediato
  }, [slug, animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: "110vh", opacity: 0, scale: 0.85 }}
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

export default {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
};
