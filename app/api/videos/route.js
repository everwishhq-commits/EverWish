export async function GET() {
  const videos = [
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general.mp4",
      slug: "bunny_easter_general",
      categories: ["easter", "general"],
    },
    {
      title: "Dogcat Pets and Animals Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
      slug: "dogcat_petsandanimals_appreciationday",
      categories: ["pets", "animals", "appreciationday"],
    },
    {
      title: "Eagle July 4th Independence Day",
      src: "/videos/eagle_July4th_independenceday_1A.mp4",
      slug: "eagle_July4th_independenceday_1A",
      categories: ["july4th", "independence", "usa"],
    },
    {
      title: "Ghost Halloween Love 1A",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
      categories: ["halloween", "love"],
    },
    {
      title: "Hugs Anniversary Love A1",
      src: "/videos/hugs_anniversary_love_A1.mp4",
      slug: "hugs_anniversary_love_A1",
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
      title: "Pumpkin Halloween General 1A",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
      categories: ["halloween", "general"],
    },
    {
      title: "Zombie Halloween Birthday 1A",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
      categories: ["halloween", "birthday"],
    },
    {
      title: "Turkey Thanksgiving General 1A",
      src: "/videos/turkey_thanksgiving_general1A.mp4",
      slug: "turkey_thanksgiving_general1A",
      categories: ["thanksgiving", "general"],
    },
    {
      title: "Santa Christmas General 1A",
      src: "/videos/santa_christmas_general_1A.mp4",
      slug: "santa_christmas_general_1A",
      categories: ["christmas", "general"],
    },
    {
      title: "Heart Valentine Love 1A",
      src: "/videos/heart_valentine_love_1A.mp4",
      slug: "heart_valentine_love_1A",
      categories: ["valentine", "love"],
    },
  ];

  // ✅ Devolver solo el array (sin “all”)
  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
}
