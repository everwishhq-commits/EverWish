"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Listado de animaciones por celebración */
export function getAnimationsForSlug(slug) {
  const sets = {
    "ghost-halloween": [
      "🎃 Pumpkin Glow",
      "👻 Ghosts",
      "🍬 Candy Rain",
      "🕸️ Web Webs",
      "🦇 Bats",
      "💀 Skulls",
      "🧙 Witch Dust",
      "🌙 Moon Mist",
      "🔥 Jack Light",
      "✨ Sparkles"
    ],
    "pets-day": [
      "🐾 Paw Trails",
      "🐕 Puppies",
      "🐈 Kittens",
      "💚 Hearts",
      "🌸 Flowers",
      "🦋 Butterflies",
      "🦴 Bones",
      "💫 Sparkles",
      "🎾 Balls",
      "🌼 Daisies"
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
    "bunny-easter": [
      "🐰 Hop Trail",
      "🌸 Petals",
      "🥚 Egg Confetti",
      "☀️ Sunshine",
      "💐 Spring Bloom",
      "🍫 Chocolate Drops",
      "🌈 Rainbow Fade",
      "🐣 Chicks",
      "🎀 Ribbons",
      "✨ Sparkles"
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

  const found = Object.keys(sets).find((k) => slug.includes(k));
  return sets[found] || sets.default;
}

/* 💫 Render animaciones en toda la pantalla (encima de todo) */
export function AnimationOverlay({ slug, animation }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const emojis = getEmojisBySlug(slug);
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      size: 14 + Math.random() * 16
    }));
    setParticles(newParticles);
  }, [slug, animation]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[500] overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0.9, 1, 0],
            y: [p.top, p.top - 80],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
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

/* 🧠 Emojis por categoría */
function getEmojisBySlug(slug) {
  const s = slug.toLowerCase();
  if (s.includes("halloween")) return ["🎃", "👻", "🦇", "🕸️", "💀"];
  if (s.includes("easter") || s.includes("bunny")) return ["🐰", "🥚", "🌸", "💐", "🌈"];
  if (s.includes("usa") || s.includes("july")) return ["🎆", "🇺🇸", "⭐", "🎇", "🦅"];
  if (s.includes("valentine") || s.includes("love")) return ["💖", "❤️", "💞", "💌", "🌹"];
  if (s.includes("christmas")) return ["🎄", "❄️", "🎁", "⭐", "⛄"];
  if (s.includes("mothers")) return ["🌸", "💐", "💖", "🌷", "🌼"];
  if (s.includes("birthday")) return ["🎉", "🎈", "🎂", "🎁", "💫"];
  if (s.includes("pet")) return ["🐾", "🐕", "🐈", "💚", "🦴"];
  return ["✨", "🌟", "💫"];
      }
