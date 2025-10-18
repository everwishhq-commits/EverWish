// /lib/animations.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ----------------------- 1) Detectar categoría ----------------------- */
export const getAnimationsForSlug = (slug = "") => {
  const s = (slug || "").toLowerCase();

  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad") || s.includes("holiday"))
    return "christmas";
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pet") || s.includes("paw") || s.includes("pets")) return "pets";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("valentines") || s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday") || s.includes("cumple")) return "birthday";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring") || s.includes("primavera")) return "spring";
  if (s.includes("anniversary") || s.includes("anivers")) return "anniversary";
  if (s.includes("congrats") || s.includes("congrat") || s.includes("felic")) return "congrats";
  return "general";
};

/* ----------------------- 2) Opciones ----------------------- */
const OPTIONS = {
  halloween: [
    "✨ None (No Animation)",
    "Pumpkins 🎃","Ghosts 👻","Candy 🍬","Bats 🦇","Spiders 🕷️","Skulls 💀","Webs 🕸️","Lanterns 🪔","Moon 🌙","Stars ✨"
  ],
  birthday: [
    "✨ None (No Animation)",
    "Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Gifts 🎁","Party 🎉","Streamers 🎏","Stars ⭐","Hats 🎩","Sparkles ✨"
  ],
  christmas: [
    "✨ None (No Animation)",
    "Snow ❄️","Trees 🎄","Lights ✨","Gifts 🎁","Stars ⭐","Bells 🔔","Candycanes 🍭","Snowflakes ❄️","Holly 🌿","Ribbons 🎀"
  ],
  easter: [
    "✨ None (No Animation)",
    "Eggs 🥚","Bunnies 🐰","Carrots 🥕","Flowers 🌸","Spring 🌼","Butterflies 🦋","Grass 🌿","Sun ☀️","Clouds ☁️","Daisies 🌼"
  ],
  mothers: [
    "✨ None (No Animation)",
    "Flowers 🌸","Hearts ❤️","Butterflies 🦋","Ribbons 🎀","Daisies 🌼","Stars ⭐","Balloons 🎈","Sun ☀️","Sparkles ✨","Love 💞"
  ],
  general: [
    "✨ None (No Animation)",
    "Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈","Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️"
  ]
};

/* ----------------------- 3) Emojis específicos ----------------------- */
const OPTION_EMOJIS = {
  halloween: {
    "Pumpkins 🎃": ["🎃"],
    "Ghosts 👻": ["👻"],
    "Candy 🍬": ["🍬"],
    "Bats 🦇": ["🦇"],
    "Spiders 🕷️": ["🕷️"],
    "Skulls 💀": ["💀"],
    "Webs 🕸️": ["🕸️"],
    "Lanterns 🪔": ["🪔"],
    "Moon 🌙": ["🌙"],
    "Stars ✨": ["✨"],
  },
  birthday: {
    "Confetti 🎊": ["🎊","🎉"],
    "Balloons 🎈": ["🎈"],
    "Cake 🎂": ["🎂"],
    "Candles 🕯️": ["🕯️"],
    "Gifts 🎁": ["🎁"],
    "Party 🎉": ["🎉","🥳"],
    "Streamers 🎏": ["🎏"],
    "Stars ⭐": ["⭐"],
    "Hats 🎩": ["🎩"],
    "Sparkles ✨": ["✨"],
  },
  christmas: {
    "Snow ❄️": ["❄️"],
    "Trees 🎄": ["🎄"],
    "Lights ✨": ["✨"],
    "Gifts 🎁": ["🎁"],
    "Stars ⭐": ["⭐"],
    "Bells 🔔": ["🔔"],
    "Candycanes 🍭": ["🍭"],
    "Snowflakes ❄️": ["❄️"],
    "Holly 🌿": ["🌿"],
    "Ribbons 🎀": ["🎀"],
  },
  easter: {
    "Eggs 🥚": ["🥚"],
    "Bunnies 🐰": ["🐰"],
    "Carrots 🥕": ["🥕"],
    "Flowers 🌸": ["🌸","🌼"],
    "Spring 🌼": ["🌼"],
    "Butterflies 🦋": ["🦋"],
    "Grass 🌿": ["🌿"],
    "Sun ☀️": ["☀️"],
    "Clouds ☁️": ["☁️"],
    "Daisies 🌼": ["🌼"],
  },
  mothers: {
    "Flowers 🌸": ["🌸"],
    "Hearts ❤️": ["❤️"],
    "Butterflies 🦋": ["🦋"],
    "Ribbons 🎀": ["🎀"],
    "Daisies 🌼": ["🌼"],
    "Stars ⭐": ["⭐"],
    "Balloons 🎈": ["🎈"],
    "Sun ☀️": ["☀️"],
    "Sparkles ✨": ["✨"],
    "Love 💞": ["💞"],
  },
  general: {
    "Sparkles ✨": ["✨"],
    "Stars ⭐": ["⭐"],
    "Hearts ❤️": ["❤️"],
    "Confetti 🎊": ["🎊"],
    "Balloons 🎈": ["🎈"],
    "Flowers 🌸": ["🌸"],
    "Butterflies 🦋": ["🦋"],
    "Leaves 🍃": ["🍃"],
    "Sun ☀️": ["☀️"],
    "Clouds ☁️": ["☁️"],
  },
};

