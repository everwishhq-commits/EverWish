// /lib/messages.js

/* Devuelve 1 mensaje (de un set de 3) dependiendo del slug.
   Reglas: si el slug tiene "birthday"/"cumple", prioriza mensajes de cumpleaños
   aunque la animación/categoría sea Halloween, etc. */
export function getMessageForSlug(slug = "") {
  const s = (slug || "").toLowerCase();

  const sets = {
    halloween: [
      "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
      "Boo! May your night be spooky, silly, and sweet! 👻🍬",
      "Pumpkins, ghosts and giggles — happy Halloween! 🕸️🎃",
    ],
    easter: [
      "Wishing you a joyful Easter filled with blessings! 🐣🌷",
      "Hop into joy — Easter is here! 🐰✨",
      "May your Easter basket overflow with smiles! 🌸🥚",
    ],
    pets: [
      "To the ones who make every day pawsome — our beloved pets! 🐾💛",
      "You make every day better. Woof & purrs! 🐶🐱",
      "Life’s better with paws, purrs, and love! 🐾❤️",
    ],
    july4: [
      "Happy 4th of July! Let freedom sparkle! 🎆🇺🇸",
      "Celebrate freedom, unity, and starry skies! ⭐🦅",
      "Fireworks, fun, and freedom — enjoy! 🎇🎉",
    ],
    christmas: [
      "Wishing you peace, joy, and cozy magic this Christmas. 🎄✨",
      "May the season fill your home with happiness. ❄️🏠",
      "Merry Christmas! Peace, love, and laughter. 🎁❤️",
    ],
    valentines: [
      "Sending love and sparkles your way! ❤️✨",
      "You make my heart smile — Happy Valentine’s! 💘",
      "Every heartbeat says your name. 💖",
    ],
    birthday: [
      "Celebrate your special day with joy and smiles! 🎂🎉",
      "Another year more wonderful — happy birthday! ✨🎈",
      "May your day sparkle brighter than your candles! 💫🕯️",
    ],
    graduation: [
      "Congratulations, graduate! The world awaits you! 🎓🌟",
      "Hats off to you — the best is yet to come! 📜✨",
      "You did it! Shine bright! 🎉🎓",
    ],
    mothers: [
      "For the heart that never stops giving — Happy Mother’s Day! 💐❤️",
      "Your love blooms in every smile — thank you! 🌷",
      "You make the world brighter — Happy Mother’s Day! ✨",
    ],
    fathers: [
      "Strong, wise and loved — Happy Father’s Day! 🏆❤️",
      "Thanks for every little big thing you do! 👍",
      "You’re our hero — Happy Father’s Day! ⭐",
    ],
    thanksgiving: [
      "Grateful for moments like these — Happy Thanksgiving! 🍂🦃",
      "May your table be full and hearts even fuller. 🥧💛",
      "Thanks, smiles and warm hugs — enjoy! 🍁✨",
    ],
    newyear: [
      "Cheers to new beginnings — Happy New Year! 🎆🥂",
      "May your year be bright and kind. ✨",
      "12 new chapters. 365 new chances. ⭐",
    ],
    spring: [
      "Fresh starts and flowers — hello spring! 🌸✨",
      "Let the sunshine and smiles bloom! ☀️🌷",
      "New season, new joys. 🌿",
    ],
    anniversary: [
      "Another beautiful chapter together — happy anniversary! 💞",
      "Here’s to love, today and always. 💍",
      "Two hearts, one story. ❤️",
    ],
    congrats: [
      "Congrats! You did it! 🎉",
      "Proud of you — keep shining! ✨",
      "Bravo! This is just the beginning! 🏆",
    ],
    general: [
      "Celebrate this special moment with Everwish. ✨",
      "Send a wish, share a smile, spread love. 💫",
      "Little moments, big smiles. 🌟",
    ],
  };

  // Prioridad de mensaje por palabras clave
  if (s.includes("birthday") || s.includes("cumple")) return pickOne(sets.birthday);
  if (s.includes("halloween") || s.includes("ghost")) return pickOne(sets.halloween);
  if (s.includes("easter") || s.includes("bunny")) return pickOne(sets.easter);
  if (s.includes("pet") || s.includes("paw")) return pickOne(sets.pets);
  if (s.includes("usa") || s.includes("july4") || s.includes("4th")) return pickOne(sets.july4);
  if (s.includes("christmas") || s.includes("xmas") || s.includes("navidad")) return pickOne(sets.christmas);
  if (s.includes("valentine") || s.includes("valentines") || s.includes("love")) return pickOne(sets.valentines);
  if (s.includes("graduation") || s.includes("graduate")) return pickOne(sets.graduation);
  if (s.includes("mothers")) return pickOne(sets.mothers);
  if (s.includes("fathers")) return pickOne(sets.fathers);
  if (s.includes("thanksgiving") || s.includes("thanks")) return pickOne(sets.thanksgiving);
  if (s.includes("newyear") || s.includes("new-year")) return pickOne(sets.newyear);
  if (s.includes("spring") || s.includes("primavera")) return pickOne(sets.spring);
  if (s.includes("anniversary") || s.includes("anivers")) return pickOne(sets.anniversary);
  if (s.includes("congrats") || s.includes("felic")) return pickOne(sets.congrats);

  return pickOne(sets.general);
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
    }
