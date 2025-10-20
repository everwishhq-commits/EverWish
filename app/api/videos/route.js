export async function GET() {
  const videos = [
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general_1A.mp4",
      slug: "bunny_easter_general_1A",
      categories: ["easter", "general"],
    },
    {
      title: "Dogcat Pets and Animals Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday_1A.mp4",
      slug: "dogcat_petsandanimals_appreciationday_1A",
      categories: ["pets", "animals", "appreciationday"],
    },
    {
      title: "Eagle July 4th Independence Day",
      src: "/videos/eagle_july4th_independenceday_1A.mp4",
      slug: "eagle_july4th_independenceday_1A",
      categories: ["independence", "july4th", "usa"],
    },
    {
      title: "Ghost Halloween Love",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
      categories: ["halloween", "love"],
    },
    {
      title: "Hugs Anniversary Love",
      src: "/videos/hugs_anniversary_love_1A.mp4",
      slug: "hugs_anniversary_love_1A",
      categories: ["anniversary", "love"],
    },
    {
      title: "Mother Mother's Day Celebration",
      src: "/videos/mother_mothersday_celebration_1A.mp4",
      slug: "mother_mothersday_celebration_1A",
      categories: ["mothers-day", "celebration"],
    },
    {
      title: "Mother Mother's Day General",
      src: "/videos/mother_mothersday_general_1A.mp4",
      slug: "mother_mothersday_general_1A",
      categories: ["mothers-day", "general"],
    },
    {
      title: "Pumpkin Halloween General",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
      categories: ["halloween", "general"],
    },
    {
      title: "Turkey Thanksgiving General",
      src: "/videos/turkey_thanksgiving_general_1A.mp4",
      slug: "turkey_thanksgiving_general_1A",
      categories: ["thanksgiving", "general"],
    },
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
    {
      title: "Zombie Halloween Birthday",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
      categories: ["halloween", "birthday"],
    },
  ];

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
}
