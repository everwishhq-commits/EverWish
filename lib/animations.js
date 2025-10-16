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

/* 🔹 Animación visual genérica */
export function AnimationOverlay({ animation = "✨ Sparkles", fullScreen = false }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // genera partículas animadas aleatorias
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: 14 + Math.random() * 12
    }));
    setParticles(newParticles);
  }, [animation]);

  return (
    <div
      className={`pointer-events-none ${
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      } z-[150] overflow-hidden`}
      style={{ opacity: 0.7 }}
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0.6, 1, 0], y: [0, -200] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: p.delay
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-10%",
            fontSize: `${p.size}px`
          }}
        >
          {animationEmoji(animation)}
        </motion.div>
      ))}
    </div>
  );
}

/* 🔹 Asocia nombre con ícono o emoji */
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
