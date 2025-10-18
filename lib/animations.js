// /lib/animations.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/** --------------------------
 *  CATEGORÍAS Y DETECCIÓN
 * ------------------------- */
const slugToCategory = (slug = "", message = "") => {
  const s = (slug + " " + message).toLowerCase();

  if (s.includes("birthday") || s.includes("cumple")) return "birthday";
  if (s.includes("zombie") && s.includes("cumple")) return "birthday";
  if (s.includes("ghost") || s.includes("halloween") || s.includes("zombie")) return "halloween";
  if (s.includes("easter") || s.includes("bunny")) return "easter";
  if (s.includes("love") || s.includes("valentine")) return "valentines";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("congrats") || s.includes("congrat")) return "congrats";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("newyear") || s.includes("new year")) return "newyear";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("spring")) return "spring";
  if (s.includes("pets") || s.includes("paw")) return "pets";
  return "general";
};

/** --------------------------
 *  OPCIONES DE ANIMACIÓN
 * ------------------------- */
const OPTIONS = {
  none: ["Ninguna animación 🚫"],
  halloween: ["Pumpkins 🎃","Ghosts 👻","Bats 🦇","Candy 🍬","Spiders 🕷️","Fog 🌫️","Stars ✨","Moon 🌙","Skulls 💀","Sparkles ✨"],
  birthday:  ["Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Stars ⭐","Gifts 🎁","Streamers 🎉","Hearts ❤️","Sparkles ✨","Party 🥳"],
  easter:    ["Eggs 🥚","Bunnies 🐰","Flowers 🌸","Carrots 🥕","Spring 🌼","Butterflies 🦋","Grass 🌿","Sun ☀️","Sparkles ✨","Rain ☔"],
  valentines:["Hearts ❤️","Roses 🌹","Kiss 💋","Ribbons 🎀","Love 💞","Arrows 💘","Balloons 🎈","Stars ⭐","Sparkles ✨","Confetti 🎊"],
  christmas: ["Snow ❄️","Trees 🎄","Lights ✨","Gifts 🎁","Bells 🔔","Candycanes 🍭","Stars ⭐","Snowflakes ❄️","Sparkles ✨","Holly 🌿"],
  graduation:["Caps 🎓","Stars ⭐","Scrolls 📜","Confetti 🎊","Sparkles ✨","Balloons 🎈","Fireworks 🎆","Medals 🥇","Thumbs 👍","Ribbons 🎀"],
  mothers:   ["Flowers 🌸","Hearts ❤️","Sparkles ✨","Butterflies 🦋","Ribbons 🎀","Daisies 🌼","Stars ⭐","Balloons 🎈","Love 💞","Sun ☀️"],
  fathers:   ["Trophies 🏆","Stars ⭐","Hearts ❤️","Tools 🔧","Confetti 🎊","Sparkles ✨","Balloons 🎈","Thumbs 👍","Medals 🥇","Ribbons 🎀"],
  thanksgiving:["Leaves 🍂","Pumpkins 🎃","Turkeys 🦃","Corn 🌽","Pies 🥧","Stars ⭐","Sparkles ✨","Hearts ❤️","Acorns 🌰","Berries 🍇"],
  newyear:   ["Fireworks 🎆","Sparklers 🎇","Champagne 🍾","Stars ⭐","Clocks 🕛","Confetti 🎊","Balloons 🎈","Sparkles ✨","2025 ✨","Hearts ❤️"],
  spring:    ["Flowers 🌸","Leaves 🍃","Butterflies 🦋","Bees 🐝","Sun ☀️","Clouds ☁️","Rain ☔","Sparkles ✨","Daisies 🌼","Ladybugs 🐞"],
  anniversary:["Hearts ❤️","Rings 💍","Roses 🌹","Wine 🍷","Sparkles ✨","Stars ⭐","Confetti 🎊","Balloons 🎈","Love 💞","Doves 🕊️"],
  congrats:  ["Confetti 🎊","Fireworks 🎆","Stars ⭐","Thumbs 👍","Trophy 🏆","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Medals 🥇","Party 🥳"],
  pets:      ["Paw Prints 🐾","Hearts ❤️","Bones 🦴","Fish 🐟","Stars ✨","Sparkles ✨","Butterflies 🦋","Clouds ☁️","Sun ☀️","Love 💞"],
  general:   ["Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈","Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️"],
};

/** --------------------------
 *  EMOJIS POR CATEGORÍA
 * ------------------------- */
const EMOJI_SET = {
  none: [],
  halloween: ["🎃","👻","🕷️","🕸️","🌙","🍬","🦇","💀","✨","🎃"],
  birthday:  ["🎂","🎉","🎊","🎈","🎁","🕯️","✨","🥳","🎀","⭐"],
  easter:    ["🥚","🐰","🌸","🌼","🦋","☀️","🌿","🌷","🐣","✨"],
  valentines:["❤️","💞","💋","💘","🌹","🎀","✨","💝","⭐","💌"],
  christmas: ["🎄","🎁","❄️","✨","🔔","🍭","⭐","🌿","🎅","☃️"],
  graduation:["🎓","🎊","⭐","🎉","📜","🎈","🥇","👏","✨","🎀"],
  mothers:   ["🌸","💐","💞","🌼","🦋","✨","❤️","🎀","☀️","⭐"],
  fathers:   ["🏆","🧰","✨","🎖️","⭐","🎉","🎈","👍","🥇","💪"],
  congrats:  ["🎉","🎊","👏","🏆","🥇","⭐","🎈","🎀","🎆","✨"],
  anniversary:["💞","💍","🌹","🍷","✨","🎀","🎊","🎈","❤️","🕊️"],
  newyear:   ["🎆","🎇","🍾","🎉","✨","🕛","⭐","🎊","🎈","💫"],
  thanksgiving:["🍂","🎃","🦃","🍗","🍁","🥧","🌽","✨","❤️","⭐"],
  spring:    ["🌸","🌼","🐝","🦋","☀️","🌿","✨","🌷","🍃","🐞"],
  pets:      ["🐾","🐕","🐈","🦴","🐾","✨","🎾","❤️","⭐","☁️"],
  general:   ["✨","⭐","💫","🎈","🎉","🌸","❤️","🦋","☀️","🌿"],
};

/** --------------------------
 *  OVERLAY ANIMADO
 * ------------------------- */
export function AnimationOverlay({ slug, message, animation }) {
  const category = useMemo(() => slugToCategory(slug, message), [slug, message]);
  const emojis = useMemo(() => {
    if (animation && animation.toLowerCase().includes("ninguna")) return [];
    return EMOJI_SET[category] || EMOJI_SET.general;
  }, [category, animation]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (emojis.length === 0) return setItems([]);
    const next = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dir: [
        { x: 0, y: -100 }, { x: 0, y: 100 },
        { x: -100, y: 0 }, { x: 100, y: 0 },
        { x: 80, y: -60 }, { x: -80, y: -60 },
        { x: 60, y: 80 }, { x: -60, y: 80 },
      ][Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [emojis]);

  if (emojis.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl select-none opacity-70"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.5, 1, 0.2],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.9, 1.2, 0.9],
            rotate: [0, 12, -12, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 3,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {emojis[item.id % emojis.length]}
        </motion.span>
      ))}
    </div>
  );
}

/** EXPORTS */
export const getAnimationsForSlug = (slug, message) => slugToCategory(slug, message);
export const getAnimationOptionsForSlug = (slug) => OPTIONS[slugToCategory(slug)] || OPTIONS.general;
