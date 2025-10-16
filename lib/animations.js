"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* 🎨 Catálogo de animaciones disponibles (para el dropdown) */
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
      "🐶 Puppies", "🐱 Kittens", "🐾 Paw Prints", "🦴 Bones", "🎾 Balls",
      "💋 Kisses", "💖 Hearts", "🦋 Butterflies", "🍖 Treats", "✨ Sparkles"
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

/* 🧠 Determinar emojis base según slug (por tipo de tarjeta) */
function getEmojiSetBySlug(slug) {
  const s = slug.toLowerCase();
  if (s.includes("halloween")) return ["🎃", "👻", "🦇", "💀", "🍬"];
  if (s.includes("easter")) return ["🐰", "🥚", "🌸", "💐", "✨"];
  if (s.includes("pet")) return ["🐶", "🐱", "🐾", "🦴", "🎾", "💋", "💖", "🍖"];
  if (s.includes("valentine")) return ["💖", "💋", "🌹", "💌", "🎀"];
  if (s.includes("july")) return ["🇺🇸", "🎆", "🎇", "⭐"];
  if (s.includes("christmas")) return ["🎄", "❄️", "🎁", "⭐", "🎅"];
  if (s.includes("graduation")) return ["🎓", "🎉", "🏆", "🎈"];
  if (s.includes("mother")) return ["🌸", "💐", "💖", "🌷"];
  return ["✨", "💫", "🌟"];
}

/* ✨ Render de animaciones */
export function AnimationOverlay({ slug = "", animation = "" }) {
  const [particles, setParticles] = useState([]);
  const [key, setKey] = useState(0);

  // 🐾 Si no hay animación seleccionada, usar una del slug automáticamente
  const emojiSet = (() => {
    if (!animation || animation === "No animation") {
      return getEmojiSetBySlug(slug);
    }
    const a = animation.toLowerCase();
    if (a.includes("pumpkin")) return ["🎃"];
    if (a.includes("ghost")) return ["👻"];
    if (a.includes("bat")) return ["🦇"];
    if (a.includes("paw")) return ["🐾"];
    if (a.includes("bone")) return ["🦴"];
    if (a.includes("ball")) return ["🎾"];
    if (a.includes("pupp")) return ["🐶"];
    if (a.includes("kitten") || a.includes("cat")) return ["🐱"];
    if (a.includes("kiss")) return ["💋"];
    if (a.includes("heart")) return ["💖"];
    if (a.includes("butterfl")) return ["🦋"];
    if (a.includes("flower") || a.includes("petal")) return ["🌸"];
    if (a.includes("flag")) return ["🇺🇸"];
    if (a.includes("firework")) return ["🎆"];
    if (a.includes("confetti")) return ["🎉"];
    if (a.includes("ribbon")) return ["🎀"];
    if (a.includes("star")) return ["⭐"];
    return getEmojiSetBySlug(slug);
  })();

  // 🎬 Generar menos partículas (más elegante)
  useEffect(() => {
    setKey(prev => prev + 1);
    const total = Math.floor(15 + Math.random() * 10); // entre 15 y 25
    const newParticles = Array.from({ length: total }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: 18 + Math.random() * 14,
      emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
      duration: 5 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [slug, animation]);

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
            initial={{ opacity: 0, y: 40, x: 0, scale: 0.9 }}
            animate={{
              opacity: [0.6, 1, 0],
              y: [p.top, p.top - 90],
              x: [p.left, p.left + Math.sin(p.id) * 15], // 🌬 ligero movimiento lateral
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
            {p.emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
  }
