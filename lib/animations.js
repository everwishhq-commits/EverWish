"use client";

/* 🧩 Animaciones disponibles por evento */
export function getAnimationsForSlug(slug) {
  const animations = {
    "ghost-halloween": [
      "🎃 Pumpkins",
      "👻 Ghosts",
      "🕸️ Webs",
      "🕯️ Candles",
      "💀 Skulls",
      "🍬 Candy Rain",
      "🦇 Bats",
      "🌙 Moonlight",
      "🧙 Witch Dust",
      "🔥 Jack-o-Lanterns"
    ],
    "bunny-easter": [
      "🐰 Hop Trail",
      "🌸 Petals",
      "🥚 Egg Confetti",
      "☀️ Sunshine",
      "💐 Spring Bloom",
      "🍫 Chocolate Drops",
      "🌈 Rainbow Fade",
      "✨ Sparkles",
      "🐣 Chicks",
      "🎀 Ribbons"
    ],
    "birthday-celebration": [
      "🎉 Confetti",
      "🎂 Candles",
      "🎈 Balloons",
      "🎁 Gifts",
      "💫 Sparkles",
      "🌟 Glow",
      "🍰 Cake Slices",
      "💐 Flowers",
      "🎊 Streamers",
      "❤️ Hearts"
    ],
    "valentines-love": [
      "💖 Hearts",
      "💌 Letters",
      "🌹 Petals",
      "💞 Swirls",
      "💫 Sparkles",
      "🕊️ Doves",
      "✨ Glitter",
      "🌸 Blooms",
      "❤️ Floating Hearts",
      "🎀 Ribbons"
    ],
    "pets-day": [
      "🐾 Paw Prints",
      "🦴 Bones",
      "🐕 Puppies",
      "🐈 Kittens",
      "💚 Hearts",
      "🌸 Flowers",
      "🐾 Trails",
      "🦋 Butterflies",
      "💫 Sparkles",
      "🎾 Balls"
    ],
    "usa-4th-july": [
      "🎆 Fireworks",
      "🇺🇸 Flags",
      "✨ Sparkles",
      "🦅 Eagles",
      "🎇 Stars",
      "❤️💙 Confetti",
      "🗽 Liberty Lights",
      "💥 Explosions",
      "🎉 Celebration",
      "⭐ Twinkles"
    ],
    "christmas-day": [
      "🎄 Snowflakes",
      "🎁 Gifts",
      "⭐ Stars",
      "❄️ Flakes",
      "🕯️ Lights",
      "🌟 Sparkle",
      "🎅 Hats",
      "⛄ Snowmen",
      "🍬 Candy",
      "💫 Magic"
    ],
    "graduation-day": [
      "🎓 Caps",
      "🎉 Confetti",
      "⭐ Sparkles",
      "🎊 Ribbons",
      "💫 Stars",
      "📜 Diplomas",
      "🌟 Glow",
      "✨ Fireworks",
      "🎈 Balloons",
      "🏆 Trophies"
    ],
    "mothers-day": [
      "🌸 Petals",
      "💐 Flowers",
      "💖 Hearts",
      "✨ Sparkles",
      "🌷 Blooms",
      "🌞 Light",
      "🌹 Roses",
      "🌼 Daisies",
      "🕊️ Peace",
      "🎀 Ribbon"
    ],
    default: [
      "✨ Sparkles",
      "🌸 Petals",
      "🎉 Confetti",
      "⭐ Stars",
      "💖 Hearts",
      "🌈 Glow",
      "🎇 Lights",
      "💫 Shimmer",
      "🎀 Ribbons",
      "🌟 Twinkle"
    ]
  };

  const found = Object.keys(animations).find(k => slug.includes(k));
  return animations[found] || animations.default;
}

/* 🪄 Configuración de partículas según slug y tipo */
export function getAnimationSet(slug, animation) {
  const s = slug.toLowerCase();
  const a = animation.toLowerCase();

  let emojis = ["✨", "🌟", "💫"];
  let direction = "up";
  let density = 40;
  let speed = 4;

  if (s.includes("halloween")) emojis = ["🎃", "👻", "🦇", "🕸️", "🍬"];
  else if (s.includes("easter") || s.includes("bunny")) emojis = ["🐰", "🥚", "🌸", "✨", "💐"];
  else if (s.includes("usa") || s.includes("july")) emojis = ["🎆", "🇺🇸", "⭐", "🎇"];
  else if (s.includes("valentine") || s.includes("love")) emojis = ["💖", "❤️", "💞", "💌"];
  else if (s.includes("christmas")) emojis = ["🎄", "❄️", "🎁", "⭐"];
  else if (s.includes("mothers")) emojis = ["🌸", "💐", "💖", "🌷"];
  else if (s.includes("birthday")) emojis = ["🎉", "🎈", "🎂", "🎁"];
  else if (s.includes("pet")) emojis = ["🐾", "🐕", "🐈", "💚", "🦴"];

  if (a.includes("confetti") || a.includes("snow") || a.includes("candy")) direction = "down";
  if (a.includes("paw") || a.includes("bloom") || a.includes("spark")) direction = "up";
  if (a.includes("ribbon")) direction = "left";
  if (a.includes("firework")) direction = "out";

  if (a.includes("confetti")) density = 60;
  if (a.includes("sparkle")) density = 30;
  if (a.includes("paw")) density = 40;
  if (a.includes("snow")) speed = 6;
  if (a.includes("spark")) speed = 3.5;

  return { emojis, direction, density, speed };
}
