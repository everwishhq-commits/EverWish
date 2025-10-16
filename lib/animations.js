"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Opciones de animación (solo dropdown) */
export function getAnimationsForSlug(slug) {
  const animations = {
    "ghost-halloween": [
      "🎃 Pumpkins", "👻 Ghosts", "🦇 Bats", "💀 Skulls", "🍬 Candy",
      "🕯️ Candles", "🧙 Magic", "🌙 Moonlight", "🕸️ Webs", "🔥 Jack-o-Lanterns"
    ],
    "bunny-easter": [
      "🐰 Hop Trail", "🥚 Eggs", "🌸 Petals", "💐 Flowers", "🌈 Rainbow",
      "🍫 Chocolate", "🐣 Chicks", "🎀 Ribbons", "✨ Sparkles", "☀️ Sunshine"
    ],
    "pets-day": [
      "🐾 Paw Prints", "🦴 Bones", "🐕 Puppies", "🐈 Kittens", "💋 Kisses",
      "💖 Hearts", "🦋 Butterflies", "🎾 Balls", "🌸 Flowers", "✨ Sparkles"
    ],
    "usa-4th-july": [
      "🎆 Fireworks", "🇺🇸 Flags", "⭐ Stars", "🦅 Eagles", "💥 Explosions",
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

/* ✨ Render solo de la animación seleccionada */
export function AnimationOverlay({ animation = "✨ Sparkles" }) {
  const [particles, setParticles] = useState([]);
  const [key, setKey] = useState(0); // Forzar reinicio con fade

  // 🎯 Mapeo de emojis exactos por tipo (uno a la vez)
  const singleEmoji = (() => {
    const a = animation.toLowerCase();
    if (a.includes("pumpkin")) return "🎃";
    if (a.includes("ghost")) return "👻";
    if (a.includes("bat")) return "🦇";
    if (a.includes("paw")) return "🐾";
    if (a.includes("bone")) return "🦴";
    if (a.includes("pupp")) return "🐕";
    if (a.includes("kitten") || a.includes("cat")) return "🐈";
    if (a.includes("kiss")) return "💋";
    if (a.includes("heart")) return "💖";
    if (a.includes("butterfl")) return "🦋";
    if (a.includes("ball")) return "🎾";
    if (a.includes("spark")) return "✨";
    if (a.includes("petal") || a.includes("flower")) return "🌸";
    if (a.includes("flag")) return "🇺🇸";
    if (a.includes("firework")) return "🎆";
    if (a.includes("confetti")) return "🎉";
    if (a.includes("ribbon")) return "🎀";
    if (a.includes("star")) return "⭐";
    if (a.includes("light")) return "💡";
    return "✨";
  })();

  // 🧩 Generar partículas
  useEffect(() => {
    setKey(prev => prev + 1); // 🔁 Reiniciar animación con fade
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 18 + Math.random() * 14,
      duration: 4 + Math.random() * 3
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
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: [0.6, 1, 0],
              y: [p.top, p.top - 90],
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
