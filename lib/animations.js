"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ----------------------- 1) Detección de categoría ----------------------- */
export const getAnimationsForSlug = (slug = "") => {
  const s = (slug || "").toLowerCase();

  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad") || s.includes("holiday"))
    return "christmas";
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("valentines") || s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday") || s.includes("cumple")) return "birthday";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring") || s.includes("primavera")) return "spring";
  if (s.includes("summer") || s.includes("beach") || s.includes("vacation")) return "summer";
  if (s.includes("winter") || s.includes("snow") || s.includes("cold")) return "winter";
  if (s.includes("autumn") || s.includes("fall") || s.includes("harvest")) return "autumn";
  if (s.includes("travel") || s.includes("trip")) return "travel";
  if (s.includes("pets") || s.includes("dog") || s.includes("cat")) return "pets";
  if (s.includes("wedding") || s.includes("marry") || s.includes("bride") || s.includes("groom")) return "wedding";
  if (s.includes("baby") || s.includes("newborn") || s.includes("shower")) return "baby";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("getwell") || s.includes("recover") || s.includes("health")) return "getwell";
  if (s.includes("anniversary") || s.includes("anivers")) return "anniversary";
  if (s.includes("congrats") || s.includes("congrat") || s.includes("felic")) return "congrats";
  return "general";
};

