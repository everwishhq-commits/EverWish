"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🧩 Listado de animaciones por categoría (solo para el dropdown) */
export function getAnimationsForSlug(slug) {
  const animations = {
    "ghost-halloween": [
      "🎃 Pumpkins", "👻 Ghosts", "🦇 Bats", "💀 Skulls", "🍬 Candy",
      "🧙 Magic", "🕸️ Webs", "🔥 Jack-o-Lanterns", "🌙 Moonlight", "🕯️ Candles"
    ],
    "bunny-easter": [
      "🐰 Hop Trail", "🥚 Eggs", "🌸 Petals", "💐 Flowers", "🌈 Rainbow",
      "🍫 Chocolate", "🐣 Chicks", "🎀 Ribbons", "✨ Sparkles", "☀️ Sunshine"
    ],
    "pets-day": [
      "🐶 Puppies", "🐱 Kittens", "🐾 Paw Prints", "🦴 Bones", "💋 Kisses",
      "💖 Hearts", "🦋 Butterflies", "🎾 Balls", "🌸 Flowers", "✨ Sparkles"
    ],
    "usa-4th-july": [
      "🎆 Fireworks", "🇺🇸 Flags", "🦅 Eagles", "⭐ Stars", "💥 Explosions",
      "🎇 Celebration", "🗽 Liberty Lights", "❤️💙 Confetti", "✨ Sparkles", "🎉 Cheers"
    ],
    "valentines-love": [
      "💖 Hearts", "💋 Kisses", "💌 Letters", "🌹 Roses", "💞 Swirls",
      "🎀 Ribbons", "🕊️ Doves", "✨ Sparkles", "💘 Cupid", "🌸 Petals"
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

  const found = Object.keys(animations).find(k => slug.includes(k));
  return animations[found] || animations.default;
}

/* ✨ Renderizar solo la animación elegida */
export function AnimationOverlay({ animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);

  // 🔹 Determinar emojis solo según la animación elegida (dropdown)
  const emojiSet = (() => {
    const a = animation.toLowerCase();
    if (a.includes("pumpkin")) return ["🎃", "🧙", "🕸️"];
    if (a.includes("ghost")) return ["👻", "💀", "🍬"];
    if (a.includes("paw")) return ["🐾", "🐶", "🐱"];
    if (a.includes("bones")) return ["🦴", "🐾"];
    if (a.includes("kiss")) return ["💋", "💖"];
    if (a.includes("heart")) return ["💖", "💞", "💘"];
    if (a.includes("butterfl")) return ["🦋", "🌸"];
    if (a.includes("ball")) return ["🎾", "🐾"];
    if (a.includes("spark")) return ["✨", "💫", "🌟"];
    if (a.includes("petal") || a.includes("flower")) return ["🌸", "🌷", "🌼"];
    if (a.includes("flag")) return ["🇺🇸", "⭐"];
    if (a.includes("firework")) return ["🎆", "🎇", "💥"];
    if (a.includes("confetti")) return ["🎉", "🎊", "⭐"];
    if (a.includes("ribbon")) return ["🎀", "💖"];
    if (a.includes("star")) return ["⭐", "🌟", "✨"];
    return ["✨", "💫"];
  })();

  // 🔹 Crear partículas solo cuando se cambia la animación
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 18 + Math.random() * 14,
      emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
      duration: 4 + Math.random() * 3
    }));
    setParticles(newParticles);
  }, [animation]);

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
