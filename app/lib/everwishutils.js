/* =========================================================
   🩷 BLOQUE 2 — MESSAGES AUTOMÁTICOS POR CATEGORÍA
   ========================================================= */

export function parseCategoryFromSlug(slug = "") {
  const name = slug.toLowerCase();
  if (name.includes("birthday")) return "birthday";
  if (name.includes("love") || name.includes("valentine")) return "love";
  if (name.includes("christmas")) return "christmas";
  if (name.includes("halloween")) return "halloween";
  if (name.includes("newyear")) return "newyear";
  if (name.includes("thanksgiving")) return "thanksgiving";
  if (name.includes("easter")) return "easter";
  if (name.includes("pets") || name.includes("animal")) return "pets";
  if (name.includes("mother")) return "mothersday";
  if (name.includes("father")) return "fathersday";
  if (name.includes("graduation")) return "graduation";
  if (name.includes("condolence") || name.includes("sympathy")) return "condolence";
  if (name.includes("baby") || name.includes("shower")) return "babyshower";
  if (name.includes("independence") || name.includes("july") || name.includes("usa"))
    return "independence";
  return "general";
}

/* =========================================================
   💌 MESSAGES LIBRARY (3 por categoría)
   ========================================================= */
const MESSAGES = {
  birthday: [
    "Wishing you a birthday full of laughter, love, and sweet surprises! 🎉",
    "Happy Birthday! May your day sparkle with joy and your year overflow with blessings. 🎂",
    "Another year, another reason to celebrate YOU! Have an amazing birthday! 🎈",
  ],
  love: [
    "Every moment with you feels like a beautiful dream come true. 💖",
    "You’re the reason my heart smiles every single day. ❤️",
    "Love is not about days or years — it’s about this moment, right now, with you. 💕",
  ],
  christmas: [
    "Wishing you a cozy Christmas filled with joy, laughter, and love. 🎄",
    "May your home be bright, your heart be light, and your days merry and warm! ✨",
    "Have a holly jolly Christmas and a magical holiday season! 🎅",
  ],
  halloween: [
    "Have a spook-tacular Halloween! 🎃👻",
    "Trick or treat yourself to something sweet! 🍬",
    "Wishing you a night full of chills, thrills, and candy spills! 🦇",
  ],
  newyear: [
    "Cheers to a new year full of hope, happiness, and new adventures! 🎆",
    "May this New Year bring you peace, love, and endless possibilities. 🌟",
    "Here’s to fresh starts and bright tomorrows — Happy New Year! 🥂",
  ],
  thanksgiving: [
    "Grateful for friends like you — Happy Thanksgiving! 🦃",
    "May your table be full and your heart even fuller. 🍂",
    "Sending warm Thanksgiving wishes from my heart to yours. 🧡",
  ],
  easter: [
    "Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🐣",
    "Let the spirit of Easter bring new beginnings and hope. 🌸",
    "Hop into happiness — Happy Easter! 🐰",
  ],
  pets: [
    "Paws, love, and happy tails — celebrating our furry best friends! 🐾",
    "Because life is better with wagging tails and purring cuddles. 🐶🐱",
    "To the ones who make our hearts softer and our days brighter — our pets! ❤️",
  ],
  mothersday: [
    "Happy Mother’s Day to the heart of our home — thank you for everything you are! 🌷",
    "Your love is the sunshine that keeps our world blooming. 🌸",
    "For the woman who gives everything and asks for nothing — we love you, Mom! 💐",
  ],
  fathersday: [
    "Happy Father’s Day to my everyday hero. 💙",
    "Thank you for your strength, wisdom, and endless love. 👔",
    "You’ve taught me what it means to love deeply and live boldly. ❤️",
  ],
  graduation: [
    "Caps off to your amazing achievement — congratulations, graduate! 🎓",
    "This is your moment — the world is ready for your greatness! 🌟",
    "You dreamed, worked, and achieved — now go shine! 💫",
  ],
  condolence: [
    "May you find peace and comfort in the love that surrounds you. 🕊️",
    "With heartfelt sympathy — thinking of you during this difficult time. 💐",
    "Gone from our sight, but never from our hearts. 🤍",
  ],
  babyshower: [
    "Tiny kicks, tiny giggles, and endless love — congratulations! 👶",
    "A new adventure begins! Wishing you and your baby all the joy in the world. 🌈",
    "May your baby bring light, laughter, and love beyond measure. 💖",
  ],
  independence: [
    "Celebrate freedom and unity — Happy Independence Day! 🇺🇸🎆",
    "Stars, stripes, and the spirit of liberty shine bright today! ✨",
    "Proud to celebrate the red, white, and blue with joy and gratitude. 🎇",
  ],
  general: [
    "Wishing you joy, kindness, and reasons to smile today and always. 🌼",
    "Every day is a chance to celebrate life and love. 💫",
    "May your day be as bright and beautiful as your heart. ☀️",
  ],
};

/* =========================================================
   🎯 FUNCTION — Return a random message based on slug
   ========================================================= */
