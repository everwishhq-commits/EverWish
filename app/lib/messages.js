/* =========================================================
   💌 MESSAGES LIBRARY — 3 per category
   ========================================================= */
export function parseCategoryFromSlug(slug = "") {
  const s = slug.toLowerCase();
  if (s.includes("birthday")) return "birthday";
  if (s.includes("love") || s.includes("valentine")) return "love";
  if (s.includes("christmas")) return "christmas";
  if (s.includes("halloween")) return "halloween";
  if (s.includes("newyear")) return "newyear";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("easter")) return "easter";
  if (s.includes("pets") || s.includes("animal")) return "pets";
  if (s.includes("mother")) return "mothersday";
  if (s.includes("father")) return "fathersday";
  if (s.includes("graduation")) return "graduation";
  if (s.includes("condolence") || s.includes("sympathy")) return "condolence";
  if (s.includes("baby") || s.includes("shower")) return "babyshower";
  if (s.includes("independence") || s.includes("july") || s.includes("usa"))
    return "independence";
  return "general";
}

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

export function defaultMessageFromSlug(slug = "") {
  const cat = parseCategoryFromSlug(slug);
  const arr = MESSAGES[cat] || MESSAGES.general;
  return arr[Math.floor(Math.random() * arr.length)];
    }
