import { motion } from "framer-motion";
import React from "react";

/* 🔹 Devuelve lista de animaciones según el evento */
export function getAnimationsForSlug(slug) {
  const sets = {
    "ghost-halloween": [
      "👻 Ghost Float",
      "🎃 Pumpkin Glow",
      "🕸️ Spider Webs",
      "🕯️ Candle Flicker",
      "🧙‍♀️ Witch Trail",
      "🧛‍♂️ Vampire Mist",
      "🪦 Tomb Glow",
      "💀 Skull Spark",
      "🧟 Zombie Drift",
      "🌕 Full Moon Fade"
    ],
    "bunny-easter": [
      "🐰 Hop Trail",
      "🥕 Carrot Rain",
      "🌸 Blossom Drift",
      "🌼 Egg Sparkle",
      "🐣 Chick Hop",
      "🐇 Bunny Loop",
      "🍫 Chocolate Burst",
      "🌷 Tulip Glow",
      "💛 Pastel Hearts",
      "☁️ Soft Clouds"
    ],
    "birthday-celebration": [
      "🎂 Candle Spark",
      "🎈 Balloon Rise",
      "🎉 Confetti Burst",
      "🎊 Streamer Fall",
      "🥳 Party Pop",
      "🍰 Slice Drift",
      "🧁 Cupcake Float",
      "✨ Glitter Rain",
      "🎁 Gift Twinkle",
      "🪅 Piñata Dust"
    ],
    "valentines-love": [
      "❤️ Floating Hearts",
      "💌 Letters of Love",
      "💖 Sparkle Glow",
      "🌹 Rose Petals",
      "💕 Pair Drift",
      "💘 Cupid Arrows",
      "❣️ Red Blush",
      "💞 Heartbeat Pulse",
      "💐 Flower Shower",
      "✨ Romantic Glow"
    ],
    "pets-day": [
      "🐾 Paw Prints",
      "🐶 Dog Bone Drift",
      "🐱 Cat Whiskers",
      "🐕 Woof Pop",
      "🐈 Purr Sparkle",
      "🐾 Double Trail",
      "🐾 Tiny Steps",
      "💛 Tail Wag",
      "🦴 Bone Burst",
      "🌼 Soft Fur Drift"
    ],
    "usa-4th-july": [
      "🇺🇸 Flags Wave",
      "🎆 Fireworks",
      "🦅 Eagle Glide",
      "✨ Spark Trail",
      "💥 Boom Spark",
      "🌟 Liberty Glow",
      "🎇 Celebration Rays",
      "🧨 Firecracker Burst",
      "🎖️ Star Stream",
      "🎵 Parade Float"
    ],
    "christmas-day": [
      "🎄 Snowfall",
      "🎅 Santa Drift",
      "❄️ Icy Glow",
      "🎁 Present Pop",
      "⭐ Star Sparkle",
      "🕯️ Candle Warmth",
      "⛄ Snowman Pop",
      "🧦 Stocking Sway",
      "🍪 Cookie Dust",
      "🎀 Bow Twinkle"
    ],
    "graduation-day": [
      "🎓 Caps Fly",
      "🌟 Glow Up",
      "🎶 Cheers",
      "📜 Diploma Float",
      "💫 Star Trail",
      "🏅 Medal Drift",
      "🎤 Shout Burst",
      "📸 Flash Spark",
      "🎉 Confetti Rain",
      "✨ Bright Future"
    ],
    "mothers-day": [
      "🌷 Flower Bloom",
      "💖 Heart Petals",
      "☀️ Warm Light",
      "🌸 Pink Glow",
      "🕊️ Peace Doves",
      "💐 Bouquet Spark",
      "🌼 Golden Shine",
      "💞 Hug Hearts",
      "🕯️ Candle Glow",
      "✨ Grace Dust"
    ],
    "everwish-general": [
      "✨ Sparkles",
      "🌙 Soft Glow",
      "🌸 Gentle Drift",
      "💫 Light Trail",
      "🌟 Twinkle Fade",
      "🎆 Celebration Pop",
      "🌼 Calm Bloom",
      "☁️ Cloudy Flow",
      "💖 Dream Dust",
      "🎉 Magic Rise"
    ]
  };

  // busca por coincidencia parcial
  const found = Object.keys(sets).find(k => slug.includes(k));
  return sets[found] || sets["everwish-general"];
}

/* 🔹 Renderiza animación global (pantalla completa o dentro de contenedor) */
export function AnimationOverlay({ slug, animation = "✨ Sparkles", fullScreen = false }) {
  const emojiMap = {
    halloween: "🎃",
    bunny: "🐰",
    easter: "🐣",
    birthday: "🎉",
    valentines: "💖",
    love: "❤️",
    pets: "🐾",
    usa: "🇺🇸",
    christmas: "🎄",
    graduation: "🎓",
    mothers: "🌷",
    everwish: "✨"
  };

  const emoji = emojiMap[
    Object.keys(emojiMap).find(k => slug.includes(k)) || "everwish"
  ];

  const count = 20;
  const positionClass = fullScreen
    ? "absolute inset-0"
    : "absolute inset-0 pointer-events-none";

  return (
    <div className={`${positionClass} z-[35] overflow-hidden`}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = i * 0.25;
        const duration = 6 + (i % 3);
        const startX = Math.random() * 100;
        const driftX = (Math.random() - 0.5) * 30;
        const size = 20 + Math.random() * 12;

        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${startX}%`,
              bottom: "-10%",
              fontSize: `${size}px`,
              filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ["0%", "-120%"],
              x: [`0%`, `${driftX}%`],
              rotate: [0, (Math.random() - 0.5) * 40]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
    }
