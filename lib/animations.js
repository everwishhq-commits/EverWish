"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 🎆 AnimationOverlay (versión estable)
 * Muestra una sola capa de partículas flotantes por categoría,
 * con movimiento suave, sin duplicaciones ni retrasos.
 */

/* 🎨 Categorías y elementos */
const animationCategories = {
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
  easter: {
    options: {
      "Flowers 🌸": ["🌷", "🌸", "🌼"],
      "Bunnies 🐰": ["🐰"],
      "Eggs 🥚": ["🥚"],
      "Chicks 🐣": ["🐣"],
      "Butterflies 🦋": ["🦋"],
      "Grass 🌿": ["🌿"],
      "Carrots 🥕": ["🥕"],
      "Sun ☀️": ["☀️"],
      "Clouds ☁️": ["☁️"],
      "Basket 🧺": ["🧺"],
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
      "Stars ✨": ["✨"],
      "Bowls 🥣": ["🥣"],
    },
  },
  default: {
    options: {
      "Stars ✨": ["✨"],
      "Moons 🌙": ["🌙"],
      "Clouds ☁️": ["☁️"],
      "Lights 💡": ["💡"],
      "Dreams 🌈": ["🌈"],
    },
  },
};

/* 🔹 Relaciona slug → categoría */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();
  if (slug.includes("halloween") || slug.includes("ghost")) return "halloween";
  if (slug.includes("easter")) return "easter";
  if (slug.includes("love") || slug.includes("valentine")) return "love";
  if (slug.includes("4th") || slug.includes("usa") || slug.includes("july"))
    return "july4";
  if (slug.includes("animal") || slug.includes("pet")) return "animals";
  return "default";
}

/* 🔻 Devuelve todas las opciones del dropdown */
export function getAnimationOptionsForSlug(slug) {
  const cat = getAnimationsForSlug(slug);
  return Object.keys(animationCategories[cat].options);
}

/* 🌟 Animación flotante */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0);

  const category = getAnimationsForSlug(slug);
  const activeSet =
    animationCategories[category]?.options?.[animation] ||
    animationCategories.default.options["Stars ✨"];

  useEffect(() => {
    // generar un solo set de partículas
    const total = 16;
    const newItems = Array.from({ length: total }, (_, i) => ({
      id: i,
      emoji: activeSet[Math.floor(Math.random() * activeSet.length)],
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 18}px`,
      delay: Math.random() * 4,
      duration: Math.random() * 12 + 18, // velocidad media-lenta
      opacity: Math.random() * 0.5 + 0.4,
      drift: Math.random() > 0.5 ? 20 : -20, // leve oscilación lateral
    }));
    setItems(newItems);
    setKey((k) => k + 1); // forza refresco al cambiar
  }, [slug, animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="fixed inset-0 pointer-events-none z-[250] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: "110vh", opacity: 0, scale: 0.9 }}
            animate={{
              y: "-10vh",
              x: item.drift,
              opacity: item.opacity,
              scale: 1,
              rotate: Math.random() * 25 - 12,
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: item.left,
              fontSize: item.size,
              userSelect: "none",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
    }
