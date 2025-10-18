// /lib/messages.js
// ⛳️ Mensajes predeterminados y sugerencias por categoría de tarjeta.
// Importación:  import { defaultMessageFromSlug, getMessagesForSlug } from "@/lib/messages";

const MAP_DEFAULT = "everwish-general";

// 🔖 Diccionario: slug-clave -> mensaje por defecto
const defaultMap = {
  "ghost-halloween": "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
  "bunny-easter": "Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🐇🍫",
  "birthday-celebration": "Celebrate this special day with joy, smiles, and love! 🎂🎉",
  "valentines-love": "Sending love and sparkles your way this Valentine’s Day! ❤️✨",
  "pets-day": "To the ones who make every day pawsome — our beloved pets! 🐶🐱",
  "usa-4th-july": "Happy 4th of July! Let freedom sparkle and hearts unite! 🎆🇺🇸",
  "christmas-day": "Wishing you peace, joy, and cozy magic this Christmas. 🎄✨",
  "graduation-day": "Congratulations, graduate! The world awaits your brilliance! 🎓🌟",
  "mothers-day": "For the heart that never stops giving — Happy Mother’s Day! 💐❤️",
  "thanksgiving-day": "Grateful for you — Happy Thanksgiving! 🦃🍂",
  "newyear-day": "Cheers to a bright and hopeful New Year! ✨🎉",
  "everwish-general": "Celebrate this special moment with Everwish. ✨",
};

// 🧺 Sugerencias (3 por categoría)
const sets = {
  "ghost-halloween": [
    "🎃 Have a frightfully fun Halloween full of treats and laughter! 👻",
    "🕸️ Wishing you a magical night of pumpkins, ghosts, and giggles!",
    "👻 Boo! May your Halloween be spooky, silly, and sweet!",
  ],
  "bunny-easter": [
    "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🍫",
    "🌷 May your Easter basket overflow with love and happiness!",
    "🐣 Hop into joy — Easter is here to bring peace and smiles!",
  ],
  "birthday-celebration": [
    "🎉 Celebrate your special day with love, laughter, and endless joy!",
    "🎂 Another year older, wiser, and more wonderful — happy birthday!",
    "💫 May your day sparkle brighter than the candles on your cake!",
  ],
  "valentines-love": [
    "❤️ You make my heart smile — Happy Valentine’s Day!",
    "💌 Love, hugs, and sparkles sent your way today and always. ✨",
    "💖 Every heartbeat says your name — forever my Valentine!",
  ],
  "pets-day": [
    "🐾 To the furry friends who fill our hearts with love — Happy Pet Day!",
    "🐕 You make every day pawsome! Thanks for all the tail wags!",
    "🐾 Because life’s better with paws, purrs, and love!",
  ],
  "usa-4th-july": [
    "🎆 Celebrate freedom, unity, and the stars that shine bright! 🇺🇸",
    "🦅 Let your heart soar high this Independence Day!",
    "💥 Fireworks, fun, and freedom — that’s the American way!",
  ],
  "christmas-day": [
    "🎄 Wishing you a Christmas filled with warmth, joy, and wonder!",
    "❄️ May the magic of the season fill your home with happiness.",
    "🎁 Merry Christmas! Peace, love, and laughter always.",
  ],
  "graduation-day": [
    "🎓 You did it! Celebrate your success and shine bright! 🌟",
    "📜 Hats off to you — the best is yet to come!",
    "🎉 Congratulations on your amazing achievement — the world is yours!",
  ],
  "mothers-day": [
    "💐 To the woman who makes life beautiful — Happy Mother’s Day!",
    "🌷 Your love blooms in every smile — thank you, Mom!",
    "❤️ The world shines brighter because of mothers like you!",
  ],
  "thanksgiving-day": [
    "🦃 Grateful for you — Happy Thanksgiving! 🍂",
    "🍁 May your heart and table be full this Thanksgiving.",
    "🥧 Sending cozy vibes, gratitude, and lots of pie!",
  ],
  "newyear-day": [
    "✨ Here’s to fresh starts and big dreams — Happy New Year!",
    "🎉 Wishing you joy, health, and bright adventures ahead.",
    "⭐ New year, new chapters — you’ve got this!",
  ],
  "everwish-general": [
    "✨ Celebrate this special moment with Everwish — full of joy and light!",
    "🌸 Every day is a reason to smile — make it magical!",
    "💫 Send a wish, share a smile, and spread a little love!",
  ],
};

// 🔍 Resolver categoría desde el slug recibido en /edit/[slug]
function resolveKey(slug = "") {
  const s = String(slug).toLowerCase();
  const keys = Object.keys(defaultMap);
  const found = keys.find((k) => s.includes(k));
  return found || MAP_DEFAULT;
}

// ✅ Mensaje por defecto para llenar el textarea al abrir el editor
export function defaultMessageFromSlug(slug) {
  const key = resolveKey(slug);
  return defaultMap[key] || defaultMap[MAP_DEFAULT];
}

// ✅ 3 sugerencias por categoría (chips)
export function getMessagesForSlug(slug) {
  const key = resolveKey(slug);
  return sets[key] || sets[MAP_DEFAULT];
}
