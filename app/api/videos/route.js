export async function GET() {
  const videos = [
    // 🐰 Easter
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general.mp4",
      slug: "bunny_easter_general",
      categories: ["easter", "general"],
    },

    // 🐶 Pets Appreciation
    {
      title: "Dogcat Pets and Animals Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
      slug: "dogcat_petsandanimals_appreciationday",
      categories: ["pets", "appreciationday"],
    },

    // 🦅 Independence Day
    {
      title: "Eagle July 4th Independence Day",
      src: "/videos/eagle_July4th_independenceday_1A.mp4",
      slug: "eagle_July4th_independenceday_1A",
      categories: ["independence", "usa", "july4th"],
    },

    // 👻 Halloween
    {
      title: "Ghost Halloween Love",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
      categories: ["halloween", "love"],
    },
    {
      title: "Pumpkin Halloween General",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
      categories: ["halloween", "general"],
    },
    {
      title: "Zombie Halloween Birthday",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
      categories: ["halloween", "birthday"],
    },

    // 💘 Love / Anniversary
    {
      title: "Hugs Anniversary Love",
      src: "/videos/hugs_anniversary_love_A1.mp4",
      slug: "hugs_anniversary_love_A1",
      categories: ["anniversary", "love", "valentines"],
    },

    // 👩‍ Mother’s Day
    {
      title: "Mother Mother's Day Celebration",
      src: "/videos/mother_mother'sday_celebration_1A.mp4",
      slug: "mother_mother'sday_celebration_1A",
      categories: ["mother", "mothers-day", "celebration"],
    },
    {
      title: "Mother Mother's Day General",
      src: "/videos/mother_mothers'day_general_1A.mp4",
      slug: "mother_mothers'day_general_1A",
      categories: ["mother", "mothers-day", "general"],
    },

    // 🦃 Thanksgiving
    {
      title: "Turkey Thanksgiving General",
      src: "/videos/turkey_thanksgiving_general1A.mp4",
      slug: "turkey_thanksgiving_general1A",
      categories: ["thanksgiving", "general"],
    },

    // 🎄 Christmas
    {
      title: "Turtle Christmas General",
      src: "/videos/turtle_christmas_general_1A.mp4",
      slug: "turtle_christmas_general_1A",
      categories: ["christmas", "general"],
    },
    {
      title: "Yeti Christmas General",
      src: "/videos/yeti_christmas_general_1A.mp4",
      slug: "yeti_christmas_general_1A",
      categories: ["christmas", "general"],
    },
  ];

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
        }
