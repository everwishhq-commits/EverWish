// lib/messages.js
export function defaultMessageFromSlug(slug = "") {
  const s = slug.toLowerCase();
  if (/christmas/.test(s))
    return "May your days be merry, bright, and filled with love. 🎄✨";
  if (/halloween/.test(s))
    return "Wishing you a spook-tacular night full of magic and candy! 👻🍬";
  if (/thanksgiving/.test(s))
    return "Grateful for every blessing and every smile. 🦃🍁";
  if (/birthday/.test(s))
    return "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂";
  if (/love|valentine/.test(s))
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/mother/.test(s))
    return "Happy Mother’s Day to the heart of our home! 🌸";
  if (/pet|animal/.test(s))
    return "Celebrating the furry friends who make life brighter! 🐾";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}
