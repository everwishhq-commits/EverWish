"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🔹 Animaciones disponibles por evento */
export function getAnimationsForSlug(slug) {
  const animations = {
    "ghost-halloween": [
      "👻 Ghosts",
      "🎃 Pumpkins",
      "🕸️ Webs",
      "🕯️ Candles",
      "💀 Skulls",
      "🍬 Candy Rain",
      "🦇 Bats",
      "🌙 Night Glow",
      "🧙 Witch Sparkles",
      "🔥 Jack-O-Lanterns"
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
      "🎀 Ribbon Drift"
    ],
    "birthday-celebration": [
      "🎉 Confetti",
      "🎂 Candles",
      "🎈 Balloons",
      "🎁 Gifts",
      "💫 Sparkles",
      "🌟 Glow",
      "🍰 Slices",
      "💐 Flowers",
      "🎊 Streamers",
      "❤️ Hearts"
    ],
    "valentines-love": [
      "💖 Hearts",
      "💌 Letters",
      "🌹 Petals",
      "💫 Sparkles",
      "🕊️ Doves",
      "💞 Swirls",
      "✨ Glitter",
      "🌸 Bloom",
      "❤️ Floating",
      "🎀 Ribbons"
    ],
    "pets-day": [
      "🐾 Paw Prints",
      "🦴 Bones",
      "🐕 Dogs",
      "🐈 Cats",
      "🌸 Flowers",
      "💚 Hearts",
      "🐾 Trails",
      "🦴 Treats",
      "🌟 Sparkles",
      "🦋 Butterflies"
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
      "⭐ Twinkle"
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
    default: ["✨ Sparkles", "🌸 Petals", "🎉 Confetti"]
  };

  const found = Object.keys(animations).find(k => slug.includes(k));
  return animations[found] || animations.default;
}

/* 🔹 Animación visual temática y distribuida */
export function AnimationOverlay({ slug = "", animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  // 🎭 Determinar emojis por temática (slug)
  const themeEmoji = (() => {
    const s = slug.toLowerCase();
    if (s.includes("halloween")) return ["🎃", "👻", "🦇", "🕸️"];
    if (s.includes("easter") || s.includes("bunny")) return ["🐰", "🥚", "🌸", "✨"];
    if (s.includes("usa") || s.includes("july")) return ["🎆", "🇺🇸", "⭐", "🎇"];
    if (s.includes("valentine") || s.includes("love")) return ["💖", "💌", "❤️", "💞"];
    if (s.includes("christmas")) return ["🎄", "❄️", "🎁", "⭐"];
    if (s.includes("mothers")) return ["🌸", "💐", "💖", "🌷"];
    if (s.includes("birthday")) return ["🎉", "🎈", "🎂", "🎁"];
    if (s.includes("pet")) return ["🐾", "🐕", "🐈", "💚"];
    return ["✨", "🌟", "💫"];
  })();

  // 🌬️ Generar partículas en distintas posiciones
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: 16 + Math.random() * 14,
      emoji: themeEmoji[Math.floor(Math.random() * themeEmoji.length)],
      duration: 3.5 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [slug, animation]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[150] overflow-visible flex items-center justify-center"
      style={{ opacity: 0.8 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0.7, 1, 0],
            y: [p.top, p.top - 60],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            filter: "blur(0.4px)"
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* 🔹 Emoji de respaldo */
function animationEmoji(name) {
  if (!name) return "✨";
  const key = name.toLowerCase();
  if (key.includes("spark")) return "✨";
  if (key.includes("heart")) return "💖";
  if (key.includes("petal")) return "🌸";
  if (key.includes("confetti")) return "🎉";
  if (key.includes("snow")) return "❄️";
  if (key.includes("paw")) return "🐾";
  if (key.includes("firework")) return "🎆";
  if (key.includes("ghost")) return "👻";
  if (key.includes("pumpkin")) return "🎃";
  if (key.includes("star")) return "⭐";
  if (key.includes("egg")) return "🥚";
  return "✨";
    }
