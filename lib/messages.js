/* =========================================================
   💌 MESSAGES — 3 por categoría + helpers
   ========================================================= */

export function parseCategoryFromSlug(slug = "") {
  const s = slug.toLowerCase();
  if (/(independence|july|usa|4th)/.test(s)) return "independence";
  if (/christmas|navidad/.test(s)) return "christmas";
  if (/halloween/.test(s)) return "halloween";
  if (/thanksgiving/.test(s)) return "thanksgiving";
  if (/birthday|cumple/.test(s)) return "birthday";
  if (/love|valentine/.test(s)) return "love";
  if (/condolence|loss|memory|funeral|sympathy/.test(s)) return "condolence";
  if (/easter|bunny/.test(s)) return "easter";
  if (/newyear|year/.test(s)) return "newyear";
  if (/mother/.test(s)) return "mothersday";
  if (/father/.test(s)) return "fathersday";
  if (/pets?|animal/.test(s)) return "pets";
  if (/graduation|grad/.test(s)) return "graduation";
  if (/baby|shower/.test(s)) return "babyshower";
  return "general";
}

const MESSAGES = {
  independence: [
    "Celebrate freedom and unity — Happy 4th of July! 🇺🇸🎆",
    "Stars, stripes, and bright skies. Enjoy Independence Day! ✨",
    "Fireworks, friends, and the spirit of liberty! 🎇🗽",
  ],
  christmas: [
    "May your days be merry, bright, and filled with love. 🎄✨",
    "Warm lights, cozy hearts—have a magical Christmas! 🕯️💫",
    "Sending joy and hugs this holiday season. 🎁❄️",
  ],
  halloween: [
    "Have a spook-tacular night full of magic and candy! 👻🍬",
    "Trick or treat yourself to something sweet! 🎃",
    "Boo! Wishing you fun scares and lots of laughs. 🦇",
  ],
  thanksgiving: [
    "Grateful for every blessing and every smile. 🦃🍁",
    "May your table be full and your heart even fuller. 🍂",
    "Warm wishes of gratitude from my heart to yours. 🧡",
  ],
  birthday: [
    "Happy Birthday! Joy, laughter and sweet surprises. 🎉🎂",
    "Another year to shine—have an amazing day! 🎈",
    "Wishing you love, cake, and happy memories! 🥳",
  ],
  love: [
    "Thank you for existing—today and always. 💖",
    "My heart chooses you, again and again. 💞",
    "With you, every ordinary moment turns magic. ✨",
  ],
  condolence: [
    "May peace and love comfort your heart today and always. 🕊️🤍",
    "With heartfelt sympathy—holding you in my thoughts. 💐",
    "Gone from our sight, never from our hearts. 🫶",
  ],
  easter: [
    "Let joy and renewal bloom within you. 🐰🌸",
    "Hop into happiness—Happy Easter! 🐣",
    "New light, new hope, new smiles. 🌷",
  ],
  newyear: [
    "A fresh start, new dreams, and endless joy. ✨🎆",
    "Cheers to hope, health, and bright days ahead! 🥂",
    "Midnight glow and fearless goals—Happy New Year! 💫",
  ],
  mothersday: [
    "Happy Mother's Day to the heart of our home. 🌷",
    "Your love lights our world—thank you, Mom. 🌸",
    "For all you give, today we celebrate you. 💐",
  ],
  fathersday: [
    "Happy Father's Day to my everyday hero. 👔",
    "Thanks for your strength, wisdom, and love. 💙",
    "Proud to call you Dad—always. 🛠️",
  ],
  pets: [
    "Celebrating the furry friends who make life brighter! 🐾",
    "Wags, purrs, and endless cuddles—thank you, pets! 🐶🐱",
    "Because every day is better with whiskers and tails. ❤️",
  ],
  graduation: [
    "Caps off—congratulations, graduate! 🎓",
    "You dreamed, worked, and achieved. Now shine! 🌟",
    "The world is ready for your greatness. 💫",
  ],
  babyshower: [
    "Tiny kicks and big love—congratulations! 👶",
    "A new adventure begins—blessings to your family. 🌈",
    "May this little one bring endless joy. 💖",
  ],
  general: [
    "Celebrate this moment with a smile. Wishing you peace and light. ✨",
    "Sending you joy, kindness, and reasons to smile. 🌼",
    "May today be warm and beautiful—just like you. ☀️",
  ],
};

export function defaultMessageFromSlug(slug = "") {
  const cat = parseCategoryFromSlug(slug);
  const arr = MESSAGES[cat] || MESSAGES.general;
  return arr[Math.floor(Math.random() * arr.length)];
    }
