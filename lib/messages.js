// /lib/messages.js

/** Mensaje único por tarjeta (slug) */
const MAP = {
  "ghost-halloween": "Boo! You’re my favorite human to haunt. 👻💜",
  "bunny-easter": "Celebrate this moment with a smile. Wishing you peace and light. ✨",
  "birthday-celebration": "Celebrate this special day with joy, smiles, and love! 🎂🎉",
  "valentines-love": "You make my heart smile — today and always. ❤️",
  "pets-day": "To the ones who make our days brighter — our pets! ❤️",
  "usa-4th-july": "Happy 4th of July! Let freedom sparkle. 🇺🇸✨",
  "christmas-day": "Wishing you peace, joy, and cozy magic this Christmas. 🎄✨",
  "graduation-day": "You did it! The world awaits your brilliance. 🎓🌟",
  "mothers-day": "For the heart that never stops giving — Happy Mother’s Day! 💐",
  "everwish-general": "Celebrate this special moment with Everwish. ✨",
};

export function defaultMessageFromSlug(slug = "") {
  const key = Object.keys(MAP).find((k) => (slug || "").includes(k));
  return MAP[key] || MAP["everwish-general"];
}
