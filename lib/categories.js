// 🌸 /lib/categories.js
export const MAIN_CATEGORIES = [
  {
    name: "Holidays",
    slug: "holidays",
    emoji: "🎄",
    color: "#FFF4E0",
    keywords: [
      "halloween", "christmas", "thanksgiving", "easter", "newyear",
      "independenceday", "july4th", "fireworks", "memorialday", "veteransday",
      "laborday", "columbusday", "presidentsday", "mlkday", "stpatricksday",
      "oktoberfest", "pridemonth", "earthday", "womensday", "workersday",
      "friendshipday", "mothersday", "fathersday", "teachersday",
      "heritagemonth", "dayofthedead", "carnival", "kindnessday",
      "diwali", "hanukkah", "ramadan", "lunarnewyear"
    ],
  },
  {
    name: "Love & Romance",
    slug: "love",
    emoji: "❤️",
    color: "#FFE8EE",
    keywords: [
      "valentine", "romance", "anniversary", "wedding", "engagement",
      "proposal", "couple", "relationship", "sweetheart", "heart",
      "kiss", "forever", "date-night", "affection", "together", "love"
    ],
  },
  {
    name: "Celebrations & Special Moments",
    slug: "celebrations",
    emoji: "🎉",
    color: "#FFE7FF",
    keywords: [
      "birthday", "graduation", "mothersday", "fathersday",
      "babyshower", "newbaby", "retirement", "congratulations",
      "genderreveal", "newhome", "newjob", "promotion", "success", "party"
    ],
  },
  {
    name: "Work & Professional Life",
    slug: "work",
    emoji: "💼",
    color: "#EAF4FF",
    keywords: [
      "work", "career", "job", "employee", "promotion", "bossday",
      "achievement", "teamwork", "goal", "dedication",
      "mentor", "leader", "teacher", "doctor", "nurse", "engineer",
      "artist", "coach", "athlete", "volunteer", "entrepreneur",
      "retirement", "colleague", "motivation", "skill", "effort",
    ],
  },
  {
    name: "Condolences & Support",
    slug: "condolences",
    emoji: "🕊️",
    color: "#F8F8F8",
    keywords: [
      "condolence", "sympathy", "getwell", "healing", "encouragement",
      "appreciation", "thankyou", "remembrance", "gratitude", "support",
      "recovery", "loss", "memory", "hope", "care", "empathy", "thanks",
    ],
  },
  {
    name: "Animals & Nature",
    slug: "animals",
    emoji: "🐾",
    color: "#E8FFF3",
    keywords: [
      "pets", "wildlife", "oceanlife", "forest", "farm", "bird",
      "turtle", "elephant", "butterfly", "dolphin", "cat", "dog",
      "nature", "green", "planet", "eco", "flora", "fauna", "garden", "yeti"
    ],
  },
  {
    name: "Seasons",
    slug: "seasons",
    emoji: "🍂",
    color: "#E5EDFF",
    keywords: [
      "spring", "summer", "autumn", "fall", "winter",
      "rainy", "sunny", "snow", "beach", "mountain", "forest", "sunset",
      "travel", "vacation", "breeze", "bloom", "cold", "warm"
    ],
  },
  {
    name: "Inspirational & Friendship",
    slug: "inspirational",
    emoji: "🌟",
    color: "#FFFBE5",
    keywords: [
      "inspiration", "motivation", "hope", "faith", "dream", "success",
      "happiness", "peace", "friendship", "teamwork", "goal", "believe",
      "gratitude", "mindfulness", "positivity", "kindness", "community", "respect",
    ],
  },
];

// ✨ Utilidad compartida para normalizar texto
export const normalize = (str) =>
  str?.toLowerCase()
     .trim()
     .replace(/&/g, "")
     .replace(/\s+/g, "-")
     .replace(/[^a-z0-9-]/g, "");
