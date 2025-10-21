// 📁 app/api/videos/route.js
export async function GET() {
  const videos = [
    {
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general.mp4",
      slug: "bunny_easter_general",
      category: "Seasonal & Holidays",
    },
    {
      title: "Dog & Cat Pets Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday.mp4",
      slug: "dogcat_petsandanimals_appreciationday",
      category: "Pets & Animal Lovers",
    },
    {
      title: "Eagle July 4th Independence Day 1A",
      src: "/videos/eagle_july4th_independenceday_1A.mp4",
      slug: "eagle_july4th_independenceday_1A",
      category: "Seasonal & Holidays",
    },
    {
      title: "Ghost Halloween Love 1A",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
      category: "Love & Romance",
    },
    {
      title: "Hugs Anniversary Love A1",
      src: "/videos/hugs_anniversary_love_A1.mp4",
      slug: "hugs_anniversary_love_A1",
      category: "Weddings & Anniversaries",
    },
    {
      title: "Mother Mothersday Celebration 1A",
      src: "/videos/mother_mothersday_celebration_1A.mp4",
      slug: "mother_mothersday_celebration_1A",
      category: "Family & Relationships",
    },
    {
      title: "Mother Mothersday General 1A",
      src: "/videos/mother_mothersday_general_1A.mp4",
      slug: "mother_mothersday_general_1A",
      category: "Family & Relationships",
    },
    {
      title: "Pumpkin Halloween General 1A",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
      category: "Seasonal & Holidays",
    },
    {
      title: "Zombie Halloween Birthday 1A",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
      category: "Birthdays",
    },
    {
      title: "Turkey Thanksgiving General 1A",
      src: "/videos/turkey_thanksgiving_general_1A.mp4",
      slug: "turkey_thanksgiving_general_1A",
      category: "Seasonal & Holidays",
    },
  ];

  // ✅ Respuesta limpia con encabezados correctos
  return new Response(JSON.stringify(videos, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