/* ----------------------- 4) Mezcla de categorías ----------------------- */
export const getAnimationOptionsForSlug = (slug = "") => {
  if (!slug) return OPTIONS.general;

  const s = slug.toLowerCase();
  const parts = s.split("_");

  const found = parts.map((p) => getAnimationsForSlug(p)).filter((c) => c && c !== "general");
  const hasGeneral = parts.some((p) => p === "general");

  if (found.length === 0) return OPTIONS.general;
  if (found.length === 1 || hasGeneral) {
    const cat = found[0];
    return OPTIONS[cat] || OPTIONS.general;
  }

  const [main, sub] = found;
  const base1 = OPTIONS[main] || OPTIONS.general;
  const base2 = OPTIONS[sub] || OPTIONS.general;

  const combined = [base1[0], ...base1.slice(1, 6), ...base2.slice(1, 6)];
  const unique = [...new Set(combined)];

  if (unique.length < 11) {
    const fill = OPTIONS.general.slice(1, 11 - unique.length);
    return [...unique, ...fill];
  }

  return unique.slice(0, 11);
};

/* ----------------------- 5) Overlay ----------------------- */
export function AnimationOverlay({ slug, animation }) {
  if (!animation || animation.startsWith("✨ None")) return null;

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);

  const emojis = useMemo(() => {
    const set = OPTION_EMOJIS[category] || OPTION_EMOJIS.general;
    return set?.[animation] || ["✨"];
  }, [category, animation]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      dur: 9 + Math.random() * 6,
      dir: [
        { x: 0, y: -110 }, { x: 0, y: 110 },
        { x: -110, y: 0 }, { x: 110, y: 0 },
        { x: 70, y: -90 }, { x: -70, y: -90 },
        { x: 90, y: 70 }, { x: -90, y: 70 },
      ][Math.floor(Math.random() * 8)],
      scale: 0.8 + Math.random() * 0.6,
    }));
    setItems(arr);
  }, [category, animation]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="absolute select-none"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: `${18 + Math.random() * 18}px`,
            opacity: 0.75,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: it.scale * 0.9 }}
          animate={{
            opacity: [0.4, 1, 0.35],
            x: it.dir.x,
            y: it.dir.y,
            scale: [it.scale, it.scale * 1.15, it.scale * 0.95],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: it.dur,
            repeat: Infinity,
            delay: it.delay,
            ease: "easeInOut",
          }}
        >
          {emojis[it.id % emojis.length]}
        </motion.span>
      ))}
    </div>
  );
}
