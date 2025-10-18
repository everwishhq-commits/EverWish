// /lib/animations.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/** -----------------------
 *  CATEGORÍAS POR SLUG
 *  ----------------------*/
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
  // fallback
  return "general";
};

/** -----------------------------------------
 *  10 OPCIONES POR CATEGORÍA (DROPDOWN)
 *  ----------------------------------------*/
const OPTIONS = {
  halloween: ["Pumpkins 🎃","Ghosts 👻","Candy 🍬","Bats 🦇","Spiders 🕷️","Moon 🌙","Fog 🌫️","Stars ✨","Sparkles ✨","Boo! 👻"],
  easter:   ["Eggs 🥚","Bunnies 🐰","Carrots 🥕","Flowers 🌸","Spring 🌼","Butterflies 🦋","Grass 🌿","Sun ☀️","Daisies 🌼","Sparkles ✨"],
  pets:     ["Paw Prints 🐾","Hearts ❤️","Bones 🦴","Balls 🎾","Fish 🐟","Stars ✨","Sparkles ✨","Butterflies 🦋","Clouds ☁️","Sun ☀️"],
  july4:    ["Fireworks 🎆","Sparklers 🎇","Stars ⭐","Eagles 🦅","Flags 🇺🇸","Confetti 🎊","Balloons 🎈","Sparkles ✨","Rays ☀️","Hearts ❤️"],
  christmas:["Snow ❄️","Trees 🎄","Lights ✨","Gifts 🎁","Stars ⭐","Bells 🔔","Candycanes 🍭","Snowflakes ❄️","Sparkles ✨","Holly 🌿"],
  valentines:["Hearts ❤️","Roses 🌹","Sparkles ✨","Kiss 💋","Ribbons 🎀","Love 💞","Arrows 💘","Stars ⭐","Balloons 🎈","Confetti 🎊"],
  birthday: ["Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Stars ⭐","Gifts 🎁","Sparkles ✨","Party 🥳","Streamers 🎉","Hearts ❤️"],
  graduation:["Caps 🎓","Stars ⭐","Confetti 🎊","Scrolls 📜","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Fireworks 🎆","Thumbs 👍","Medals 🥇"],
  mothers:  ["Flowers 🌸","Hearts ❤️","Sparkles ✨","Butterflies 🦋","Ribbons 🎀","Daisies 🌼","Stars ⭐","Balloons 🎈","Sun ☀️","Love 💞"],
  fathers:  ["Trophies 🏆","Stars ⭐","Hearts ❤️","Tools 🔧","Confetti 🎊","Sparkles ✨","Balloons 🎈","Thumbs 👍","Ribbons 🎀","Medals 🥇"],
  thanksgiving:["Leaves 🍂","Pumpkins 🎃","Turkeys 🦃","Corn 🌽","Pies 🥧","Stars ⭐","Sparkles ✨","Hearts ❤️","Acorns 🌰","Berries 🍇"],
  newyear:  ["Fireworks 🎆","Sparklers 🎇","Champagne 🍾","Stars ⭐","Clocks 🕛","Confetti 🎊","Balloons 🎈","Sparkles ✨","2025 ✨","Hearts ❤️"],
  spring:   ["Flowers 🌸","Leaves 🍃","Butterflies 🦋","Bees 🐝","Sun ☀️","Clouds ☁️","Rain ☔","Sparkles ✨","Daisies 🌼","Ladybugs 🐞"],
  anniversary:["Hearts ❤️","Rings 💍","Roses 🌹","Sparkles ✨","Stars ⭐","Wine 🍷","Confetti 🎊","Balloons 🎈","Love 💞","Doves 🕊️"],
  congrats: ["Confetti 🎊","Fireworks 🎆","Stars ⭐","Thumbs 👍","Medals 🥇","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Trophy 🏆","Party 🥳"],
  general:  ["Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈","Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️"],
};

/** Helpers exportados */
export const getAnimationsForSlug = (slug) => slugToCategory(slug);
export const getAnimationOptionsForSlug = (slug) => {
  const cat = slugToCategory(slug);
  return OPTIONS[cat] || OPTIONS.general;
};

/** -----------------------
 *  EMOJIS POR CATEGORÍA
 *  ----------------------*/
const EMOJI_SET = {
  halloween: ["🎃","👻","🍬","🦇","🕸️","🌙","✨","🕷️","🎃","👻"],
  easter:    ["🥚","🐰","🥕","🌸","🌼","🦋","🌿","☀️","🌼","✨"],
  pets:      ["🐾","❤️","🦴","🎾","🐟","✨","⭐","🦋","☁️","☀️"],
  july4:     ["🎆","🎇","⭐","🦅","🇺🇸","🎊","🎈","✨","☀️","❤️"],
  christmas: ["❄️","🎄","✨","🎁","⭐","🔔","🍭","❄️","✨","🌿"],
  valentines:["❤️","🌹","✨","💋","🎀","💞","💘","⭐","🎈","🎊"],
  birthday:  ["🎊","🎈","🎂","🕯️","⭐","🎁","✨","🥳","🎉","❤️"],
  graduation:["🎓","⭐","🎊","📜","✨","🎈","🎀","🎆","👍","🥇"],
  mothers:   ["🌸","❤️","✨","🦋","🎀","🌼","⭐","🎈","☀️","💞"],
  fathers:   ["🏆","⭐","❤️","🔧","🎊","✨","🎈","👍","🎀","🥇"],
  thanksgiving:["🍂","🎃","🦃","🌽","🥧","⭐","✨","❤️","🌰","🍇"],
  newyear:   ["🎆","🎇","🍾","⭐","🕛","🎊","🎈","✨","✨","❤️"],
  spring:    ["🌸","🍃","🦋","🐝","☀️","☁️","☔","✨","🌼","🐞"],
  anniversary:["❤️","💍","🌹","✨","⭐","🍷","🎊","🎈","💞","🕊️"],
  congrats:  ["🎊","🎆","⭐","👍","🥇","✨","🎈","🎀","🏆","🥳"],
  general:   ["✨","⭐","❤️","🎊","🎈","🌸","🦋","🍃","☀️","☁️"],
};

/** --------------------------------
 *  OVERLAY DE ANIMACIONES (UI)
 *  --------------------------------*/
export function AnimationOverlay({ slug, animation }) {
  const category = useMemo(() => slugToCategory(slug), [slug]);
  const particles = 18;
  const baseSpeed = 12;

  const chosenSet = useMemo(() => {
    return EMOJI_SET[category] || EMOJI_SET.general;
  }, [category]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    // Recalcular partículas cada vez que cambia la opción del dropdown
    const next = Array.from({ length: particles }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      dir: ([
        { x: 0, y: -100 }, { x: 0, y: 100 },
        { x: -100, y: 0 }, { x: 100, y: 0 },
        { x: 60, y: -80 }, { x: -60, y: -80 },
        { x: 80, y: 60 }, { x: -80, y: 60 },
      ])[Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [animation, category]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-2xl select-none opacity-70"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 1, 0.2],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: baseSpeed + Math.random() * 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {chosenSet[item.id % chosenSet.length]}
        </motion.span>
      ))}
    </div>
  );
  }
