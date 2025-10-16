// 📄 lib/messages.js
// 💌 Sistema de mensajes automáticos Everwish
// Este archivo contiene TODOS los mensajes predefinidos según el slug de la tarjeta.
// Se usa para mostrar un mensaje base cuando el usuario abre la tarjeta y personaliza su texto.

// -----------------------------------------------------------------------------
// 🔸 FUNCIONALIDAD
// 1. Cada slug (ej: "ghost-halloween") tiene un mensaje predeterminado.
// 2. Si el slug no existe, se usa el mensaje genérico de Everwish.
// 3. Compatible con cualquier tarjeta nueva que agregues.
// 4. Incluye soporte para fechas, agradecimientos, amor, amistad, condolencias, etc.
// -----------------------------------------------------------------------------

export function defaultMessageFromSlug(slug) {
  const messages = {
    // 🎃 HALLOWEEN
    "ghost-halloween": "Boo! You’re my favorite human to haunt 👻",
    "pumpkin-halloween": "Have a pumpkin-tastic Halloween! 🎃",
    "witch-halloween": "Wishing you a magical and spooky night under the moon! 🌙",
    "zombie-halloween": "Let’s raise the dead with laughter this Halloween 🧟",
    "bat-halloween": "Fangs for being amazing! 🦇 Happy Halloween!",

    // 🩷 LOVE & ROMANCE
    "valentine-heart": "You make every heartbeat feel like poetry 💖",
    "love-roses": "Every moment with you blooms like a rose 🌹",
    "couple-sunset": "Two souls, one heart — forever connected 🌅",
    "heart-edition": "Love isn’t something you find — it’s something you feel 💞",
    "signature-edition": "You are my once-in-a-lifetime wish come true 💫",

    // 🎂 BIRTHDAY
    "birthday-cake": "Make a wish and let the magic begin 🎂✨",
    "birthday-balloons": "It’s your day to shine! Happy Birthday 🎉",
    "birthday-stars": "May your year sparkle brighter than the candles on your cake 🌟",
    "birthday-friends": "Another year older, another reason to celebrate YOU 🥳",

    // 👶 BABY / FAMILY
    "baby-shower": "A new adventure begins — congratulations on your little miracle 👶",
    "baby-girl": "Sugar, spice, and everything nice — it’s a girl! 🎀",
    "baby-boy": "Tiny feet, big dreams — congratulations on your baby boy 💙",
    "new-parents": "Wishing your growing family endless love and laughter 🍼",

    // 🎓 GRADUATION
    "graduation-cap": "The tassel was worth the hassle 🎓 Congratulations!",
    "graduation-stars": "Dream big, shine bright, and never stop learning ✨",
    "graduation-journey": "Here’s to new beginnings and incredible adventures ahead 🚀",

    // 💐 CONDOLENCES
    "condolences-white-flower": "May love and memories bring peace to your heart 🌿",
    "condolences-dove": "Gone from sight, but forever in our hearts 🕊️",
    "condolences-light": "Even in darkness, love remains eternal 🕯️",

    // 💼 ACHIEVEMENTS
    "promotion-celebration": "Hard work always pays off — congrats on your success! 🏆",
    "new-job": "New chapter, new goals, same amazing you 💼",
    "housewarming": "Home is where love grows — congratulations on your new place 🏡",

    // 🐾 PETS
    "pets-day": "To the ones who make our days brighter — our pets! ❤️",
    "cat-love": "Paws and relax — today is all about your furry friend 🐱",
    "dog-friend": "A dog’s love is the purest gift on Earth 🐾",

    // 🇺🇸 HOLIDAYS
    "usa-4th-july": "Proud to celebrate the red, white, and blue with joy and gratitude 🇺🇸",
    "thanksgiving": "Grateful for today, thankful for you 🦃",
    "christmas-tree": "May your heart be warm and your days merry and bright 🎄",
    "new-year": "Here’s to a fresh start, new dreams, and endless blessings ✨🎆",

    // 🌸 MOTHER’S DAY / FATHER’S DAY
    "mothers-day": "Because of you, love has a meaning beyond words 💐 Happy Mother’s Day!",
    "fathers-day": "Strong hands, kind heart — thank you, Dad 💙 Happy Father’s Day!",

    // 💌 THANK YOU / GRATITUDE
    "thank-you": "Your kindness never goes unnoticed. Thank you from the heart 💖",
    "appreciation": "Grateful for your time, your smile, and your presence 🌟",
    "teacher-day": "You inspire dreams and light up young minds. Thank you, teacher 🍎",

    // 🕊️ SPIRITUAL
    "faith-hope": "Where faith grows, miracles follow ✨",
    "peace-light": "Light always finds a way to shine through 🌞",
    "angel-blessing": "Protected by love, guided by light 👼",

    // 🌈 NEUTRAL / GENERIC
    "everwish-general": "Celebrate this special moment with Everwish ✨",
    "generic-bliss": "Wishing you a day filled with love, joy, and good energy 🌸",
  };

  return messages[slug] || messages["everwish-general"];
}

// -----------------------------------------------------------------------------
// 🔸 OPCIONAL: LISTA DE CATEGORÍAS PARA USO FUTURO
// -----------------------------------------------------------------------------
export const messageCategories = {
  halloween: [
    "ghost-halloween",
    "pumpkin-halloween",
    "witch-halloween",
    "zombie-halloween",
    "bat-halloween",
  ],
  love: [
    "valentine-heart",
    "love-roses",
    "couple-sunset",
    "heart-edition",
    "signature-edition",
  ],
  birthday: [
    "birthday-cake",
    "birthday-balloons",
    "birthday-stars",
    "birthday-friends",
  ],
  baby: [
    "baby-shower",
    "baby-girl",
    "baby-boy",
    "new-parents",
  ],
  graduation: [
    "graduation-cap",
    "graduation-stars",
    "graduation-journey",
  ],
  condolences: [
    "condolences-white-flower",
    "condolences-dove",
    "condolences-light",
  ],
  achievements: [
    "promotion-celebration",
    "new-job",
    "housewarming",
  ],
  pets: [
    "pets-day",
    "cat-love",
    "dog-friend",
  ],
  holidays: [
    "usa-4th-july",
    "thanksgiving",
    "christmas-tree",
    "new-year",
  ],
  family: [
    "mothers-day",
    "fathers-day",
  ],
  gratitude: [
    "thank-you",
    "appreciation",
    "teacher-day",
  ],
  spiritual: [
    "faith-hope",
    "peace-light",
    "angel-blessing",
  ],
};
