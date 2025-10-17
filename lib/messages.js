/* 🔹 Mensaje principal por tipo de tarjeta */
export function defaultMessageFromSlug(slug) {
  const map = {
    "ghost-halloween": "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
    "bunny-easter": "Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🐇🍫",
    "birthday-celebration": "Celebrate this special day with joy, smiles, and love! 🎂🎉",
    "valentines-love": "Sending love and sparkles your way this Valentine’s Day! ❤️✨",
    "pets-day": "To the ones who make every day pawsome — our beloved pets! 🐶🐱",
    "usa-4th-july": "Happy 4th of July! Let freedom sparkle and hearts unite! 🎆🇺🇸",
    "christmas-day": "Wishing you peace, joy, and cozy magic this Christmas. 🎄✨",
    "graduation-day": "Congratulations, graduate! The world awaits your brilliance! 🎓🌟",
    "mothers-day": "For the heart that never stops giving — Happy Mother’s Day! 💐❤️",
    "fathers-day": "To the hero we call Dad — Happy Father’s Day! 👔❤️",
    "thanksgiving-day": "Grateful for moments shared and memories made. 🦃🍂",
    "newyear-day": "A new year, a fresh start — make it shine! 🎆✨",
    "sympathy-message": "May love and memories bring you peace and comfort. 🕊️",
    "friendship-day": "Cheers to friends who make life brighter every day! 🌟🤝",
    "baby-shower": "A little miracle is on the way — congratulations! 👶💖",
    "wedding-day": "Two hearts, one love — forever begins today! 💍❤️",
    "everwish-general": "Celebrate this special moment with Everwish. ✨"
  };

  const found = Object.keys(map).find(k => slug.includes(k));
  return map[found] || map["everwish-general"];
}

/* 🔹 Tres mensajes por cada categoría */
export function getMessagesForSlug(slug) {
  const sets = {
    /* 🎃 Halloween */
    "ghost-halloween": [
      "🎃 Have a frightfully fun Halloween full of treats and laughter! 👻",
      "🕸️ Wishing you a magical night of pumpkins, ghosts, and giggles!",
      "👻 Boo! May your Halloween be spooky, silly, and sweet!"
    ],

    /* 🐰 Easter */
    "bunny-easter": [
      "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies! 🍫",
      "🌷 May your Easter basket overflow with love and happiness!",
      "🐣 Hop into joy — Easter is here to bring peace and smiles!"
    ],

    /* 🎂 Birthday */
    "birthday-celebration": [
      "🎉 Celebrate your special day with love, laughter, and endless joy!",
      "🎂 Another year older, wiser, and more wonderful — happy birthday!",
      "💫 May your day sparkle brighter than the candles on your cake!"
    ],

    /* ❤️ Valentine’s / Love */
    "valentines-love": [
      "❤️ You make my heart smile — Happy Valentine’s Day!",
      "💌 Love, hugs, and sparkles sent your way today and always. ✨",
      "💖 Every heartbeat says your name — forever my Valentine!"
    ],

    /* 🐾 Pets / Animals */
    "pets-day": [
      "🐾 To the furry friends who fill our hearts with love — Happy Pet Day!",
      "🐕 You make every day pawsome! Thanks for all the tail wags!",
      "🐾 Because life’s better with paws, purrs, and love!"
    ],

    /* 🇺🇸 July 4 */
    "usa-4th-july": [
      "🎆 Celebrate freedom, unity, and the stars that shine bright! 🇺🇸",
      "🦅 Let your heart soar high this Independence Day!",
      "💥 Fireworks, fun, and freedom — that’s the American way!"
    ],

    /* 🎄 Christmas */
    "christmas-day": [
      "🎄 Wishing you a Christmas filled with warmth, joy, and wonder!",
      "❄️ May the magic of the season fill your home with happiness.",
      "🎁 Merry Christmas! Peace, love, and laughter always."
    ],

    /* 🎓 Graduation */
    "graduation-day": [
      "🎓 You did it! Celebrate your success and shine bright! 🌟",
      "📜 Hats off to you — the best is yet to come!",
      "🎉 Congratulations on your amazing achievement — the world is yours!"
    ],

    /* 💐 Mother’s Day */
    "mothers-day": [
      "💐 To the woman who makes life beautiful — Happy Mother’s Day!",
      "🌷 Your love blooms in every smile — thank you, Mom!",
      "❤️ The world shines brighter because of mothers like you!"
    ],

    /* 👔 Father’s Day */
    "fathers-day": [
      "👔 To the man who taught us strength and kindness — Happy Father’s Day!",
      "💙 Thank you, Dad, for all the love and lessons you’ve shared.",
      "🏆 You’ll always be our hero — today and every day!"
    ],

    /* 🦃 Thanksgiving */
    "thanksgiving-day": [
      "🍂 Grateful for love, laughter, and blessings big and small. 🦃",
      "🥧 Wishing you warmth, joy, and a table full of gratitude!",
      "🧡 Gather, give thanks, and cherish every moment!"
    ],

    /* 🎆 New Year */
    "newyear-day": [
      "🎆 Cheers to new beginnings and brighter tomorrows! ✨",
      "🥂 May this year bring happiness, health, and success!",
      "🌟 New year, new memories — make them count!"
    ],

    /* 🕊️ Sympathy / Condolences */
    "sympathy-message": [
      "🕊️ Sending comfort and peace in this difficult time.",
      "💐 May loving memories bring you strength and solace.",
      "🤍 Keeping you in our thoughts and prayers with love."
    ],

    /* 🤝 Friendship */
    "friendship-day": [
      "🌟 Friends are the family we choose — thank you for being mine!",
      "💫 Life shines brighter with you in it!",
      "🤗 Here’s to endless laughter and unforgettable memories together!"
    ],

    /* 👶 Baby Shower */
    "baby-shower": [
      "👶 A tiny miracle is on the way — congratulations!",
      "💖 Wishing you love and joy as you welcome your little one!",
      "🍼 May your baby’s journey be filled with laughter and dreams!"
    ],

    /* 💍 Wedding */
    "wedding-day": [
      "💍 Two hearts, one love — forever begins today!",
      "💞 May your life together be filled with endless happiness!",
      "🌸 Here’s to love, laughter, and happily ever after!"
    ],

    /* ✨ General (Everwish) */
    "everwish-general": [
      "✨ Celebrate this special moment with Everwish — full of joy and light!",
      "🌸 Every day is a reason to smile — make it magical!",
      "💫 Send a wish, share a smile, and spread a little love!"
    ]
  };

  const found = Object.keys(sets).find(k => slug.includes(k));
  return sets[found] || sets["everwish-general"];
    }
