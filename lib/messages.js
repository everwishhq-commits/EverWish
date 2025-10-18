// /lib/messages.js
"use client";

/* 1️⃣ Mensajes por categoría */
const MESSAGES = {
  halloween: [
    "Have a pumpkin-tastic Halloween! 🎃",
    "Spooky vibes only 👻",
    "Wishing you a frightfully fun night! 🕸️",
  ],
  easter: [
    "Hop into happiness this Easter! 🐰",
    "Wishing you an egg-stra special day 🥚💐",
    "Bloom with joy and color this Easter 🌸",
  ],
  pets: [
    "Paws and love always 🐾❤️",
    "Furry hugs and wagging tails 🐶🐱",
    "You’re pawsome! 🦴✨",
  ],
  july4: [
    "Celebrate freedom with sparkle and pride 🇺🇸✨",
    "Stars, stripes, and smiles! 🎆",
    "Shine bright this Independence Day 🎇",
  ],
  christmas: [
    "Wishing you a joyful and bright Christmas 🎄",
    "Peace, love, and holiday cheer ✨",
    "May your season be merry and magical 🎁",
  ],
  valentines: [
    "You make my heart smile ❤️",
    "Love is in the air 💘",
    "Forever my Valentine 💞",
  ],
  birthday: [
    "Happy Birthday! 🎂✨",
    "Wishing you joy, love and lots of cake 🎉",
    "Another year of amazing adventures 🥳",
  ],
  graduation: [
    "Congrats, graduate! 🎓🌟",
    "You did it! The sky’s the limit 🎉",
    "Your hard work shines bright ✨",
  ],
  mothers: [
    "Happy Mother’s Day 🌷 You’re truly special 💖",
    "Thanks for your endless love and care 💞",
    "You are the heart of our home 🌸",
  ],
  fathers: [
    "Happy Father’s Day! 🏆",
    "To the world’s greatest dad ❤️",
    "Strong, wise, and always inspiring 💪",
  ],
  thanksgiving: [
    "Grateful for you this Thanksgiving 🦃",
    "Wishing you warmth and joy 🍂",
    "Thankful. Blessed. Loved. ❤️",
  ],
  newyear: [
    "Cheers to a bright New Year! 🎆",
    "New beginnings, new memories ✨",
    "Wishing you success and smiles in 2025 🥂",
  ],
  spring: [
    "Bloom with happiness this spring 🌸",
    "Fresh starts and sunny smiles ☀️",
    "Let joy blossom 🌼",
  ],
  anniversary: [
    "Happy Anniversary 💍",
    "Together is the best place to be ❤️",
    "Love grows stronger with time 💞",
  ],
  congrats: [
    "Congratulations! 🎉",
    "So proud of your success 🌟",
    "You did it! 👏✨",
  ],
  general: [
    "Wishing you love and light ✨",
    "Just because you deserve a smile 😊",
    "Sending warm wishes your way 💖",
  ],
};

/* 2️⃣ Resolver categoría principal igual que en animations.js */
export const getCategoryForSlug = (slug = "") => {
  const s = (slug || "").toLowerCase();
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pet") || s.includes("paw") || s.includes("pets")) return "pets";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
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

/* 3️⃣ Obtener mensaje según categoría (doble o simple) */
export const getMessageForSlug = (slug = "") => {
  const s = (slug || "").toLowerCase();
  const main = getCategoryForSlug(slug);

  // Detectar estructura tipo objeto_principal_subcategoria_1A
  const parts = s.split("_");
  const maybeSecondary = parts.length >= 3 ? parts[2] : "";

  // Verificar subcategoría válida (distinta de general)
  let secondary = null;
  if (maybeSecondary && maybeSecondary !== "general" && MESSAGES[maybeSecondary]) {
    secondary = maybeSecondary;
  }

  // Si hay subcategoría: mensaje de la subcategoría
  if (secondary) {
    const options = MESSAGES[secondary];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Si solo tiene categoría principal
  const base = MESSAGES[main] || MESSAGES.general;
  return base[Math.floor(Math.random() * base.length)];
};
