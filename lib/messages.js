/* 🔹 Mensaje único predefinido por tarjeta (no es default export) */
export function defaultMessageFromSlug(slug = "") {
  const s = String(slug).toLowerCase();
  const map = {
    "ghost-halloween": "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
    "bunny-easter": "Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🐇🍫",
    "birthday-celebration": "Celebrate this special day with joy, smiles, and love! 🎂🎉",
    "valentines-love": "Sending love and sparkles your way this Valentine’s Day! ❤️✨",
    "pets-day": "To the ones who make every day pawsome — our beloved pets! 🐶🐱",
    "usa-4th-july": "Happy 4th of July! Let freedom sparkle and hearts unite! 🎆🇺🇸",
    "christmas-day": "Wishing you peace, joy, and cozy magic this Christmas. 🎄✨",
    "graduation-day": "Congratulations, graduate! The world awaits your brilliance! 🎓🌟",
    "mothers-day": "For the heart that never stops giving — Happy Mother’s Day! 💐❤️",
    "everwish-general": "Celebrate this special moment with Everwish. ✨",
  };
  const found = Object.keys(map).find((k) => s.includes(k));
  return map[found] || map["everwish-general"];
}
