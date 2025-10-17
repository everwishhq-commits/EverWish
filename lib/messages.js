/* 📝 Everwish – Mensajes predeterminados por categoría (25 en total)
   ---------------------------------------------------------------
   Cada categoría tiene:
   - 1 mensaje por defecto (para `defaultMessageFromSlug`)
   - 3 mensajes alternativos (para `getMessagesForSlug`)
*/

/* 🔹 Mensaje base automático por slug */
export function defaultMessageFromSlug(slug) {
  const map = {
    "ghost-halloween": "🎃 Have a frightfully fun Halloween full of treats and laughter! 👻",
    "bunny-easter": "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🍫",
    "birthday-celebration": "🎂 Celebrate your special day with smiles, joy, and love!",
    "valentines-love": "💖 Sending love and sparkles your way this Valentine’s Day!",
    "pets-day": "🐾 To the ones who make every day pawsome — our beloved pets! 🐶🐱",
    "usa-4th-july": "🎆 Happy 4th of July! Let freedom sparkle and hearts unite! 🇺🇸",
    "christmas-day": "🎄 Wishing you peace, joy, and cozy magic this Christmas. ✨",
    "graduation-day": "🎓 Congratulations, graduate! The world awaits your brilliance! 🌟",
    "mothers-day": "💐 For the heart that never stops giving — Happy Mother’s Day! ❤️",
    "newyear-day": "🥂 Cheers to a year full of joy, love, and new adventures! ✨",
    "fathers-day": "👔 To the best dad ever — thanks for all the love and wisdom! 💙",
    "anniversary-love": "💍 Celebrating a love that grows stronger every day. ❤️",
    "friendship-day": "🤝 Friends make the world brighter — happy friendship day!",
    "baby-shower": "🍼 Wishing endless joy for the beautiful new life on the way!",
    "wedding-day": "💒 A day of forever — wishing you love and laughter always!",
    "thanksgiving-day": "🦃 Grateful hearts, cozy moments — Happy Thanksgiving! 🍁",
    "teacher-appreciation": "🍎 To those who light the way — thank you, teachers! 🌟",
    "halloween-pumpkin": "👻 Boo! May your night be filled with candy and laughter! 🎃",
    "spring-day": "🌸 Let your heart bloom this Spring — it’s a season of joy!",
    "autumn-day": "🍂 Embrace the cozy magic of Autumn — full of color and calm.",
    "winter-day": "❄️ May your winter be warm with smiles and soft lights.",
    "everwish-general": "✨ Celebrate this special moment with Everwish.",
    "sympathy-day": "🕊️ Sending comfort, peace, and love during this time.",
    "engagement-day": "💎 Two hearts, one promise — congratulations on your engagement!",
    "congratulations-day": "🎉 Bravo! You did it — your success deserves to shine!",
  };

  const found = Object.keys(map).find((k) => slug.includes(k));
  return map[found] || map["everwish-general"];
}

