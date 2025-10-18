// /lib/messages.js

/** Tres mensajes por categoría; devolvemos UNO aleatorio por carga */
const SETS = {
  halloween: [
    "🎃 Have a frightfully fun Halloween full of treats and laughter! 👻",
    "🕸️ Wishing you a magical night of pumpkins, ghosts, and giggles!",
    "👻 Boo! May your Halloween be spooky, silly, and sweet!",
  ],
  easter: [
    "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🍫",
    "🌷 May your Easter basket overflow with love and happiness!",
    "🐣 Hop into joy — Easter is here to bring peace and smiles!",
  ],
  pets: [
    "🐾 To the furry friends who fill our hearts with love — Happy Pet Day!",
    "🐕 You make every day pawsome! Thanks for all the tail wags!",
    "🐾 Because life’s better with paws, purrs, and love!",
  ],
  july4: [
    "🎆 Celebrate freedom, unity, and the stars that shine bright! 🇺🇸",
    "🦅 Let your heart soar high this Independence Day!",
    "💥 Fireworks, fun, and freedom — that’s the American way!",
  ],
  christmas: [
    "🎄 Wishing you a Christmas filled with warmth, joy, and wonder!",
    "❄️ May the magic of the season fill your home with happiness.",
    "🎁 Merry Christmas! Peace, love, and laughter always.",
  ],
  valentines: [
    "❤️ You make my heart smile — Happy Valentine’s Day!",
    "💌 Love, hugs, and sparkles sent your way today and always. ✨",
    "💖 Every heartbeat says your name — forever my Valentine!",
  ],
  birthday: [
    "🎉 Celebrate your special day with love, laughter, and endless joy!",
    "🎂 Another year older, wiser, and more wonderful — happy birthday!",
    "💫 May your day sparkle brighter than the candles on your cake!",
  ],
  graduation: [
    "🎓 You did it! Celebrate your success and shine bright! 🌟",
    "📜 Hats off to you — the best is yet to come!",
    "🎉 Congratulations on your amazing achievement — the world is yours!",
  ],
  mothers: [
    "💐 To the woman who makes life beautiful — Happy Mother’s Day!",
    "🌷 Your love blooms in every smile — thank you, Mom!",
    "❤️ The world shines brighter because of mothers like you!",
  ],
  fathers: [
    "💙 To the best dad — your guidance means the world!",
    "🛠️ Thanks for building a lifetime of love and support.",
    "🏆 You’re our hero today and always — Happy Father’s Day!",
  ],
  thanksgiving: [
    "🦃 Grateful for you — wishing you a cozy, joyful Thanksgiving!",
    "🍂 May your table be full and your heart even fuller.",
    "🥧 Warm wishes, good food, and great company — happy Thanksgiving!",
  ],
  newyear: [
    "🎆 New year, new dreams — may your days sparkle with joy!",
    "🥂 Here’s to fresh starts and bright beginnings!",
    "✨ Wishing you 365 days of smiles and success!",
  ],
  spring: [
    "🌸 Let your heart bloom — spring is here!",
    "🍃 Fresh starts and gentle sunshine — enjoy the season!",
    "🦋 May joy flutter into your days like butterflies.",
  ],
  anniversary: [
    "💍 Another year, same love — and growing stronger!",
    "❤️ Here’s to your story — and many more beautiful chapters.",
    "🌹 Love that lasts, memories that shine — happy anniversary!",
  ],
  congrats: [
    "🎊 Congratulations! Your hard work shines bright.",
    "🌟 You did it — so proud of you!",
    "🏆 Big win, big smiles — keep shining!",
  ],
  general: [
    "✨ Celebrate this special moment with Everwish. ✨",
    "🌸 Every day is a reason to smile — make it magical!",
    "💫 Send a wish, share a smile, and spread a little love!",
  ],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Resuelve categoría desde el slug (mismo criterio que /lib/animations.js) */
const slugToCategory = (slug = "") => {
  const s = (slug || "").toLowerCase();
  if (s.includes("ghost") || s.includes("halloween")) return "halloween";
  if (s.includes("bunny") || s.includes("easter")) return "easter";
  if (s.includes("pets") || s.includes("pet") || s.includes("paw")) return "pets";
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return "july4";
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return "christmas";
  if (s.includes("valentines") || s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("graduation") || s.includes("graduate")) return "graduation";
  if (s.includes("mothers")) return "mothers";
  if (s.includes("fathers")) return "fathers";
  if (s.includes("thanksgiving") || s.includes("thanks")) return "thanksgiving";
  if (s.includes("newyear") || s.includes("new-year")) return "newyear";
  if (s.includes("spring")) return "spring";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("congrats") || s.includes("congrat")) return "congrats";
  return "general";
};

export function getMessageForSlug(slug) {
  const cat = slugToCategory(slug);
  const set = SETS[cat] || SETS.general;
  return pick(set);
}