/* ----------------------- 2) Opciones por categoría ----------------------- */
const OPTIONS = {
  halloween: [
    "✨ None (No Animation)",
    "Pumpkins 🎃","Ghosts 👻","Candy 🍬","Bats 🦇","Spiders 🕷️",
    "Skulls 💀","Webs 🕸️","Lanterns 🪔","Moon 🌙","Cauldrons 🧪",
    "Cats 🐈‍⬛","Zombies 🧟‍♂️","Bones 🦴","Haunted Houses 🏚️","Eyes 👁️"
  ],
  easter: [
    "✨ None (No Animation)",
    "Eggs 🥚","Bunnies 🐰","Carrots 🥕","Flowers 🌸","Spring 🌼",
    "Butterflies 🦋","Grass 🌿","Sun ☀️","Clouds ☁️","Daisies 🌼",
    "Birds 🐦","Rain ☔","Chicks 🐣","Baskets 🧺","Bees 🐝"
  ],
  july4: [
    "✨ None (No Animation)",
    "Fireworks 🎆","Sparklers 🎇","Stars ⭐","Eagles 🦅","Flags 🇺🇸",
    "Confetti 🎊","Balloons 🎈","Sparkles ✨","Lights 💡","Parade 🎉",
    "Statue 🗽","BBQ 🍔","Drinks 🍹","Guitars 🎸","Sun ☀️"
  ],
  christmas: [
    "✨ None (No Animation)",
    "Snow ❄️","Trees 🎄","Lights ✨","Gifts 🎁","Stars ⭐",
    "Bells 🔔","Candycanes 🍭","Snowflakes ❄️","Holly 🌿","Ribbons 🎀",
    "Stockings 🧦","Santa 🎅","Elves 🧝‍♂️","Cookies 🍪","Snowmen ⛄"
  ],
  valentines: [
    "✨ None (No Animation)",
    "Hearts ❤️","Roses 🌹","Kiss 💋","Rings 💍","Cupid 💘",
    "Balloons 🎈","Sparkles ✨","Doves 🕊️","Stars ⭐","Gift 🎁",
    "Chocolates 🍫","Wine 🍷","Bouquets 💐","Music 🎵","Letters 💌"
  ],
  birthday: [
    "✨ None (No Animation)",
    "Confetti 🎊","Balloons 🎈","Cake 🎂","Candles 🕯️","Gifts 🎁",
    "Party 🎉","Streamers 🎏","Stars ⭐","Hats 🎩","Sparkles ✨",
    "Cupcakes 🧁","Banners 🎀","Champagne 🍾","Friends 👯‍♀️","Music 🎶"
  ],
  mothers: [
    "✨ None (No Animation)",
    "Flowers 🌸","Hearts ❤️","Butterflies 🦋","Ribbons 🎀","Daisies 🌼",
    "Stars ⭐","Balloons 🎈","Sun ☀️","Sparkles ✨","Love 💞",
    "Tea ☕","Books 📚","Gift 🎁","Cupcake 🧁","Garden 🌷"
  ],
  fathers: [
    "✨ None (No Animation)",
    "Trophies 🏆","Stars ⭐","Hearts ❤️","Tools 🔧","Confetti 🎊",
    "Sparkles ✨","Balloons 🎈","Thumbs 👍","Ribbons 🎀","Medals 🥇",
    "Cars 🚗","BBQ 🍖","Watches ⌚","Sports ⚽","Beer 🍺"
  ],
  thanksgiving: [
    "✨ None (No Animation)",
    "Leaves 🍂","Pumpkins 🎃","Turkeys 🦃","Corn 🌽","Pies 🥧",
    "Acorns 🌰","Berries 🍇","Stars ⭐","Sparkles ✨","Hearts ❤️",
    "Family 👨‍👩‍👧‍👦","Harvest 🌾","Bread 🍞","Apple 🍎","Wine 🍷"
  ],
  newyear: [
    "✨ None (No Animation)",
    "Fireworks 🎆","Sparklers 🎇","Champagne 🍾","Clocks 🕛","Stars ⭐",
    "Confetti 🎊","Balloons 🎈","Sparkles ✨","2025 ✨","Hats 🎩",
    "Music 🎵","Cheers 🥂","Glasses 👓","Drinks 🍹","Crowds 👯‍♂️"
  ],
  spring: [
    "✨ None (No Animation)",
    "Flowers 🌸","Leaves 🍃","Butterflies 🦋","Bees 🐝","Sun ☀️",
    "Clouds ☁️","Rain ☔","Ladybugs 🐞","Daisies 🌼","Sparkles ✨",
    "Trees 🌳","Rainbow 🌈","Snails 🐌","Mushrooms 🍄","Wind 💨"
  ],
  summer: [
    "✨ None (No Animation)",
    "Sun ☀️","Beach 🏖️","Palm Trees 🌴","Shells 🐚","Ice Cream 🍦",
    "Drinks 🍹","Swim 🩱","Surf 🏄‍♂️","Waves 🌊","Sunset 🌇",
    "Flip-flops 🩴","Umbrella ☂️","Sand ⏳","Boat ⛵","Smiles 😎"
  ],
  winter: [
    "✨ None (No Animation)",
    "Snowflakes ❄️","Snowmen ⛄","Cold 🧣","Mittens 🧤","Fireplace 🔥",
    "Pine Trees 🌲","Hats 🎩","Stars ⭐","Ice Crystals 🧊","Lights ✨",
    "Ski 🎿","Cocoa ☕","Aurora 🌌","Scarf 🧣","Frost 🌫️"
  ],
  autumn: [
    "✨ None (No Animation)",
    "Leaves 🍁","Pumpkins 🎃","Acorns 🌰","Wind 💨","Mushrooms 🍄",
    "Cider 🍎","Candles 🕯️","Hats 🎩","Squirrels 🐿️","Harvest 🌾",
    "Rain ☔","Nuts 🥜","Blankets 🧣","Trees 🌳","Sunset 🌇"
  ],
  travel: [
    "✨ None (No Animation)",
    "Plane ✈️","Luggage 🧳","Passport 🪪","Map 🗺️","Camera 📸",
    "Beach 🏝️","Car 🚗","Boat ⛵","Train 🚆","Clouds ☁️",
    "Sun ☀️","Mountains 🏔️","Compass 🧭","Earth 🌍","Stars ⭐"
  ],
  pets: [
    "✨ None (No Animation)",
    "Dogs 🐶","Cats 🐱","Paws 🐾","Fish 🐟","Birds 🐦",
    "Bunnies 🐰","Bones 🦴","Hearts ❤️","Balls ⚽","Food 🍖",
    "Leash 🦮","Pet Bed 🛏️","Love 💞","Stars ⭐","Sparkles ✨"
  ],
  wedding: [
    "✨ None (No Animation)",
    "Rings 💍","Hearts ❤️","Bride 👰","Groom 🤵","Roses 🌹",
    "Bouquet 💐","Doves 🕊️","Champagne 🍾","Cake 🎂","Love 💞",
    "Sparkles ✨","Stars ⭐","Gift 🎁","Balloon 🎈","Music 🎵"
  ],
  baby: [
    "✨ None (No Animation)",
    "Bottles 🍼","Pacifiers 🧸","Hearts ❤️","Stars ⭐","Rattles 🎀",
    "Cradle 🛏️","Moon 🌙","Clouds ☁️","Sparkles ✨","Balloon 🎈",
    "Blocks 🧩","Teddy 🧸","Feet 👣","Sun ☀️","Smiles 😊"
  ],
  graduation: [
    "✨ None (No Animation)",
    "Caps 🎓","Diplomas 📜","Books 📚","Stars ⭐","Confetti 🎊",
    "Applause 👏","Trophy 🏆","Fireworks 🎆","Lights ✨","Balloon 🎈",
    "Cheers 🥂","Hands 🙌","Success 🚀","Medal 🥇","Party 🥳"
  ],
  getwell: [
    "✨ None (No Animation)",
    "Hearts ❤️","Flowers 🌸","Butterflies 🦋","Sun ☀️","Stars ⭐",
    "Tea ☕","Medicine 💊","Tissues 🧻","Hugs 🤗","Sparkles ✨",
    "Clouds ☁️","Blanket 🛌","Smile 😊","Bird 🐦","Peace ☮️"
  ],
  anniversary: [
    "✨ None (No Animation)",
    "Hearts ❤️","Rings 💍","Roses 🌹","Doves 🕊️","Wine 🍷",
    "Stars ⭐","Confetti 🎊","Balloons 🎈","Sparkles ✨","Love 💞",
    "Dinner 🍽️","Candles 🕯️","Music 🎶","Gift 🎁","Couple 💑"
  ],
  congrats: [
    "✨ None (No Animation)",
    "Confetti 🎊","Fireworks 🎆","Stars ⭐","Thumbs 👍","Medals 🥇",
    "Trophy 🏆","Balloons 🎈","Ribbons 🎀","Party 🥳","Sparkles ✨",
    "Applause 👏","Gold ✨","Smiles 😄","Success 🚀","Crown 👑"
  ],
  general: [
    "✨ None (No Animation)",
    "Sparkles ✨","Stars ⭐","Hearts ❤️","Confetti 🎊","Balloons 🎈",
    "Flowers 🌸","Butterflies 🦋","Leaves 🍃","Sun ☀️","Clouds ☁️",
    "Rain ☔","Rainbow 🌈","Music 🎶","Peace ☮️","Globe 🌍"
  ],
};

