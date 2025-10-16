// lib/messages.js
// Mensajes automáticos (3 por evento) + helper por slug

export const MESSAGES_BY_EVENT = {
  christmas: [
    "May your days be merry, bright, and filled with love. 🎄✨",
    "Warm hugs, cozy lights, and joy for you and yours. 🕯️❄️",
    "Sending peace, love, and festive cheer your way. 🎁💫",
  ],
  halloween: [
    "Wishing you a spook-tacular night full of magic and candy! 👻🍬",
    "Trick or treat and lots of fun—have a chillingly good time! 🎃🕸️",
    "Boo! May your night be scary-sweet and full of laughs. 🦇🍭",
  ],
  thanksgiving: [
    "Grateful for every blessing and every smile. 🦃🍁",
    "May your heart be full and your table even fuller. 🥧🍂",
    "Thank you for being part of my life—happy Thanksgiving! 🤎🌾",
  ],
  birthday: [
    "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂",
    "May this year bring you bright moments and big smiles. ✨🎈",
    "Celebrate you—today and always! Have an amazing day. 🥳💝",
  ],
  love: [
    "Thank you for existing. Let love’s magic wrap around you today. 💖",
    "You are my favorite place to be—always. 💞🌹",
    "Every day with you is a small miracle. I love you. 💘✨",
  ],
  condolence: [
    "May peace and love comfort your heart today and always. 🕊️🤍",
    "Holding you in my thoughts—here for you in every step. 🌿",
    "In loving memory, may light guide you through. 🕯️",
  ],
  independence: [
    "Celebrate freedom and unity. Happy Independence Day! 🇺🇸🎆",
    "Stars, stripes, and smiles—have a safe and joyful day. 🌟🎇",
    "Let’s cherish liberty and hope together. 🗽✨",
  ],
  easter: [
    "Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🐣",
    "Let joy and renewal bloom within you. 🐰🌸",
    "Hope, light, and sweet moments—happy Easter! 🌷",
  ],
  newyear: [
    "A fresh start, new dreams, and endless joy. ✨🎆",
    "Here’s to health, love, and bright beginnings. 🥂🌟",
    "May this year be kind and full of wonders. 🎇💫",
  ],
  default: [
    "Celebrate this moment with a smile. Wishing you peace and light. ✨",
    "Sending a warm note to brighten your day. 🌈",
    "You’re appreciated—today and always. 💖",
  ],
};

// Mapea slug → grupo
export function defaultMessageFromSlug(slug = "") {
  const s = slug.toLowerCase();
  const map = [
    ["christmas|navidad", "christmas"],
    ["halloween", "halloween"],
    ["thanksgiving", "thanksgiving"],
    ["birthday|cumple", "birthday"],
    ["love|valentine", "love"],
    ["condolence|loss|memory|funeral", "condolence"],
    ["independence|july|usa", "independence"],
    ["easter|bunny", "easter"],
    ["newyear|year", "newyear"],
  ];
  const key =
    map.find(([re]) => new RegExp(re).test(s))?.[1] ?? "default";
  return MESSAGES_BY_EVENT[key][0]; // primer mensaje por defecto
}
