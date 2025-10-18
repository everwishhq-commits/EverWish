"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ----------------------------------
 * DETECCIÓN DE CATEGORÍA POR SLUG
 * ---------------------------------- */
const slugToCategory = (slug = "") => {
  const s = (slug || "").toLowerCase();

  if (s.includes("ghost") || s.includes("halloween") || s.includes("zombie")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pet") || s.includes("paw")) return "pets";
  if (s.includes("usa") || s.includes("july4")) return "july4";
  if (s.includes("christmas") || s.includes("xmas")) return "christmas";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday") || s.includes("party")) return "birthday";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring")) return "spring";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("congrats")) return "congrats";
  return "general";
};

/* ----------------------------------
 * DETECCIÓN POR MENSAJE (si es general)
 * ---------------------------------- */
const messageToMood = (text = "") => {
  const t = text.toLowerCase();

  if (t.match(/birthday|party|cake|celebrat|🎂|🎈|🎊/)) return "birthday";
  if (t.match(/love|heart|valentine|💞|❤️/)) return "valentines";
  if (t.match(/thanks|grateful|gratitude|🙏/)) return "thanksgiving";
  if (t.match(/congrat|well done|👏|🏆/)) return "congrats";
  if (t.match(/peace|light|joy|🌸|✨|🌿|☀️/)) return "spring";
  if (t.match(/merry|xmas|🎄|🎅|❄️/)) return "christmas";
  if (t.match(/mom|mother|🌸|💐|❤️/)) return "mothers";
  if (t.match(/dad|father|👔|🏆/)) return "fathers";
  if (t.match(/pet|🐶|🐱|🐾/)) return "pets";
  return "general";
};

/* ----------------------------------
 * EMOJIS POR CATEGORÍA / MOOD
 * ---------------------------------- */
const EMOJIS = {
  halloween: ["🎃","👻","🧙‍♀️","🦇","💀","🕸️","🕷️","🍬","🧟","🌕"],
  easter: ["🐰","🥕","🌸","🥚","🌼","🦋","🐣","☀️","🌿","✨"],
  pets: ["🐾","🐶","🐱","🦴","🎾","💖","🐕","🐈","🌸","☀️"],
  birthday: ["🎉","🎈","🎂","🧁","🎁","🎊","🎀","💝","🥳","✨"],
  christmas: ["🎄","🎅","🎁","❄️","✨","🔔","⭐","☃️","🕯️","🌟"],
  valentines: ["❤️","💞","🌹","💋","🎀","💘","💝","✨","🕊️","⭐"],
  graduation: ["🎓","⭐","🎉","🎊","📜","🥇","🏆","👏","✨","🎈"],
  mothers: ["🌸","💐","💖","🌼","🎀","☀️","✨","💝","⭐","🦋"],
  fathers: ["🏆","👔","🎖️","🎉","👍","🎊","💪","⭐","🥇","✨"],
  thanksgiving: ["🦃","🍂","🎃","🍁","🌽","🥧","🍗","🧡","💛","✨"],
  newyear: ["🎆","🎇","🥂","🍾","🎉","✨","⭐","🎊","🕛","💫"],
  spring: ["🌸","🌼","🦋","🌿","☀️","🌱","✨","🐝","🌷","🌞"],
  anniversary: ["💍","❤️","💞","🌹","🍷","🎊","✨","⭐","🎈","💝"],
  congrats: ["🎊","🎉","🏆","🥇","⭐","👏","🎈","✨","🎀","🥂"],
  general: ["✨","⭐","🎈","🌸","🦋","🍃","☀️","🎊","💞","☁️"],
};

/* ----------------------------------
 * ANIMACIÓN PRINCIPAL
 * ---------------------------------- */
export function AnimationOverlay({ slug, message }) {
  const baseCategory = useMemo(() => slugToCategory(slug), [slug]);
  const mood = baseCategory === "general" ? messageToMood(message) : baseCategory;
  const chosen = EMOJIS[mood] || EMOJIS.general;

  const [items, setItems] = useState([]);

  useEffect(() => {
    const total = 36;
    const next = Array.from({ length: total }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1.5,
      dir: [
        { x: 0, y: -150 },
        { x: 0, y: 150 },
        { x: -150, y: 0 },
        { x: 150, y: 0 },
        { x: 100, y: -100 },
        { x: -100, y: -100 },
        { x: 120, y: 100 },
        { x: -120, y: 100 },
      ][Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [mood, message]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-3xl select-none opacity-80"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 1, 0.2],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.3, 0.9],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {chosen[item.id % chosen.length]}
        </motion.span>
      ))}
    </div>
  );
    }
