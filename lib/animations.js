"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Definir animaciones por categoría */
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
      "🐶 Puppies", "🐱 Kittens", "🐾 Paw Prints", "🦴 Bones", "💋 Kisses",
      "💖 Hearts", "🦋 Butterflies", "🌸 Flowers", "🎾 Balls", "✨ Sparkles"
    ],
    "usa-4th-july": [
      "🎆 Fireworks", "🇺🇸 Flags", "⭐ Stars", "🦅 Eagles", "🎇 Celebration",
      "❤️ Confetti", "💙 Twinkles", "🗽 Liberty Lights", "💥 Explosions", "🎉 Cheers"
    ],
    "valentines-love": [
      "💖 Hearts", "💌 Letters", "💞 Swirls", "💋 Kisses", "🌹 Roses",
      "🎀 Ribbons", "✨ Glitter", "💘 Cupid", "🌸 Petals", "🕊️ Doves"
    ],
    "christmas-day": [
      "🎄 Trees", "❄️ Snowflakes", "🎁 Gifts", "⭐ Stars", "⛄ Snowmen",
      "🕯️ Lights", "🍬 Candy", "🦌 Reindeer", "🎅 Hats", "💫 Sparkles"
    ],
    "graduation-day": [
      "🎓 Caps", "🎉 Confetti", "📜 Diplomas", "🎈 Balloons", "🏆 Trophies",
      "💫 Stars", "✨ Sparkles", "🎊 Ribbons", "🌟 Glow", "👏 Applause"
    ],
    "mothers-day": [
      "🌸 Petals", "💐 Flowers", "💖 Hearts", "🌷 Blooms", "🕊️ Peace",
      "🌞 Light", "🎀 Ribbon", "🍰 Cake", "💫 Sparkles", "🌼 Daisies"
    ],
    default: [
      "✨ Sparkles", "🌸 Petals", "🎉 Confetti", "⭐ Stars", "💖 Hearts",
      "🌈 Glow", "🎇 Lights", "💫 Shimmer", "🎀 Ribbons", "🌟 Twinkle"
    ]
  };

  const found = Object.keys(animations).find((k) => slug.includes(k));
  return animations[found] || animations.default;
}

/* ✨ Renderizar las partículas visuales */
export function AnimationOverlay({ slug = "", animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  /* 🧠 Determinar emojis visuales según categoría */
  const emojiMap = {
    halloween: ["🎃", "👻", "🦇", "💀", "🍬"],
    easter: ["🐰", "🥚", "🌸", "💐", "✨"],
    pets: ["🐶", "🐱", "🐾", "💋", "💖", "🦴", "🎾"],
    july: ["🇺🇸", "🎆", "🎇", "⭐", "💥"],
    valentine: ["💖", "💋", "💌", "🌹", "💞"],
    christmas: ["🎄", "🎅", "❄️", "🎁", "⭐"],
    graduation: ["🎓", "🎉", "📜", "🏆", "🎊"],
    mothers: ["🌸", "💐", "💖", "🌷", "🌼"],
    default: ["✨", "🌸", "🎉", "⭐", "💖"]
  };

  const s = slug.toLowerCase();
  const key = Object.keys(emojiMap).find((k) => s.includes(k)) || "default";
  const baseEmojis = emojiMap[key];

  /* 🔹 Crear partículas */
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 18 + Math.random() * 14,
      emoji: baseEmojis[Math.floor(Math.random() * baseEmojis.length)],
      duration: 4 + Math.random() * 3
    }));
    setParticles(newParticles);
  }, [slug, animation]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999] overflow-visible flex items-center justify-center"
      style={{ opacity: 0.9 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{
            opacity: [0.6, 1, 0],
            y: [p.top, p.top - 80],
            scale: [1, 1.2, 1]
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
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.4))"
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
