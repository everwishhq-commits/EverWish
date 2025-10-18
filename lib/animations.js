"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* --- 1) Resolver categoría desde slug --- */
export const getAnimationsForSlug = (slug = "") => {
  const s = (slug || "").toLowerCase();
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pet") || s.includes("paw")) return "pets";
  if (s.includes("usa") || s.includes("july4")) return "july4";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("valentine")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring")) return "spring";
  if (s.includes("anniversary") || s.includes("anivers")) return "anniversary";
  if (s.includes("congrats")) return "congrats";
  return "general";
};

/* --- 2) Opciones por categoría --- */
const OPTIONS = {
  easter: ["✨ None (No Animation)", "Eggs 🥚", "Bunnies 🐰", "Carrots 🥕", "Flowers 🌸", "Spring 🌼", "Butterflies 🦋", "Grass 🌿", "Sun ☀️", "Clouds ☁️", "Daisies 🌼"],
  halloween: ["✨ None (No Animation)", "Pumpkins 🎃", "Ghosts 👻", "Candy 🍬", "Bats 🦇", "Spiders 🕷️", "Skulls 💀", "Webs 🕸️", "Lanterns 🪔", "Moon 🌙", "Stars ✨"],
  birthday: ["✨ None (No Animation)", "Confetti 🎊", "Balloons 🎈", "Cake 🎂", "Candles 🕯️", "Gifts 🎁", "Party 🎉", "Streamers 🎏", "Stars ⭐", "Hats 🎩", "Sparkles ✨"],
  mothers: ["✨ None (No Animation)", "Flowers 🌸", "Hearts ❤️", "Butterflies 🦋", "Ribbons 🎀", "Daisies 🌼", "Stars ⭐", "Balloons 🎈", "Sun ☀️", "Sparkles ✨", "Love 💞"],
  fathers: ["✨ None (No Animation)", "Trophies 🏆", "Stars ⭐", "Hearts ❤️", "Tools 🔧", "Confetti 🎊", "Sparkles ✨", "Balloons 🎈", "Thumbs 👍", "Ribbons 🎀", "Medals 🥇"],
  general: ["✨ None (No Animation)", "Sparkles ✨", "Stars ⭐", "Hearts ❤️", "Confetti 🎊", "Balloons 🎈", "Flowers 🌸", "Butterflies 🦋", "Leaves 🍃", "Sun ☀️", "Clouds ☁️"],
};

/* --- 3) Emojis asociados --- */
const OPTION_EMOJIS = {
  easter: { "Eggs 🥚": ["🥚"], "Bunnies 🐰": ["🐰"], "Carrots 🥕": ["🥕"], "Flowers 🌸": ["🌸"], "Spring 🌼": ["🌼"], "Butterflies 🦋": ["🦋"], "Grass 🌿": ["🌿"], "Sun ☀️": ["☀️"], "Clouds ☁️": ["☁️"], "Daisies 🌼": ["🌼"] },
  halloween: { "Pumpkins 🎃": ["🎃"], "Ghosts 👻": ["👻"], "Candy 🍬": ["🍬"], "Bats 🦇": ["🦇"], "Spiders 🕷️": ["🕷️"], "Skulls 💀": ["💀"], "Webs 🕸️": ["🕸️"], "Lanterns 🪔": ["🪔"], "Moon 🌙": ["🌙"], "Stars ✨": ["✨"] },
  birthday: { "Confetti 🎊": ["🎊"], "Balloons 🎈": ["🎈"], "Cake 🎂": ["🎂"], "Candles 🕯️": ["🕯️"], "Gifts 🎁": ["🎁"], "Party 🎉": ["🎉"], "Streamers 🎏": ["🎏"], "Stars ⭐": ["⭐"], "Hats 🎩": ["🎩"], "Sparkles ✨": ["✨"] },
  mothers: { "Flowers 🌸": ["🌸"], "Hearts ❤️": ["❤️"], "Butterflies 🦋": ["🦋"], "Ribbons 🎀": ["🎀"], "Daisies 🌼": ["🌼"], "Stars ⭐": ["⭐"], "Balloons 🎈": ["🎈"], "Sun ☀️": ["☀️"], "Sparkles ✨": ["✨"], "Love 💞": ["💞"] },
  fathers: { "Trophies 🏆": ["🏆"], "Stars ⭐": ["⭐"], "Hearts ❤️": ["❤️"], "Tools 🔧": ["🔧"], "Confetti 🎊": ["🎊"], "Sparkles ✨": ["✨"], "Balloons 🎈": ["🎈"], "Thumbs 👍": ["👍"], "Ribbons 🎀": ["🎀"], "Medals 🥇": ["🥇"] },
  general: { "Sparkles ✨": ["✨"], "Stars ⭐": ["⭐"], "Hearts ❤️": ["❤️"], "Confetti 🎊": ["🎊"], "Balloons 🎈": ["🎈"], "Flowers 🌸": ["🌸"], "Butterflies 🦋": ["🦋"], "Leaves 🍃": ["🍃"], "Sun ☀️": ["☀️"], "Clouds ☁️": ["☁️"] },
};

/* --- 4) Mezcla de categorías si el slug tiene formato compuesto --- */
export const getAnimationOptionsForSlug = (slug = "") => {
  const s = slug.toLowerCase();
  const parts = s.split("_");
  if (parts.length >= 3) {
    const main = getAnimationsForSlug(parts[1]);
    const sub = getAnimationsForSlug(parts[2]);
    const base1 = OPTIONS[main] || OPTIONS.general;
    const base2 = OPTIONS[sub] || OPTIONS.general;
    const mixed = [base1[0], ...base1.slice(1, 6), ...base2.slice(1, 6)];
    return mixed.slice(0, 11);
  }
  const cat = getAnimationsForSlug(slug);
  return OPTIONS[cat] || OPTIONS.general;
};

/* --- 5) Overlay --- */
export function AnimationOverlay({ slug, animation }) {
  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);

  if (!animation || animation.startsWith("✨ None")) return null;

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
      dir: [{ x: 0, y: -110 }, { x: 0, y: 110 }, { x: -110, y: 0 }, { x: 110, y: 0 }][Math.floor(Math.random() * 4)],
      scale: 0.8 + Math.random() * 0.6,
    }));
    setItems(arr);
  }, [animation, category]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="absolute select-none"
          style={{ left: `${it.x}%`, top: `${it.y}%`, fontSize: `${18 + Math.random() * 18}px`, opacity: 0.75 }}
          initial={{ opacity: 0, scale: it.scale * 0.9 }}
          animate={{
            opacity: [0.4, 1, 0.35],
            x: it.dir.x,
            y: it.dir.y,
            scale: [it.scale, it.scale * 1.15, it.scale * 0.95],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: it.dur, repeat: Infinity, delay: it.delay, ease: "easeInOut" }}
        >
          {emojis[it.id % emojis.length]}
        </motion.span>
      ))}
    </div>
  );
    }
