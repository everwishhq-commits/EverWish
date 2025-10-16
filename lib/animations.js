"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Sub-animaciones por categoría */
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

/* 🔹 Mapea slug → categoría */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();
  if (slug.includes("easter")) return "easter";
  if (slug.includes("halloween") || slug.includes("ghost")) return "halloween";
  if (slug.includes("july") || slug.includes("4th")) return "july4";
  if (slug.includes("animal") || slug.includes("pet")) return "animals";
  if (slug.includes("love") || slug.includes("heart")) return "love";
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
    const total = 18; // cantidad moderada
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 22 + 16}px`,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 10, // movimiento lento y flotante
      opacity: Math.random() * 0.4 + 0.4,
    }));
    setItems(newItems);
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
        transition={{ duration: 0.8 }}
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
  const category = getAnimationsForSlug(slug);
  const categoryData = animationCategories[category];
  return Object.keys(categoryData.options);
  }