export function defaultMessageFromSlug(slug = "") {
  const cat = parseCategoryFromSlug(slug);
  const arr = MESSAGES[cat] || MESSAGES.general;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================================================
   🩵 BLOQUE 3 — ANIMACIONES (10 por categoría)
   ========================================================= */

const ANIMS = {
  birthday: [
    "🎉 Confetti Burst",
    "🎂 Cake Spark",
    "🎈 Balloon Rise",
    "✨ Glitter Pop",
    "🎊 Party Stream",
    "💝 Ribbon Glow",
    "🌈 Color Rain",
    "🎁 Gift Slide",
    "🪩 Disco Spin",
    "🥳 Smile Twirl",
  ],
  love: [
    "💖 Floating Hearts",
    "💘 Cupid Spark",
    "💞 Pink Glow",
    "🌹 Rose Fall",
    "💋 Kiss Burst",
    "✨ Soft Sparkle",
    "🌸 Bloom Fade",
    "💕 Heart Trail",
    "💫 Romantic Dust",
    "🕯️ Candle Flicker",
  ],
  christmas: [
    "🎄 Snow Glow",
    "🎁 Santa Spark",
    "✨ Twinkle Lights",
    "❄️ Snowfall",
    "🕯️ Candle Light",
    "🎅 Gift Pop",
    "🌟 Star Shine",
    "💫 Magic Dust",
    "🧦 Cozy Socks",
    "🔔 Jingle Bells",
  ],
  halloween: [
    "🎃 Pumpkin Glow",
    "👻 Ghost Drift",
    "🕸️ Web Fall",
    "🧙‍♀️ Witch Dust",
    "🦇 Bat Flight",
    "🪄 Spark Potion",
    "💀 Skull Flicker",
    "🕯️ Candle Mist",
    "🌕 Moonlight Fade",
    "🍬 Candy Rain",
  ],
  newyear: [
    "🎆 Fireworks",
    "✨ Glitter Burst",
    "🎇 Star Rain",
    "🌟 Spark Trail",
    "🎉 Pop Stream",
    "🍾 Champagne Rise",
    "💫 Midnight Glow",
    "🕛 Clock Flash",
    "🎊 Joy Burst",
    "🌈 New Dawn",
  ],
  thanksgiving: [
    "🦃 Turkey Glow",
    "🍂 Leaf Drift",
    "🍁 Fall Wind",
    "🕯️ Warm Light",
    "🥧 Pie Puff",
    "🌻 Harvest Bloom",
    "🍗 Feast Fade",
    "🌾 Grain Wave",
    "🍃 Gentle Breeze",
    "🔥 Hearth Flicker",
  ],
  easter: [
    "🐰 Hop Trail",
    "🌸 Flower Bloom",
    "🌼 Petal Pop",
    "🥚 Egg Jump",
    "🌷 Spring Glow",
    "✨ Gentle Sparkle",
    "☀️ Morning Shine",
    "🕊️ Dove Peace",
    "💐 Joy Spread",
    "🍃 Fresh Air",
  ],
  pets: [
    "🐾 Paw Prints",
    "🐕 Tail Wag",
    "🐈 Whisker Flick",
    "💫 Sparkle Fur",
    "🦴 Bone Toss",
    "💖 Heart Paw",
    "🎾 Ball Bounce",
    "✨ Nose Nudge",
    "🌈 Rainbow Trail",
    "🦋 Gentle Flutter",
  ],
  mothersday: [
    "🌸 Bloom Light",
    "💐 Flower Glow",
    "💞 Soft Spark",
    "🌷 Petal Rain",
    "✨ Heart Shine",
    "🌼 Gentle Breeze",
    "☀️ Warm Glow",
    "💖 Mom Sparkle",
    "🕯️ Candle Peace",
    "🌹 Love Bloom",
  ],
  fathersday: [
    "👔 Tie Swing",
    "💙 Heart Glow",
    "🌟 Hero Spark",
    "🏆 Pride Shine",
    "🔥 Warm Light",
    "🎉 Cheers Pop",
    "☀️ Gentle Rise",
    "💫 Star Fade",
    "🕯️ Candle Flick",
    "🛠️ Strength Beam",
  ],
  graduation: [
    "🎓 Cap Toss",
    "✨ Spark Trail",
    "🌟 Dream Burst",
    "🎉 Confetti Fly",
    "📜 Scroll Roll",
    "💫 Future Glow",
    "🎇 Star Pop",
    "🏅 Medal Shine",
    "🎊 Pride Stream",
    "🌈 New Path",
  ],
  condolence: [
    "🕊️ Dove Flight",
    "🌿 Leaf Drift",
    "🌧️ Soft Rain",
    "💫 Gentle Light",
    "🌸 Petal Fall",
    "✨ Peace Glow",
    "🌙 Moon Fade",
    "🪶 Feather Drift",
    "🕯️ Candle Calm",
    "🌾 Serenity Wave",
  ],
  babyshower: [
    "👶 Bubble Rise",
    "🍼 Milk Drop",
    "🌈 Rainbow Glow",
    "✨ Gentle Sparkle",
    "🌸 Baby Bloom",
    "🎀 Ribbon Float",
    "💖 Heart Puff",
    "🐻 Teddy Fall",
    "☁️ Soft Drift",
    "🎈 Balloon Float",
  ],
  independence: [
    "🇺🇸 Flag Wave",
    "🎆 Firework Burst",
    "✨ Star Spark",
    "🗽 Liberty Glow",
    "🎇 Light Rain",
    "🔥 Spark Trail",
    "💫 Freedom Beam",
    "🎉 RedWhiteBlue",
    "🌟 Sky Flash",
    "🦅 Eagle Sweep",
  ],
  general: [
    "✨ Sparkles",
    "🎉 Confetti",
    "💖 Hearts",
    "🌸 Bloom",
    "🌟 Shine",
    "🕊️ Peace",
    "🌈 Glow",
    "💫 Dust",
    "🎇 Light",
    "❌ None",
  ],
};

/* =========================================================
   🎬 FUNCTION — Return 10 animations for the category
   ========================================================= */
export function getAnimationsForSlug(slug = "") {
  const cat = parseCategoryFromSlug(slug);
  return ANIMS[cat] || ANIMS.general;
  }
