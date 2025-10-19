export async function GET() {
  const videos = [
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general.mp4",
      slug: "bunny_easter_general",
    },
    {
      title: "Dogcat Petsandanimals Appreciationday",
      src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
      slug: "dogcat_petsandanimals_appreciationday",
    },
    {
      title: "Eagle July4th Independenceday 1A",
      src: "/videos/eagle_July4th_independenceday_1A.mp4",
      slug: "eagle_July4th_independenceday_1A",
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
      title: "Mother Mother'sDay Celebration 1A",
      src: "/videos/mother_mother'sday_celebration_1A.mp4",
      slug: "mother_mother'sday_celebration_1A",
    },
    {
      title: "Mother Mothers'Day General 1A",
      src: "/videos/mother_mothers'day_general_1A.mp4",
      slug: "mother_mothers'day_general_1A",
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
      title: "Turkey Thanksgiving General1A",
      src: "/videos/turkey_thanksgiving_general1A.mp4",
      slug: "turkey_thanksgiving_general1A",
    },
  ];

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
                      }
