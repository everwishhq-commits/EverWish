"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Catálogo de animaciones por tipo de tarjeta */
export function getAnimationsForSlug(slug) {
  const animations = {
    "pets-day": [
      "🐶 Puppies",
      "🐱 Kittens",
      "🐾 Paw Prints",
      "🦴 Bones",
      "🎾 Balls",
      "💋 Kisses",
      "💖 Hearts",
      "🦋 Butterflies",
      "🍖 Treats",
      "✨ Sparkles"
    ],
    "usa-4th-july": [
      "🎆 Fireworks",
      "🇺🇸 Flags",
      "🦅 Eagles",
      "⭐ Stars",
      "💥 Explosions",
      "🎇 Celebration",
      "🗽 Liberty Lights",
      "❤️💙 Confetti",
      "✨ Sparkles",
      "🎉 Cheers"
    ],
    "ghost-halloween": [
      "🎃 Pumpkins",
      "👻 Ghosts",
      "🦇 Bats",
      "💀 Skulls",
      "🍬 Candy",
      "🕯️ Candles",
      "🧙 Magic",
      "🌙 Moonlight",
      "🕸️ Webs",
      "🔥 Jack-o-Lanterns"
    ],
    "bunny-easter": [
      "🐰 Bunnies",
      "🥚 Eggs",
      "🌸 Petals",
      "💐 Flowers",
      "🌈 Rainbows",
      "🍫 Chocolate",
      "🐣 Chicks",
      "🎀 Ribbons",
      "✨ Sparkles",
      "☀️ Sunshine"
    ],
    "valentines-love": [
      "💖 Hearts",
      "💋 Kisses",
      "💌 Letters",
      "🌹 Roses",
      "💞 Swirls",
      "🎀 Ribbons",
      "🕊️ Doves",
      "✨ Sparkles",
      "💘 Cupid",
      "🌸 Petals"
    ],
    "christmas-day": [
      "🎄 Trees",
      "❄️ Snowflakes",
      "🎁 Gifts",
      "⭐ Stars",
      "⛄ Snowmen",
      "🕯️ Lights",
      "🍬 Candy",
      "🦌 Reindeer",
      "🎅 Hats",
      "💫 Sparkles"
    ],
    "graduation-day": [
      "🎓 Caps",
      "🎉 Confetti",
      "📜 Diplomas",
      "🎈 Balloons",
      "🏆 Trophies",
      "💫 Stars",
      "✨ Sparkles",
      "🎊 Ribbons",
      "🌟 Glow",
      "👏 Applause"
    ],
    "mothers-day": [
      "🌸 Petals",
      "💐 Flowers",
      "💖 Hearts",
      "🌷 Blooms",
      "🕊️ Peace",
      "🌞 Light",
      "🎀 Ribbons",
      "🍰 Cake",
      "💫 Sparkles",
      "🌼 Daisies"
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

  const found = Object.keys(animations).find((key) => slug?.includes(key));
  return animations[found] || animations.default;
}

/* 🪄 Renderiza una sola animación activa */
export function AnimationOverlay({ animation = "No animation" }) {
  const [particles, setParticles] = useState([]);
  const [key, setKey] = useState(0);

  if (!animation || animation === "No animation") return null;

  // 🎯 Determinar el emoji base según el nombre
  const singleEmoji = (() => {
    const a = animation.toLowerCase();
    if (a.includes("firework")) return "🎆";
    if (a.includes("flag")) return "🇺🇸";
    if (a.includes("eagle")) return "🦅";
    if (a.includes("explosion")) return "💥";
    if (a.includes("liberty")) return "🗽";
    if (a.includes("confetti")) return "🎉";
    if (a.includes("pumpkin")) return "🎃";
    if (a.includes("ghost")) return "👻";
    if (a.includes("bat")) return "🦇";
    if (a.includes("paw")) return "🐾";
    if (a.includes("bone")) return "🦴";
    if (a.includes("pupp")) return "🐶";
    if (a.includes("kitten") || a.includes("cat")) return "🐱";
    if (a.includes("egg")) return "🥚";
    if (a.includes("bunn")) return "🐰";
    if (a.includes("flower") || a.includes("petal")) return "🌸";
    if (a.includes("heart")) return "💖";
    if (a.includes("kiss")) return "💋";
    if (a.includes("ribbon")) return "🎀";
    if (a.includes("light")) return "💡";
    if (a.includes("spark")) return "✨";
    if (a.includes("snow")) return "❄️";
    if (a.includes("gift")) return "🎁";
    if (a.includes("candy")) return "🍬";
    if (a.includes("tree")) return "🎄";
    if (a.includes("reindeer")) return "🦌";
    if (a.includes("treat")) return "🍖";
    if (a.includes("ball")) return "🎾";
    if (a.includes("butterfl")) return "🦋";
    return "✨";
  })();

  // 🎬 Generar partículas controladas (pocas, suaves)
  useEffect(() => {
    setKey(prev => prev + 1);
    const total = Math.floor(15 + Math.random() * 10);
    const newParticles = Array.from({ length: total }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 18 + Math.random() * 14,
      duration: 5 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [animation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: [0.6, 1, 0],
              y: [p.top, p.top - 90],
              x: [p.left, p.left + Math.sin(p.id) * 15],
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
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))"
            }}
          >
            {singleEmoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
      }
