"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

/* ✨ Animaciones visuales repartidas por la tarjeta */
export function AnimationOverlay({ slug = "", animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  // 🧠 Determinar emojis visuales por tema
  const themeEmoji = (() => {
    const s = slug.toLowerCase();
    if (s.includes("halloween")) return ["🎃", "👻", "🦇", "🕸️", "💀"];
    if (s.includes("easter") || s.includes("bunny")) return ["🐰", "🥚", "🌸", "✨", "💐"];
    if (s.includes("usa") || s.includes("july")) return ["🎆", "🇺🇸", "⭐", "🎇", "❤️"];
    if (s.includes("valentine") || s.includes("love")) return ["💖", "❤️", "💞", "💌", "🌹"];
    if (s.includes("christmas")) return ["🎄", "❄️", "🎁", "⭐", "⛄"];
    if (s.includes("mothers")) return ["🌸", "💐", "💖", "🌷", "🌼"];
    if (s.includes("birthday")) return ["🎉", "🎈", "🎂", "🎁", "💫"];
    if (s.includes("pet")) return ["🐾", "🐕", "🐈", "💚", "🦴"];
    return ["✨", "🌟", "💫"];
  })();

  // 🎨 Crear partículas distribuidas
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2.5,
      size: 14 + Math.random() * 16,
      emoji: themeEmoji[Math.floor(Math.random() * themeEmoji.length)],
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [slug, animation]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[150] overflow-visible flex items-center justify-center"
      style={{ opacity: 0.9 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0.8, 1, 0],
            y: [p.top, p.top - 70],
            scale: [1, 1.15, 1]
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
            filter: "blur(0.3px)"
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
            }
