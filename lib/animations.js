/* =========================================================
   🎆 ANIMATIONS — 10 por categoría + helper
   ========================================================= */

function parseCategoryFromSlug(slug = "") {
  const s = slug.toLowerCase();
  if (/(independence|july|usa|4th)/.test(s)) return "independence";
  if (/christmas|navidad/.test(s)) return "christmas";
  if (/halloween/.test(s)) return "halloween";
  if (/thanksgiving/.test(s)) return "thanksgiving";
  if (/birthday|cumple/.test(s)) return "birthday";
  if (/love|valentine/.test(s)) return "love";
  if (/condolence|loss|memory|funeral|sympathy/.test(s)) return "condolence";
  if (/easter|bunny/.test(s)) return "easter";
  if (/newyear|year/.test(s)) return "newyear";
  if (/mother/.test(s)) return "mothersday";
  if (/father/.test(s)) return "fathersday";
  if (/pets?|animal/.test(s)) return "pets";
  if (/graduation|grad/.test(s)) return "graduation";
  if (/baby|shower/.test(s)) return "babyshower";
  return "general";
}

const ANIMS = {
  independence: [
    "🇺🇸 Flag Wave",
    "🎆 Firework Burst",
    "🎇 Spark Streak",
    "✨ Star Spark",
    "🗽 Liberty Glow",
    "🎉 RedWhiteBlue",
    "🌟 Sky Flash",
    "💫 Freedom Beam",
    "🎇 Light Rain",
    "🦅 Eagle Sweep",
  ],
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
  mothersday: [
    "🌸 Bloom Light",
    "💐 Flower Glow",
    "💞 Soft Spark",
    "🌷 Petal Rain",
    "✨ Heart Shine",
    "🌼 Gentle Breeze",
    "☀️ Warm Glow",
    "💖 Mom Sparkle",
    "🕯️ Candle Peace",
    "🌹 Love Bloom",
  ],
  fathersday: [
    "👔 Tie Swing",
    "💙 Heart Glow",
    "🌟 Hero Spark",
    "🏆 Pride Shine",
    "🔥 Warm Light",
    "🎉 Cheers Pop",
    "☀️ Gentle Rise",
    "💫 Star Fade",
    "🕯️ Candle Flick",
    "🛠️ Strength Beam",
  ],
  pets: [
    "🐾 Paw Prints",
    "🐕 Tail Wag",
    "🐈 Whisker Flick",
    "💫 Sparkle Fur",
    "🦴 Bone Toss",
    "💖 Heart Paw",
    "🎾 Ball Bounce",
    "✨ Nose Nudge",
    "🌈 Rainbow Trail",
    "🦋 Gentle Flutter",
  ],
  graduation: [
    "🎓 Cap Toss",
    "✨ Spark Trail",
    "🌟 Dream Burst",
    "🎉 Confetti Fly",
    "📜 Scroll Roll",
    "💫 Future Glow",
    "🎇 Star Pop",
    "🏅 Medal Shine",
    "🎊 Pride Stream",
    "🌈 New Path",
  ],
  babyshower: [
    "👶 Bubble Rise",
    "🍼 Milk Drop",
    "🌈 Rainbow Glow",
    "✨ Gentle Sparkle",
    "🌸 Baby Bloom",
    "🎀 Ribbon Float",
    "💖 Heart Puff",
    "🐻 Teddy Fall",
    "☁️ Soft Drift",
    "🎈 Balloon Float",
  ],
  general: [
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

export function getAnimationsForSlug(slug = "") {
  const cat = parseCategoryFromSlug(slug);
  return ANIMS[cat] || ANIMS.general;
  }
