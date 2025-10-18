"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* -----------------------
 * CATEGORÍAS POR SLUG
 * ----------------------*/
const slugToCategory = (slug = "") => {
  const s = (slug || "").toLowerCase();

  // 🧠 Palabras que son de mensaje (no cambian la categoría)
  const neutralWords = ["birthday", "celebrating", "celebration", "cumple", "cumpleaños", "party"];
  const isNeutral = neutralWords.some((w) => s.includes(w));

  // 🎃 Halloween tiene prioridad absoluta
  if (s.includes("halloween") || s.includes("ghost") || s.includes("zombie") || s.includes("pumpkin") || s.includes("spooky"))
    return "halloween";

  // 🐣 Otras categorías normales (solo si no es un mensaje neutral)
  if (!isNeutral) {
    if (s.includes("easter") || s.includes("bunny") || s.includes("egg")) return "easter";
    if (s.includes("pet") || s.includes("paw") || s.includes("dog") || s.includes("cat")) return "pets";
    if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
    if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad") || s.includes("santa")) return "christmas";
    if (s.includes("valentine") || s.includes("love") || s.includes("heart")) return "valentines";
    if (s.includes("graduation") || s.includes("graduate")) return "graduation";
    if (s.includes("mother")) return "mothers";
    if (s.includes("father")) return "fathers";
    if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
    if (s.includes("newyear") || s.includes("new-year")) return "newyear";
    if (s.includes("spring") || s.includes("flower")) return "spring";
    if (s.includes("anniversary") || s.includes("rings")) return "anniversary";
    if (s.includes("congrats")) return "congrats";
  }

  // Si dice "general" o nada específico → usar Halloween por temporada
  if (s.includes("general") || s.trim() === "") return "halloween";

  // Fallback por defecto
  return "general";
};

/* -----------------------------------------
 * OPCIONES POR CATEGORÍA (DROPDOWN)
 * ----------------------------------------*/
const OPTIONS = {
  halloween: ["Pumpkins 🎃","Ghosts 👻","Candy 🍬","Bats 🦇","Spiders 🕷️","Witches 🧙‍♀️","Skulls 💀","Fog 🌫️","Moon 🌙","Zombies 🧟"],
  easter: ["Eggs 🥚","Bunnies 🐰","Carrots 🥕","Flowers 🌸","Spring 🌼","Butterflies 🦋","Chicks 🐣","Baskets 🧺","Grass 🌿","Sun ☀️"],
  pets: ["Paw Prints 🐾","Hearts ❤️","Bones 🦴","Balls 🎾","Fish 🐟","Dog 🐶","Cat 🐱","Stars ✨","Butterflies 🦋","Sun ☀️"],
  july4: ["Fireworks 🎆","Sparklers 🎇","Stars ⭐","Eagles 🦅","Flags 🇺🇸","Confetti 🎊","Balloons 🎈","Drums 🥁","Statue 🗽","Rays ☀️"],
  christmas: ["Snow ❄️","Santa 🎅","Tree 🎄","Lights ✨","Gifts 🎁","Bells 🔔","Snowman ⛄","Candycanes 🍭","Stars ⭐","Holly 🌿"],
  valentines: ["Hearts ❤️","Roses 🌹","Sparkles ✨","Kiss 💋","Ribbons 🎀","Love 💞","Arrows 💘","Teddy 🧸","Chocolate 🍫","Cupid 🪽"],
  birthday: ["Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Stars ⭐","Gifts 🎁","Sparkles ✨","Party 🥳","Streamers 🎉","Cupcake 🧁"],
  graduation: ["Caps 🎓","Stars ⭐","Confetti 🎊","Scrolls 📜","Books 📚","Medals 🥇","Thumbs 👍","Balloons 🎈","Fireworks 🎆","Pencils ✏️"],
  mothers: ["Flowers 🌸","Hearts ❤️","Butterflies 🦋","Ribbons 🎀","Daisies 🌼","Tea ☕","Sun ☀️","Love 💞","Gift 🎁","Sparkles ✨"],
  fathers: ["Trophies 🏆","Stars ⭐","Hearts ❤️","Tools 🔧","Cars 🚗","Glasses 🕶️","Balloons 🎈","Thumbs 👍","Ribbons 🎀","Medals 🥇"],
  thanksgiving: ["Leaves 🍂","Pumpkins 🎃","Turkeys 🦃","Corn 🌽","Pies 🥧","Acorns 🌰","Cranberries 🍒","Stars ⭐","Apples 🍎","Baskets 🧺"],
  newyear: ["Fireworks 🎆","Sparklers 🎇","Champagne 🍾","Clocks 🕛","Party 🎉","Masks 🎭","Confetti 🎊","Balloons 🎈","2025 ✨","Hearts ❤️"],
  spring: ["Flowers 🌸","Leaves 🍃","Butterflies 🦋","Bees 🐝","Sun ☀️","Rain ☔","Clouds ☁️","Ladybugs 🐞","Tulips 🌷","Grass 🌿"],
  anniversary: ["Hearts ❤️","Rings 💍","Roses 🌹","Wine 🍷","Dinner 🍽️","Stars ⭐","Love 💞","Confetti 🎊","Kiss 💋","Balloons 🎈"],
  congrats: ["Confetti 🎊","Fireworks 🎆","Stars ⭐","Thumbs 👍","Medals 🥇","Sparkles ✨","Balloons 🎈","Ribbons 🎀","Trophy 🏆","Cheers 🥂"],
  general: ["Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈","Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️"],
};

export const getAnimationsForSlug = (slug) => slugToCategory(slug);
export const getAnimationOptionsForSlug = (slug) => {
  const cat = slugToCategory(slug);
  return OPTIONS[cat] || OPTIONS.general;
};

/* --------------------------
 * EXTRAER EMOJI PRINCIPAL
 * --------------------------*/
const extractEmoji = (text = "") => {
  const emoji = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
  return emoji ? emoji[0] : "✨";
};

/* --------------------------------
 * OVERLAY DE ANIMACIONES
 * --------------------------------*/
export function AnimationOverlay({ slug, animation }) {
  const category = useMemo(() => slugToCategory(slug), [slug]);
  const emoji = extractEmoji(animation);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const next = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2.5,
      dir: [
        { x: 0, y: -150 }, { x: 0, y: 150 },
        { x: -150, y: 0 }, { x: 150, y: 0 },
        { x: 90, y: -110 }, { x: -90, y: -110 },
        { x: 110, y: 90 }, { x: -110, y: 90 },
      ][Math.floor(Math.random() * 8)],
    }));
    setItems(next);
  }, [animation, category]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden mix-blend-overlay">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-3xl select-none opacity-90"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.5, 1, 0.3],
            x: item.dir.x,
            y: item.dir.y,
            scale: [0.8, 1.5, 0.9],
            rotate: [0, 25, -25, 0],
          }}
          transition={{
            duration: 4.5 + Math.random() * 2.5, // ⚡ más rápido
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
