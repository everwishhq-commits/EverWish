"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

/* 🔹 Definimos las animaciones por categoría */
const animationSets = {
  easter: [
    "🐰 bunnies",
    "🥚 eggs",
    "🌸 flowers",
    "🌼 petals",
    "🐥 chicks",
    "💐 tulips",
    "🌷 blossoms",
    "🎀 ribbons",
    "🌈 glow",
    "✨ sparkles",
  ],
  july4: [
    "🎆 fireworks",
    "🇺🇸 flags",
    "🦅 eagles",
    "🎇 bursts",
    "💥 stars",
    "🎉 confetti",
    "🎈 balloons",
    "🔥 sparkles",
    "🧨 rockets",
    "✨ twinkle",
  ],
  halloween: [
    "🎃 pumpkins",
    "👻 ghosts",
    "🕸️ webs",
    "🕷️ spiders",
    "🦇 bats",
    "💀 skulls",
    "🩸 drops",
    "🍬 candies",
    "🪄 sparkles",
    "🌙 moons",
  ],
  pets: [
    "🐾 paw prints",
    "🐕 dogs",
    "🐈 cats",
    "🦴 bones",
    "🐾 tracks",
    "🐶 faces",
    "🐾 hearts",
    "🦴 treats",
    "🐾 ribbons",
    "✨ sparkles",
  ],
  christmas: [
    "🎄 trees",
    "🎁 gifts",
    "⭐ stars",
    "❄️ snowflakes",
    "🕯️ candles",
    "🎅 santa",
    "🦌 reindeers",
    "🪄 sparkles",
    "⛄ snowmen",
    "💫 twinkle",
  ],
  valentine: [
    "💖 hearts",
    "💘 arrows",
    "💋 kisses",
    "🌹 roses",
    "🕊️ doves",
    "💞 sparkles",
    "💌 letters",
    "🌸 petals",
    "🫶 hands",
    "✨ shimmer",
  ],
  default: [
    "✨ sparkles",
    "🌸 petals",
    "🎉 confetti",
    "⭐ stars",
    "💖 hearts",
    "🌈 glow",
    "🎀 ribbons",
    "💫 shimmer",
    "🌟 twinkle",
    "🌺 lights",
  ],
};

/* 🔸 Detectar set según slug */
export function getAnimationsForSlug(slug = "") {
  const lower = slug.toLowerCase();
  if (lower.includes("easter") || lower.includes("bunny")) return animationSets.easter;
  if (lower.includes("4th") || lower.includes("usa")) return animationSets.july4;
  if (lower.includes("halloween") || lower.includes("ghost") || lower.includes("pumpkin"))
    return animationSets.halloween;
  if (lower.includes("pet") || lower.includes("dog") || lower.includes("cat"))
    return animationSets.pets;
  if (lower.includes("christmas")) return animationSets.christmas;
  if (lower.includes("valentine") || lower.includes("love")) return animationSets.valentine;
  return animationSets.default;
}

/* 🔹 Overlay animado general */
export function AnimationOverlay({ slug, animation }) {
  useEffect(() => {
    const container = document.createElement("div");
    container.className =
      "fixed inset-0 pointer-events-none overflow-hidden z-[150]";
    document.body.appendChild(container);

    const symbols = Array.from({ length: 10 }).map((_, i) => {
      const el = document.createElement("div");
      el.textContent = getSymbol(animation);
      el.style.position = "absolute";
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `-${Math.random() * 10}%`;
      el.style.fontSize = `${Math.random() * 24 + 16}px`;
      el.style.opacity = "0.9";
      el.style.animation = `floatDown ${
        5 + Math.random() * 3
      }s linear infinite`;
      el.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(el);
      return el;
    });

    return () => container.remove();
  }, [slug, animation]);

  return (
    <style jsx global>{`
      @keyframes floatDown {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `}</style>
  );
}

/* 🔸 Asignar símbolo según nombre */
function getSymbol(name = "") {
  const n = name.toLowerCase();
  if (n.includes("bunny")) return "🐰";
  if (n.includes("egg")) return "🥚";
  if (n.includes("flower") || n.includes("petal")) return "🌸";
  if (n.includes("chick")) return "🐥";
  if (n.includes("flag")) return "🇺🇸";
  if (n.includes("firework") || n.includes("burst")) return "🎆";
  if (n.includes("star")) return "⭐";
  if (n.includes("confetti")) return "🎉";
  if (n.includes("balloon")) return "🎈";
  if (n.includes("rocket")) return "🧨";
  if (n.includes("pumpkin")) return "🎃";
  if (n.includes("ghost")) return "👻";
  if (n.includes("bat")) return "🦇";
  if (n.includes("spider")) return "🕷️";
  if (n.includes("web")) return "🕸️";
  if (n.includes("skull")) return "💀";
  if (n.includes("bone")) return "🦴";
  if (n.includes("paw")) return "🐾";
  if (n.includes("dog")) return "🐶";
  if (n.includes("cat")) return "🐱";
  if (n.includes("reindeer")) return "🦌";
  if (n.includes("snow")) return "❄️";
  if (n.includes("tree")) return "🎄";
  if (n.includes("gift")) return "🎁";
  if (n.includes("heart")) return "💖";
  if (n.includes("rose")) return "🌹";
  if (n.includes("kiss")) return "💋";
  if (n.includes("ribbon")) return "🎀";
  if (n.includes("glow")) return "🌈";
  if (n.includes("sparkle")) return "✨";
  if (n.includes("twinkle")) return "🌟";
  if (n.includes("shimmer")) return "💫";
  if (n.includes("light")) return "💡";
  return "✨";
}
