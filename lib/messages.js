// /lib/messages.js
export function getMessageForSlug(slug) {
  const messages = {
    halloween: [
      "🎃 Have a frightfully fun Halloween full of treats and laughter!",
      "🕸️ Wishing you a magical night of pumpkins, ghosts, and giggles!",
      "👻 Boo! May your Halloween be spooky, silly, and sweet!"
    ],
    easter: [
      "🐰 Wishing you a joyful Easter filled with blessings and chocolate bunnies!",
      "🌷 May your Easter basket overflow with love and happiness!",
      "🐣 Hop into joy — Easter is here to bring peace and smiles!"
    ],
    birthday: [
      "🎉 Celebrate your special day with love, laughter, and endless joy!",
      "🎂 Another year older, wiser, and more wonderful — happy birthday!",
      "💫 May your day sparkle brighter than the candles on your cake!"
    ],
    valentines: [
      "❤️ You make my heart smile — Happy Valentine’s Day!",
      "💌 Love, hugs, and sparkles sent your way today and always.",
      "💖 Every heartbeat says your name — forever my Valentine!"
    ],
    pets: [
      "🐾 To the furry friends who fill our hearts with love — Happy Pet Day!",
      "🐕 You make every day pawsome! Thanks for all the tail wags!",
      "🐾 Because life’s better with paws, purrs, and love!"
    ],
    july4: [
      "🎆 Celebrate freedom, unity, and the stars that shine bright! 🇺🇸",
      "🦅 Let your heart soar high this Independence Day!",
      "💥 Fireworks, fun, and freedom — that’s the American way!"
    ],
    christmas: [
      "🎄 Wishing you a Christmas filled with warmth, joy, and wonder!",
      "❄️ May the magic of the season fill your home with happiness.",
      "🎁 Merry Christmas! Peace, love, and laughter always."
    ],
    graduation: [
      "🎓 You did it! Celebrate your success and shine bright!",
      "📜 Hats off to you — the best is yet to come!",
      "🎉 Congratulations on your amazing achievement — the world is yours!"
    ],
    mothersday: [
      "💐 To the woman who makes life beautiful — Happy Mother’s Day!",
      "🌷 Your love blooms in every smile — thank you, Mom!",
      "❤️ The world shines brighter because of mothers like you!"
    ],
    condolence: [
      "🕊️ May peace find its way to your heart in this moment of sorrow.",
      "🌹 With deepest sympathy — may loving memories bring you comfort.",
      "🤍 In loving memory — gone from sight but never from heart."
    ],
    baby: [
      "👶 Welcome to the world, little one — so loved already!",
      "🍼 A tiny miracle, a bundle of joy — congratulations!",
      "🌟 Wishing your family endless happiness with your new arrival!"
    ],
    love: [
      "💞 Love grows in moments shared — make this one everlasting.",
      "💖 Celebrate this moment with a smile and heart full of light.",
      "🌹 May this day remind you how loved you are."
    ],
    newyear: [
      "🎆 Cheers to new beginnings and brighter days ahead!",
      "🥂 May your year be filled with joy, love, and prosperity!",
      "🎉 New dreams, new hopes, same amazing you!"
    ],
    thanksgiving: [
      "🦃 Grateful hearts make the best memories. Happy Thanksgiving!",
      "🍂 Wishing you warmth, laughter, and full plates today!",
      "💛 May gratitude fill your heart and joy your home."
    ],
    fathersday: [
      "👔 To the man who means the world — Happy Father’s Day!",
      "💪 Thank you for your strength, love, and guidance!",
      "❤️ You’re a hero in every way — celebrate your day, Dad!"
    ],
    wedding: [
      "💍 Two hearts, one love — congratulations on your wedding!",
      "🌸 Wishing you a lifetime of love, laughter, and happiness!",
      "💖 Forever starts today — cheers to your love story!"
    ],
    engagement: [
      "💍 Congratulations on your engagement — love is in the air!",
      "💞 Two souls, one heart — may your journey together be magical!",
      "✨ A new chapter of love begins — cherish every moment!"
    ],
    anniversary: [
      "💘 Another year of love, laughter, and endless memories!",
      "🌹 Happy Anniversary to a beautiful couple!",
      "❤️ Your love story keeps inspiring — cheers to forever!"
    ],
    friendship: [
      "🤗 Here’s to friends who make life brighter every day!",
      "💛 You’re the reason laughter feels so easy — thank you!",
      "🌈 Wishing you smiles, sunshine, and friendship always!"
    ],
    success: [
      "🏆 Congratulations on your amazing success — you earned it!",
      "🌟 Hard work always pays off — celebrate your victory!",
      "🎉 Success looks good on you — keep shining!"
    ],
    getwell: [
      "🌼 Sending healing thoughts and warm hugs your way.",
      "💖 Wishing you strength, comfort, and a speedy recovery!",
      "☀️ Brighter days are coming — feel better soon!"
    ],
    apology: [
      "🙏 I’m truly sorry — I value you more than words can say.",
      "💌 I hope this message helps mend what’s been broken.",
      "💞 Mistakes happen — I just want to make things right again."
    ],
    encouragement: [
      "🌟 You’ve got this — one step at a time, one win at a time.",
      "💪 Keep believing in yourself — brighter days are coming!",
      "✨ The storm doesn’t last forever — keep your light shining!"
    ],
    spiritual: [
      "🙏 May peace, faith, and light surround you always.",
      "🌸 Trust the journey — you’re right where you need to be.",
      "✨ Every sunrise is a blessing — keep your heart open."
    ],
    everwish: [
      "💫 Celebrate this special moment with Everwish — full of joy and light!",
      "🌸 Every day is a reason to smile — make it magical!",
      "✨ Send a wish, share a smile, and spread a little love!"
    ]
  };

  const list = messages[slug] || messages["everwish"];
  return list[Math.floor(Math.random() * list.length)];
}
