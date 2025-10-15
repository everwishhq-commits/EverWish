// lib/animations.js
export function getAnimationsForSlug(slug = "") {
  const base = [
    "✨ Sparkles",
    "🎉 Confetti",
    "💖 Hearts",
    "🌸 Bloom",
    "🌟 Shine",
    "🕊️ Peace",
    "🌈 Glow",
    "💫 Dust",
    "🎇 Light",
    "❌ None",
  ];
  if (/christmas/.test(slug))
    return ["🎄 Snow Glow", "🎅 Gift Pop", "❄️ Snowfall", "🌟 Star Shine", ...base];
  if (/halloween/.test(slug))
    return ["🎃 Pumpkin Glow", "👻 Ghost Drift", "🧙‍♀️ Witch Dust", "🍬 Candy Rain", ...base];
  if (/birthday/.test(slug))
    return ["🎉 Confetti Burst", "🎈 Balloon Rise", "🎂 Cake Spark", "🎊 Party Stream", ...base];
  if (/love|valentine/.test(slug))
    return ["💖 Floating Hearts", "🌹 Rose Fall", "💋 Kiss Burst", "✨ Soft Sparkle", ...base];
  if (/thanksgiving/.test(slug))
    return ["🦃 Turkey Glow", "🍁 Leaf Drift", "🌻 Harvest Bloom", "🔥 Hearth Flicker", ...base];
  return base;
}
