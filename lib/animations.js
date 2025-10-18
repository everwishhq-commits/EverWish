// /lib/animations.js
"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/** 🗂️ Catálogo de sub-animaciones (10 por categoría) */
const CATALOG = {
  easter: [
    "Flowers 🌸","Bunnies 🐰","Eggs 🥚","Chicks 🐣","Butterflies 🦋",
    "Grass 🌿","Sun ☀️","Clouds ☁️","Carrots 🥕","Basket 🧺",
  ],
  halloween: [
    "Pumpkins 🎃","Ghosts 👻","Candies 🍬","Bats 🦇","Skulls 💀",
    "Spiders 🕷️","Webs 🕸️","Bones 🦴","Lanterns 🪔","Moons 🌙",
  ],
  july4: [
    "Fireworks 🎆","Flags 🇺🇸","Stars ⭐","Eagles 🦅","Hearts ❤️",
    "Balloons 🎈","Sparkles ✨","Lights 💡","Parade 🎉","Confetti 🎊",
  ],
  animals: [
    "Paw Prints 🐾","Dogs 🐶","Cats 🐱","Bones 🦴","Balls 🎾",
    "Fish 🐟","Birds 🐦","Hearts ❤️","Bowls 🥣","Stars ✨",
  ],
  love: [
    "Hearts ❤️","Kisses 💋","Roses 🌹","Rings 💍","Cupid 🏹",
    "Stars ✨","Balloons 🎈","Gifts 🎁","Doves 🕊️","Music 🎶",
  ],
  default: [
    "Stars ✨","Moons 🌙","Clouds ☁️","Lights 💡","Dreams 🌈",
    "Sparkles ✨","Hearts ❤️","Balloons 🎈","Doves 🕊️","Gifts 🎁",
  ],
};

/** 🔎 slug -> categoría */
export function getAnimationsForSlug(slug = "") {
  const s = (slug || "").toLowerCase();
  if (s.includes("easter")) return "easter";
  if (s.includes("halloween") || s.includes("ghost")) return "halloween";
  if (s.includes("july") || s.includes("4th")) return "july4";
  if (s.includes("animal") || s.includes("pet")) return "animals";
  if (s.includes("love") || s.includes("valentine")) return "love";
  return "default";
}

/** 📋 opciones visibles del dropdown (10) */
export function getAnimationOptionsForSlug(slug) {
  const cat = getAnimationsForSlug(slug);
  return CATALOG[cat] || CATALOG.default;
}

/** 🎭 mapea opción → set de emojis coherente */
function optionToEmojis(optionLabel) {
  const key = optionLabel?.toLowerCase() || "";
  if (key.includes("bunn")) return ["🐰","🐇","🥕","🌸"];
  if (key.includes("egg")) return ["🥚","🌸","🐣"];
  if (key.includes("chick")) return ["🐣","🌼","🌷"];
  if (key.includes("butterf")) return ["🦋","🌸"];
  if (key.includes("grass")) return ["🌿","🌱"];
  if (key.includes("sun")) return ["☀️","✨"];
  if (key.includes("cloud")) return ["☁️","🌤️"];
  if (key.includes("carrot")) return ["🥕","🌿"];

  if (key.includes("pumpkin")) return ["🎃","🕸️"];
  if (key.includes("ghost")) return ["👻","✨"];
  if (key.includes("candie")||key.includes("candy")) return ["🍬","🍭"];
  if (key.includes("bat")) return ["🦇","🌙"];
  if (key.includes("skull")) return ["💀","🕯️"];
  if (key.includes("spider")) return ["🕷️","🕸️"];
  if (key.includes("web")) return ["🕸️","🕷️"];
  if (key.includes("bone")) return ["🦴","💀"];
  if (key.includes("lantern")) return ["🪔","✨"];
  if (key.includes("moon")) return ["🌙","✨"];

  if (key.includes("firework")) return ["🎆","🎇","✨"];
  if (key.includes("flag")) return ["🇺🇸","⭐"];
  if (key.includes("star")) return ["⭐","✨"];
  if (key.includes("eagle")) return ["🦅","⭐"];
  if (key.includes("balloon")) return ["🎈","✨"];
  if (key.includes("sparkle")) return ["✨","⭐"];
  if (key.includes("light")) return ["💡","✨"];
  if (key.includes("parade")||key.includes("confetti")) return ["🎉","🎊"];

  if (key.includes("paw")) return ["🐾","🐾","🐾"];
  if (key.includes("dog")) return ["🐶","🐾"];
  if (key.includes("cat")) return ["🐱","🐾"];
  if (key.includes("fish")) return ["🐟","💧"];
  if (key.includes("bird")) return ["🐦","✨"];
  if (key.includes("bowl")) return ["🥣","🐾"];

  if (key.includes("heart")) return ["❤️","💖","💘"];
  if (key.includes("kiss")) return ["💋","💖"];
  if (key.includes("rose")) return ["🌹","💖"];
  if (key.includes("ring")) return ["💍","💖"];
  if (key.includes("cupid")) return ["🏹","💘"];
  if (key.includes("dove")) return ["🕊️","💖"];
  if (key.includes("music")) return ["🎶","💖"];

  // genérico
  return ["✨","⭐","🌟"];
}

/** ✨ Overlay de partículas (arranca YA y cambia rápido) */
export function AnimationOverlay({ slug, animation }) {
  const [items, setItems] = useState([]);
  const emojis = useMemo(() => optionToEmojis(animation), [animation]);

  // fuerza remount al cambiar opción → cambio inmediato
  const key = useMemo(() => `${slug}-${animation}`, [slug, animation]);

  useEffect(() => {
    const total = 18;
    const list = Array.from({ length: total }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 110 + Math.random() * 40, // arranca fuera de pantalla para evitar "pop"
      delay: Math.random() * 0.4,  // aparición rápida
      dur: 16 + Math.random() * 8, // lento y suave
      size: 18 + Math.random() * 14,
      rot: Math.random() * 20 - 10,
      emoji: emojis[i % emojis.length],
    }));
    setItems(list);
  }, [key, emojis]);

  return (
    <div key={key} className="pointer-events-none fixed inset-0 z-[300] overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, top: `${p.y}vh`, fontSize: p.size }}
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{
            opacity: [0.2, 0.8, 0.3],
            y: ["0vh", "-130vh"],
            rotate: [0, p.rot, -p.rot, 0],
            scale: [0.9, 1, 0.95],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
    }
