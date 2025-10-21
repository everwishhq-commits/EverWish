export async function GET() {
  const videos = [
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general.mp4",
      slug: "bunny_easter_general",
    },
    {
      title: "Dogcat Pets and Animals Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
      slug: "dogcat_petsandanimals_appreciationday",
    },
    {
      title: "Eagle July4th Independence Day 1A",
      src: "/videos/eagle_july4th_independenceday_1A.mp4",
      slug: "eagle_july4th_independenceday_1A",
    },
    {
      title: "Ghost Halloween Love 1A",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
    },
    {
      title: "Hugs Anniversary Love A1",
      src: "/videos/hugs_anniversary_love_A1.mp4",
      slug: "hugs_anniversary_love_A1",
    },
    {
      title: "Mother Mothersday Celebration 1A",
      src: "/videos/mother_mothersday_celebration_1A.mp4",
      slug: "mother_mothersday_celebration_1A",
    },
    {
      title: "Mother Mothersday General 1A",
      src: "/videos/mother_mothersday_general_1A.mp4",
      slug: "mother_mothersday_general_1A",
    },
    {
      title: "Pumpkin Halloween General 1A",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
    },
    {
      title: "Zombie Halloween Birthday 1A",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
    },
    {
      title: "Turkey Thanksgiving General 1A",
      src: "/videos/turkey_thanksgiving_general_1A.mp4",
      slug: "turkey_thanksgiving_general_1A",
    },
  ];

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
}
