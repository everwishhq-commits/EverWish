"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🧩 Animaciones disponibles por evento */
export function getAnimationsForSlug(slug) {
  const animations = {
    "ghost-halloween": [
      "🎃 Pumpkins", "👻 Ghosts", "🕸️ Webs", "🕯️ Candles", "💀 Skulls",
      "🍬 Candy Rain", "🦇 Bats", "🌙 Moonlight", "🧙 Witch Dust", "🔥 Jack-o-Lanterns"
    ],
    "bunny-easter": [
      "🐰 Hop Trail", "🌸 Petals", "🥚 Egg Confetti", "☀️ Sunshine", "💐 Spring Bloom",
      "🍫 Chocolate Drops", "🌈 Rainbow Fade", "✨ Sparkles", "🐣 Chicks", "🎀 Ribbons"
    ],
    "pets-day": [
      "🐾 Paw Prints", "🦴 Bones", "🐕 Puppies", "🐈 Kittens", "💚 Hearts",
      "🌸 Flowers", "🦋 Butterflies", "💫 Sparkles", "🎾 Balls", "✨ Trails"
    ],
    "usa-4th-july": [
      "🎆 Fireworks", "🇺🇸 Flags", "✨ Sparkles", "🦅 Eagles", "🎇 Stars",
      "❤️💙 Confetti", "🗽 Liberty Lights", "💥 Explosions", "🎉 Celebration", "⭐ Twinkles"
    ],
    default: ["✨ Sparkles", "🌸 Petals", "🎉 Confetti", "⭐ Stars", "💖 Hearts"]
  };

  const found = Object.keys(animations).find(k => slug.includes(k));
  return animations[found] || animations.default;
}

/* ✨ Animaciones visuales — según animación elegida */
export function AnimationOverlay({ animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  const emojiSet = (() => {
    const a = animation.toLowerCase();
    if (a.includes("pumpkin")) return ["🎃", "🧙", "🕸️"];
    if (a.includes("ghost")) return ["👻", "🍬", "🦇"];
    if (a.includes("paw")) return ["🐾", "🐕", "🐈"];
    if (a.includes("bone")) return ["🦴", "🐾"];
    if (a.includes("butterfl")) return ["🦋", "🌸"];
    if (a.includes("spark")) return ["✨", "💫", "🌟"];
    if (a.includes("flag")) return ["🇺🇸", "⭐"];
    if (a.includes("firework")) return ["🎆", "🎇", "💥"];
    if (a.includes("heart")) return ["💖", "❤️", "💞"];
    if (a.includes("petal")) return ["🌸", "🌷", "🌼"];
    if (a.includes("balloon")) return ["🎈", "🎉"];
    return ["✨", "💫"];
  })();

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2.5,
      size: 14 + Math.random() * 16,
      emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [animation]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[300] overflow-visible flex items-center justify-center"
      style={{ opacity: 0.9 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0.8, 1, 0],
            y: [p.top, p.top - 70],
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
            filter: "blur(0.3px)"
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
