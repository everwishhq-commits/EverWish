"use client";

import { AnimationOverlay } from "@/lib/animationoverlay";

/* 🎨 Sub-animaciones por categoría */
const animationCategories = {
  easter: {
    default: ["🌷"],
    options: {
      "Flowers 🌸": ["🌷", "🌼", "🌸"],
      "Bunnies 🐰": ["🐰"],
      "Eggs 🥚": ["🥚"],
      "Chicks 🐣": ["🐣"],
      "Butterflies 🦋": ["🦋"],
      "Grass 🌿": ["🌿"],
      "Sun ☀️": ["☀️"],
      "Clouds ☁️": ["☁️"],
      "Carrots 🥕": ["🥕"],
      "Basket 🧺": ["🧺"],
    },
  },
  halloween: {
    default: ["🎃"],
    options: {
      "Pumpkins 🎃": ["🎃"],
      "Ghosts 👻": ["👻"],
      "Candies 🍬": ["🍬"],
      "Bats 🦇": ["🦇"],
      "Skulls 💀": ["💀"],
      "Spiders 🕷️": ["🕷️"],
      "Webs 🕸️": ["🕸️"],
      "Bones 🦴": ["🦴"],
      "Lanterns 🪔": ["🪔"],
      "Moons 🌙": ["🌙"],
    },
  },
  july4: {
    default: ["🎆"],
    options: {
      "Fireworks 🎆": ["🎆"],
      "Flags 🇺🇸": ["🇺🇸"],
      "Stars ⭐": ["⭐"],
      "Eagles 🦅": ["🦅"],
      "Hearts ❤️": ["❤️"],
      "Balloons 🎈": ["🎈"],
      "Sparkles ✨": ["✨"],
      "Lights 💡": ["💡"],
      "Parade 🎉": ["🎉"],
      "Confetti 🎊": ["🎊"],
    },
  },
  animals: {
    default: ["🐾"],
    options: {
      "Paws 🐾": ["🐾"],
      "Dogs 🐶": ["🐶"],
      "Cats 🐱": ["🐱"],
      "Bones 🦴": ["🦴"],
      "Balls 🎾": ["🎾"],
      "Fish 🐟": ["🐟"],
      "Birds 🐦": ["🐦"],
      "Hearts ❤️": ["❤️"],
      "Bowls 🥣": ["🥣"],
      "Stars ✨": ["✨"],
    },
  },
  love: {
    default: ["💖"],
    options: {
      "Hearts ❤️": ["❤️"],
      "Kisses 💋": ["💋"],
      "Roses 🌹": ["🌹"],
      "Rings 💍": ["💍"],
      "Cupid 🏹": ["🏹"],
      "Stars ✨": ["✨"],
      "Balloons 🎈": ["🎈"],
      "Gifts 🎁": ["🎁"],
      "Doves 🕊️": ["🕊️"],
      "Music 🎶": ["🎶"],
    },
  },
  default: {
    default: ["✨"],
    options: {
      "Stars ✨": ["✨"],
      "Moons 🌙": ["🌙"],
      "Clouds ☁️": ["☁️"],
      "Lights 💡": ["💡"],
      "Dreams 🌈": ["🌈"],
    },
  },
};

/* 🔹 Detecta categoría según slug */
export function getAnimationsForSlug(slug) {
  slug = slug.toLowerCase();
  if (slug.includes("easter")) return "easter";
  if (slug.includes("halloween") || slug.includes("ghost")) return "halloween";
  if (slug.includes("july") || slug.includes("4th")) return "july4";
  if (slug.includes("animal") || slug.includes("pet")) return "animals";
  if (slug.includes("love") || slug.includes("heart")) return "love";
  return "default";
}

/* 🔻 Devuelve todas las opciones para el dropdown */
export function getAnimationOptionsForSlug(slug) {
  const category = getAnimationsForSlug(slug);
  const categoryData = animationCategories[category];
  return Object.keys(categoryData.options);
}

/* 🌟 Export principal */
export { AnimationOverlay };
