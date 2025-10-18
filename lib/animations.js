// /lib/animations.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* CATEGORÍAS Y OPCIONES */
const slugToCategory = (slug = "") => {
  const s = (slug || "").toLowerCase();
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pets") || s.includes("pet") || s.includes("paw")) return "pets";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("valentines") || s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring")) return "spring";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("congrats") || s.includes("congrat")) return "congrats";
  return "general";
};

const OPTIONS = {
  halloween: ["Pumpkins 🎃", "Ghosts 👻", "Candy 🍬", "Bats 🦇", "Stars ✨"],
  easter: ["Eggs 🥚", "Bunnies 🐰", "Carrots 🥕", "Flowers 🌸", "Butterflies 🦋"],
  pets: ["Paw Prints 🐾", "Hearts ❤️", "Stars ✨", "Sparkles ✨", "Bones 🦴"],
  july4: ["Fireworks 🎆", "Stars ⭐", "Eagles 🦅", "Flags 🇺🇸", "Confetti 🎊"],
  christmas: ["Snow ❄️", "Trees 🎄", "Gifts 🎁", "Stars ⭐", "Bells 🔔"],
  valentines: ["Hearts ❤️", "Roses 🌹", "Sparkles ✨", "Love 💞", "Stars ⭐"],
  birthday: ["Confetti 🎊", "Balloons 🎈", "Cake 🎂", "Stars ⭐", "Sparkles ✨"],
  graduation: ["Caps 🎓", "Stars ⭐", "Confetti 🎊", "Scrolls 📜", "Fireworks 🎆"],
  mothers: ["Flowers 🌸", "Hearts ❤️", "Sparkles ✨", "Butterflies 🦋", "Sun ☀️"],
  fathers: ["Trophies 🏆", "Stars ⭐", "Hearts ❤️", "Thumbs 👍", "Sparkles ✨"],
  thanksgiving: ["Leaves 🍂", "Pumpkins 🎃", "Turkeys 🦃", "Corn 🌽", "Stars ⭐"],
  newyear: ["Fireworks 🎆", "Sparklers 🎇", "Stars ⭐", "Champagne 🍾", "Confetti 🎊"],
  spring: ["Flowers 🌸", "Butterflies 🦋", "Leaves 🍃", "Bees 🐝", "Sun ☀️"],
  anniversary: ["Hearts ❤️", "Rings 💍", "Roses 🌹", "Love 💞", "Sparkles ✨"],
  congrats: ["Confetti 🎊", "Fireworks 🎆", "Stars ⭐", "Thumbs 👍", "Trophy 🏆"],
  general: ["Sparkles ✨", "Stars ⭐", "Hearts ❤️", "Confetti 🎊", "Balloons 🎈"],
};

export const getAnimationsForSlug = (slug) => slugToCategory(slug);
export const getAnimationOptionsForSlug = (slug) => {
  const cat = slugToCategory(slug);
  return OPTIONS[cat] || OPTIONS.general;
};

/* EMOJIS DE OVERLAY */
const EMOJI_SET = {
  easter: ["🥚", "🐰", "🥕", "🌸", "🦋", "🌿", "✨"],
  halloween: ["🎃", "👻", "🍬", "🦇", "🌙", "✨"],
  pets: ["🐾", "❤️", "🦴", "🎾", "🐕", "✨"],
  july4: ["🎆", "🎇", "⭐", "🇺🇸", "🎊"],
  general: ["✨", "⭐", "🎈", "🌸", "🦋"],
};

export function AnimationOverlay({ slug, animation }) {
  const category = useMemo(() => slugToCategory(slug), [slug]);
  const chosenSet = useMemo(() => EMOJI_SET[category] || EMOJI_SET.general, [category]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      dir: [
        { x: 0, y: -100 },
        { x: 0, y: 100 },
        { x: -100, y: 0 },
        { x: 100, y: 0 },
      ][Math.floor(Math.random() * 4)],
    }));
    setItems(newItems);
  }, [animation, category]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden mix-blend-overlay">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl opacity-80 select-none"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0.4, 1, 0.2],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            delay: item.delay,
          }}
        >
          {chosenSet[item.id % chosenSet.length]}
        </motion.span>
      ))}
    </div>
  );
  }