/* 🔹 Tres mensajes alternativos por categoría */
export function getMessagesForSlug(slug) {
  const sets = {
    "ghost-halloween": [
      "🎃 Have a frightfully fun Halloween full of treats and laughter! 👻",
      "🕸️ Wishing you a magical night of pumpkins, ghosts, and giggles!",
      "👻 Boo! May your Halloween be spooky, silly, and sweet!",
    ],
    "bunny-easter": [
      "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🍫",
      "🌷 May your Easter basket overflow with love and happiness!",
      "🐣 Hop into joy — Easter is here to bring peace and smiles!",
    ],
    "birthday-celebration": [
      "🎉 Celebrate your special day with love, laughter, and endless joy!",
      "🎂 Another year older, wiser, and more wonderful — happy birthday!",
      "💫 May your day sparkle brighter than the candles on your cake!",
    ],
    "valentines-love": [
      "❤️ You make my heart smile — Happy Valentine’s Day!",
      "💌 Love, hugs, and sparkles sent your way today and always. ✨",
      "💖 Every heartbeat says your name — forever my Valentine!",
    ],
    "pets-day": [
      "🐾 To the furry friends who fill our hearts with love — Happy Pet Day!",
      "🐕 You make every day pawsome! Thanks for all the tail wags!",
      "🐾 Because life’s better with paws, purrs, and love!",
    ],
    "usa-4th-july": [
      "🎆 Celebrate freedom, unity, and the stars that shine bright! 🇺🇸",
      "🦅 Let your heart soar high this Independence Day!",
      "💥 Fireworks, fun, and freedom — that’s the American way!",
    ],
    "christmas-day": [
      "🎄 Wishing you a Christmas filled with warmth, joy, and wonder!",
      "❄️ May the magic of the season fill your home with happiness.",
      "🎁 Merry Christmas! Peace, love, and laughter always.",
    ],
    "graduation-day": [
      "🎓 You did it! Celebrate your success and shine bright! 🌟",
      "📜 Hats off to you — the best is yet to come!",
      "🎉 Congratulations on your amazing achievement — the world is yours!",
    ],
    "mothers-day": [
      "💐 To the woman who makes life beautiful — Happy Mother’s Day!",
      "🌷 Your love blooms in every smile — thank you, Mom!",
      "❤️ The world shines brighter because of mothers like you!",
    ],
    "newyear-day": [
      "🎆 Cheers to new beginnings and endless joy this year! 🥂",
      "✨ May your year be bright, kind, and full of surprises.",
      "🎇 Here’s to love, laughter, and everything you wish for!",
    ],
    "fathers-day": [
      "👔 Happy Father’s Day to the world’s greatest role model!",
      "💙 Thank you for your wisdom, strength, and love.",
      "🛠️ You’re the real superhero — we love you, Dad!",
    ],
    "anniversary-love": [
      "💍 Another year, another reason to love you more.",
      "❤️ Wishing you endless love and laughter together.",
      "💞 Cheers to forever — happy anniversary!",
    ],
    "friendship-day": [
      "🤝 True friends make every day special — cheers to you!",
      "💛 Grateful for your friendship and all our memories.",
      "🌈 Friendship makes life’s journey beautiful — thank you!",
    ],
    "baby-shower": [
      "🍼 A tiny miracle is on the way — congratulations!",
      "🌸 Wishing you joy, laughter, and sweet baby giggles!",
      "👶 The best adventures start with a little heartbeat.",
    ],
    "wedding-day": [
      "💒 Wishing you love, laughter, and happily ever after!",
      "💍 Two hearts, one promise — forever together.",
      "🎉 Congratulations on your beautiful beginning!",
    ],
    "thanksgiving-day": [
      "🦃 Thankful for laughter, love, and pumpkin pie!",
      "🍁 Gratitude turns moments into blessings.",
      "🥧 May your home be full of warmth and joy this Thanksgiving.",
    ],
    "teacher-appreciation": [
      "🍎 Great teachers inspire great dreams — thank you!",
      "📚 You shape minds and hearts — we appreciate you!",
      "🌟 Teaching is the greatest gift — you make a difference daily.",
    ],
    "spring-day": [
      "🌸 Bloom with grace — Spring is here to inspire you!",
      "🌼 Fresh starts, bright skies, and new dreams ahead.",
      "🌷 Let every flower remind you that change is beautiful.",
    ],
    "autumn-day": [
      "🍂 Fall into cozy moments and crisp air delight.",
      "🧣 Sweater weather, warm hearts, and pumpkin spice vibes.",
      "🍁 Enjoy the beauty of every falling leaf.",
    ],
    "winter-day": [
      "❄️ Cold days, warm hearts — happy winter season!",
      "🎿 Let it snow joy and sparkle in your heart.",
      "🔥 Cozy nights and starlit dreams await you.",
    ],
    "sympathy-day": [
      "🕊️ May love and peace bring you comfort.",
      "💐 Thinking of you in this time of sorrow.",
      "❤️ You’re not alone — sending strength and care.",
    ],
    "engagement-day": [
      "💍 Congratulations on finding your forever love!",
      "💎 Two hearts, one journey — wishing you joy ahead.",
      "🎉 A love story begins — best wishes on your engagement!",
    ],
    "congratulations-day": [
      "🎉 Bravo! You did it — shine bright, always!",
      "🏆 Success suits you perfectly — congratulations!",
      "🌟 Keep going — your journey has just begun!",
    ],
    "everwish-general": [
      "✨ Celebrate this special moment with Everwish — full of joy and light!",
      "🌸 Every day is a reason to smile — make it magical!",
      "💫 Send a wish, share a smile, and spread a little love!",
    ],
  };

  const found = Object.keys(sets).find((k) => slug.includes(k));
  return sets[found] || sets["everwish-general"];
}
