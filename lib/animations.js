// lib/animations.js
// 10 animaciones por celebración + helper por slug

export const ANIM_SETS = {
  christmas: [
    "🎄 Snow Glow",
    "🎁 Santa Spark",
    "✨ Twinkle Lights",
    "❄️ Snowfall",
    "🕯️ Candle Light",
    "🎅 Gift Pop",
    "🌟 Star Shine",
    "💫 Magic Dust",
    "🧦 Cozy Socks",
    "🔔 Jingle Bells",
  ],
  halloween: [
    "🎃 Pumpkin Glow",
    "👻 Ghost Drift",
    "🕸️ Web Fall",
    "🧙‍♀️ Witch Dust",
    "🦇 Bat Flight",
    "🪄 Spark Potion",
    "💀 Skull Flicker",
    "🕯️ Candle Mist",
    "🌕 Moonlight Fade",
    "🍬 Candy Rain",
  ],
  thanksgiving: [
    "🦃 Turkey Glow",
    "🍂 Leaf Drift",
    "🍁 Fall Wind",
    "🕯️ Warm Light",
    "🥧 Pie Puff",
    "🌻 Harvest Bloom",
    "🍗 Feast Fade",
    "🌾 Grain Wave",
    "🍃 Gentle Breeze",
    "🔥 Hearth Flicker",
  ],
  birthday: [
    "🎉 Confetti Burst",
    "🎂 Cake Spark",
    "🎈 Balloon Rise",
    "✨ Glitter Pop",
    "🎊 Party Stream",
    "💝 Ribbon Glow",
    "🌈 Color Rain",
    "🎁 Gift Slide",
    "🪩 Disco Spin",
    "🥳 Smile Twirl",
  ],
  love: [
    "💖 Floating Hearts",
    "💘 Cupid Spark",
    "💞 Pink Glow",
    "🌹 Rose Fall",
    "💋 Kiss Burst",
    "✨ Soft Sparkle",
    "🌸 Bloom Fade",
    "💕 Heart Trail",
    "💫 Romantic Dust",
    "🕯️ Candle Flicker",
  ],
  condolence: [
    "🕊️ Dove Flight",
    "🌿 Leaf Drift",
    "🌧️ Soft Rain",
    "💫 Gentle Light",
    "🌸 Petal Fall",
    "✨ Peace Glow",
    "🌙 Moon Fade",
    "🪶 Feather Drift",
    "🕯️ Candle Calm",
    "🌾 Serenity Wave",
  ],
  independence: [
    "🇺🇸 Flag Wave",
    "🎆 Firework Burst",
    "✨ Star Spark",
    "🗽 Liberty Glow",
    "🎇 Light Rain",
    "🔥 Spark Trail",
    "💫 Freedom Beam",
    "🎉 RedWhiteBlue",
    "🌟 Sky Flash",
    "🦅 Eagle Sweep",
  ],
  easter: [
    "🐰 Hop Trail",
    "🌸 Flower Bloom",
    "🌼 Petal Pop",
    "🥚 Egg Jump",
    "🌷 Spring Glow",
    "✨ Gentle Sparkle",
    "☀️ Morning Shine",
    "🕊️ Dove Peace",
    "💐 Joy Spread",
    "🍃 Fresh Air",
  ],
  newyear: [
    "🎆 Fireworks",
    "✨ Glitter Burst",
    "🎇 Star Rain",
    "🌟 Spark Trail",
    "🎉 Pop Stream",
    "🍾 Champagne Rise",
    "💫 Midnight Glow",
    "🕛 Clock Flash",
    "🎊 Joy Burst",
    "🌈 New Dawn",
  ],
  fallback: [
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
  ],
};

const findBuckets = (slug = "") => {
  const s = slug.toLowerCase();
  const b = [];
  if (/christmas|navidad/.test(s)) b.push("christmas");
  if (/halloween/.test(s)) b.push("halloween");
  if (/thanksgiving/.test(s)) b.push("thanksgiving");
  if (/birthday|cumple/.test(s)) b.push("birthday");
  if (/love|valentine/.test(s)) b.push("love");
  if (/condolence|loss|memory|funeral/.test(s)) b.push("condolence");
  if (/independence|july|usa/.test(s)) b.push("independence");
  if (/easter|bunny/.test(s)) b.push("easter");
  if (/newyear|year/.test(s)) b.push("newyear");
  return b;
};

export function getAnimationsForSlug(slug = "") {
  const cats = findBuckets(slug);
  if (!cats.length) return ANIM_SETS.fallback;
  const bag = [];
  cats.forEach((c) => bag.push(...ANIM_SETS[c]));
  // Únicas y máximo 10
  return Array.from(new Set(bag)).slice(0, 10);
                                        }
