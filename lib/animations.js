// /lib/animations.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/** --------------------------------
 *  DETECCIÓN DE CATEGORÍA
 * --------------------------------*/
const slugToCategory = (slug = "", message = "") => {
  const s = (slug + " " + message).toLowerCase();
  if (s.includes("birthday") || s.includes("cumple")) return "birthday";
  if (s.includes("ghost") || s.includes("halloween") || s.includes("zombie")) return "halloween";
  if (s.includes("easter") || s.includes("bunny")) return "easter";
  if (s.includes("love") || s.includes("valentine")) return "valentines";
  if (s.includes("christmas") || s.includes("navidad") || s.includes("xmas")) return "christmas";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("congrats") || s.includes("congrat")) return "congrats";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("newyear")) return "newyear";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("spring")) return "spring";
  if (s.includes("pets") || s.includes("paw")) return "pets";
  return "general";
};

/** --------------------------------
 *  EMOJIS POR CATEGORÍA
 * --------------------------------*/
const EMOJI_SET = {
  halloween: ["🎃","👻","🕸️","🕷️","🌙","🍬","🦇","✨","💀","🎃"],
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

/** --------------------------------
 *  OVERLAY DE ANIMACIÓN
 * --------------------------------*/
export function AnimationOverlay({ slug, message }) {
  const category = useMemo(() => slugToCategory(slug, message), [slug, message]);
  const emojis = EMOJI_SET[category] || EMOJI_SET.general;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const count = 18;
    const next = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      dir: [
        { x: 0, y: -100 }, { x: 0, y: 100 },
        { x: -100, y: 0 }, { x: 100, y: 0 },
        { x: 80, y: -60 }, { x: -80, y: -60 },
        { x: 60, y: 80 }, { x: -60, y: 80 },
      ][Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [category, message]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl select-none opacity-70"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: [0.5, 1, 0],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.9, 1.3, 0.8],
            rotate: [0, 12, -12, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
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
