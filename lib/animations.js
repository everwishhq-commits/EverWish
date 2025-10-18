"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* -----------------------
 *  CATEGORÍAS POR SLUG
 * ----------------------*/
const slugToCategory = (slug = "") => {
  const s = (slug || "").toLowerCase();

  // Detección refinada: prioriza palabras temáticas sobre genéricas
  if (s.includes("halloween") || s.includes("ghost") || s.includes("zombie") || s.includes("pumpkin")) return "halloween";
  if (s.includes("easter") || s.includes("bunny")) return "easter";
  if (s.includes("pet") || s.includes("paw") || s.includes("pets")) return "pets";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("valentine") || s.includes("love") || s.includes("heart")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mother")) return "mothers";
  if (s.includes("father")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring")) return "spring";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("congrats")) return "congrats";
  return "general";
};

/* -----------------------------------------
 *  OPCIONES POR CATEGORÍA (DROPDOWN)
 * ----------------------------------------*/
const OPTIONS = {
  halloween: ["Pumpkins 🎃","Ghosts 👻","Candy 🍬","Bats 🦇","Spiders 🕷️","Moon 🌙","Fog 🌫️","Stars ✨","Sparkles ✨","Zombies 🧟"],
  easter: ["Eggs 🥚","Bunnies 🐰","Carrots 🥕","Flowers 🌸","Spring 🌼","Butterflies 🦋","Grass 🌿","Sun ☀️","Daisies 🌼","Sparkles ✨"],
  pets: ["Paw Prints 🐾","Hearts ❤️","Bones 🦴","Balls 🎾","Fish 🐟","Stars ✨","Sparkles ✨","Butterflies 🦋","Clouds ☁️","Sun ☀️"],
  july4: ["Fireworks 🎆","Sparklers 🎇","Stars ⭐","Eagles 🦅","Flags 🇺🇸","Confetti 🎊","Balloons 🎈","Sparkles ✨","Rays ☀️","Hearts ❤️"],
  christmas: ["Snow ❄️","Trees 🎄","Lights ✨","Gifts 🎁","Stars ⭐","Bells 🔔","Candycanes 🍭","Snowflakes ❄️","Sparkles ✨","Holly 🌿"],
  valentines: ["Hearts ❤️","Roses 🌹","Sparkles ✨","Kiss 💋","Ribbons 🎀","Love 💞","Arrows 💘","Stars ⭐","Balloons 🎈","Confetti 🎊"],
  birthday: ["Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Stars ⭐","Gifts 🎁","Sparkles ✨","Party 🥳","Streamers 🎉","Hearts ❤️"],
  graduation: ["Caps 🎓","Stars ⭐","Confetti 🎊","Scrolls 📜","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Fireworks 🎆","Thumbs 👍","Medals 🥇"],
  mothers: ["Flowers 🌸","Hearts ❤️","Sparkles ✨","Butterflies 🦋","Ribbons 🎀","Daisies 🌼","Stars ⭐","Balloons 🎈","Sun ☀️","Love 💞"],
  fathers: ["Trophies 🏆","Stars ⭐","Hearts ❤️","Tools 🔧","Confetti 🎊","Sparkles ✨","Balloons 🎈","Thumbs 👍","Ribbons 🎀","Medals 🥇"],
  thanksgiving: ["Leaves 🍂","Pumpkins 🎃","Turkeys 🦃","Corn 🌽","Pies 🥧","Stars ⭐","Sparkles ✨","Hearts ❤️","Acorns 🌰","Berries 🍇"],
  newyear: ["Fireworks 🎆","Sparklers 🎇","Champagne 🍾","Stars ⭐","Clocks 🕛","Confetti 🎊","Balloons 🎈","Sparkles ✨","2025 ✨","Hearts ❤️"],
  spring: ["Flowers 🌸","Leaves 🍃","Butterflies 🦋","Bees 🐝","Sun ☀️","Clouds ☁️","Rain ☔","Sparkles ✨","Daisies 🌼","Ladybugs 🐞"],
  anniversary: ["Hearts ❤️","Rings 💍","Roses 🌹","Sparkles ✨","Stars ⭐","Wine 🍷","Confetti 🎊","Balloons 🎈","Love 💞","Doves 🕊️"],
  congrats: ["Confetti 🎊","Fireworks 🎆","Stars ⭐","Thumbs 👍","Medals 🥇","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Trophy 🏆","Party 🥳"],
  general: ["Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈","Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️"],
};

export const getAnimationsForSlug = (slug) => slugToCategory(slug);
export const getAnimationOptionsForSlug = (slug) => {
  const cat = slugToCategory(slug);
  return OPTIONS[cat] || OPTIONS.general;
};

/* --------------------------
 *  EXTRAER EMOJI PRINCIPAL
 * --------------------------*/
const extractEmoji = (text = "") => {
  const emoji = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
  return emoji ? emoji[0] : "✨";
};

/* --------------------------------
 *  OVERLAY DE ANIMACIONES
 * --------------------------------*/
export function AnimationOverlay({ slug, animation }) {
  const category = useMemo(() => slugToCategory(slug), [slug]);
  const emoji = extractEmoji(animation);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const next = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dir: [
        { x: 0, y: -120 }, { x: 0, y: 120 },
        { x: -120, y: 0 }, { x: 120, y: 0 },
        { x: 70, y: -90 }, { x: -70, y: -90 },
        { x: 90, y: 70 }, { x: -90, y: 70 },
      ][Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [animation, category]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden mix-blend-overlay">
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
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 7 + Math.random() * 3, // 🔥 Más rápido
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
             }
