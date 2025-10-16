// 📄 lib/animations.js
// ✨ Sistema de animaciones flotantes Everwish
// Cada tarjeta (slug) tiene asociada una animación predefinida que se activa al renderizar.

// -----------------------------------------------------------------------------
// 🔸 FUNCIONALIDAD
// 1. Cada slug devuelve el tipo de animación visual que debe mostrarse.
// 2. Las animaciones son nombres de efectos que se pueden usar en el front-end (Framer Motion, Lottie o CSS).
// 3. Incluye categorías: románticas, festivas, patrióticas, mascotas, condolencias, etc.
// 4. Si no se encuentra el slug, devuelve "sparkles" como efecto genérico.
// -----------------------------------------------------------------------------

export function getAnimationsForSlug(slug) {
  const animations = {
    // 🎃 HALLOWEEN
    "ghost-halloween": "ghostFloat",
    "pumpkin-halloween": "pumpkinGlow",
    "witch-halloween": "moonOrbit",
    "zombie-halloween": "fogCrawl",
    "bat-halloween": "batSwarm",

    // 💞 LOVE & ROMANCE
    "valentine-heart": "floatingHearts",
    "love-roses": "petalRain",
    "couple-sunset": "softGlow",
    "heart-edition": "heartPulse",
    "signature-edition": "romanticBokeh",

    // 🎂 BIRTHDAY
    "birthday-cake": "confettiRain",
    "birthday-balloons": "balloonRise",
    "birthday-stars": "sparkBurst",
    "birthday-friends": "confettiWave",

    // 👶 BABY / FAMILY
    "baby-shower": "pastelStars",
    "baby-girl": "pinkHearts",
    "baby-boy": "blueStars",
    "new-parents": "softClouds",

    // 🎓 GRADUATION
    "graduation-cap": "risingCaps",
    "graduation-stars": "goldSparkles",
    "graduation-journey": "trailGlow",

    // 🕊️ CONDOLENCES
    "condolences-white-flower": "gentlePetals",
    "condolences-dove": "whiteFeathers",
    "condolences-light": "softGlow",

    // 🏆 ACHIEVEMENTS
    "promotion-celebration": "goldConfetti",
    "new-job": "ribbonRise",
    "housewarming": "sparkLight",

    // 🐾 PETS
    "pets-day": "pawPrints",
    "cat-love": "tinyPaws",
    "dog-friend": "waggingHearts",

    // 🇺🇸 HOLIDAYS
    "usa-4th-july": "flagWave",
    "thanksgiving": "leafFall",
    "christmas-tree": "snowFlakes",
    "new-year": "fireworks",

    // 🌸 FAMILY / PARENTS
    "mothers-day": "rosePetals",
    "fathers-day": "goldGlow",

    // 💌 GRATITUDE
    "thank-you": "softSparkle",
    "appreciation": "floatingLight",
    "teacher-day": "chalkDust",

    // 🕊️ SPIRITUAL
    "faith-hope": "glowPulse",
    "peace-light": "lightWaves",
    "angel-blessing": "whiteAura",

    // 🌈 GENERIC
    "everwish-general": "sparkles",
    "generic-bliss": "bokehDrift",
  };

  return animations[slug] || "sparkles";
}

// -----------------------------------------------------------------------------
// 🔸 OPCIONAL: EFECTOS DISPONIBLES (documentación interna)
// Estos nombres se pueden vincular con efectos visuales en tu frontend (Framer Motion o Lottie).
// -----------------------------------------------------------------------------
export const animationEffects = {
  ghostFloat: { description: "Floating ghosts fading in and out", color: "#fff" },
  pumpkinGlow: { description: "Soft orange glow under pumpkins", color: "#FF9E4D" },
  moonOrbit: { description: "Stars orbiting a glowing moon", color: "#C4B5FD" },
  fogCrawl: { description: "Subtle mist movement on bottom edge", color: "#AAA" },
  batSwarm: { description: "Flying bats crossing screen", color: "#333" },
  floatingHearts: { description: "Hearts rising gently", color: "#FF7BAC" },
  petalRain: { description: "Rose petals falling slowly", color: "#E57373" },
  heartPulse: { description: "Soft heart glow pulsing rhythmically", color: "#FF9EBB" },
  romanticBokeh: { description: "Bokeh lights drifting softly", color: "#FAD1E5" },
  confettiRain: { description: "Confetti falls from top", color: "#FFD700" },
  balloonRise: { description: "Balloons float upward", color: "#F9A825" },
  pastelStars: { description: "Soft glowing pastel stars", color: "#D1C4E9" },
  goldSparkles: { description: "Golden sparkles shimmering", color: "#FFD54F" },
  softGlow: { description: "Smooth ambient glow effect", color: "#FFF3E0" },
  pawPrints: { description: "Animated paw prints trail", color: "#D9A773" },
  fireworks: { description: "Fireworks burst and fade", color: "#FFEB3B" },
  rosePetals: { description: "Soft pink petals drifting", color: "#E91E63" },
  sparkles: { description: "Universal light sparkle animation", color: "#F8BBD0" },
};