/* ----------------------- 3) Lógica principal ----------------------- */
export const getAnimationOptionsForSlug = (slug = "") => {
  if (!slug) return OPTIONS.general;
  const parts = slug.toLowerCase().split("_");
  const categoriesFound = parts
    .map((p) => getAnimationsForSlug(p))
    .filter((c) => c && c !== "general");
  const main = categoriesFound[0] || "general";
  const sub = categoriesFound[1] || null;
  const mainSet = OPTIONS[main] || OPTIONS.general;
  const subSet = sub ? (OPTIONS[sub] || []) : [];
  const others = Object.keys(OPTIONS)
    .filter((key) => key !== main && key !== sub)
    .flatMap((key) => OPTIONS[key].slice(1));
  const all = [mainSet[0], ...mainSet.slice(1), ...subSet.slice(1), ...others];
  const unique = [...new Set(all)];
  return unique;
};

/* ----------------------- 4) Overlay ----------------------- */
export function AnimationOverlay({ slug, animation }) {
  if (!animation || animation.startsWith("✨ None")) return null;

  const emoji = animation.match(/[\p{Emoji}\u200d]+/gu)?.[0] || "✨";
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
  }, [slug, animation]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: 9999999, // 🔝 asegura que los emojis estén por encima de todo
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="absolute select-none"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: `${18 + Math.random() * 18}px`,
            opacity: 0.8,
            zIndex: 9999999, // refuerzo por si hay overlays superiores
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
          {emoji}
        </motion.span>
      ))}
    </div>
  );
    }
