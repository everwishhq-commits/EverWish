import { NextResponse } from "next/server";

export async function GET() {
  const videos = [
    {
      title: "Pumpkin Halloween General",
      src: "/videos/pumpkin_halloween_general_1A.mp4",
      slug: "pumpkin_halloween_general_1A",
      categories: ["halloween", "general"],
    },
    {
      title: "Ghost Halloween Love",
      src: "/videos/ghost_halloween_love_1A.mp4",
      slug: "ghost_halloween_love_1A",
      categories: ["halloween", "love"],
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
      title: "Bunny Easter General",
      src: "/videos/bunny_easter_general_1A.mp4",
      slug: "bunny_easter_general_1A",
      categories: ["easter", "general"],
    },
    {
      title: "Dogcat Pets Appreciation Day",
      src: "/videos/dogcat_petsandanimals_appreciationday_1A.mp4",
      slug: "dogcat_petsandanimals_appreciationday_1A",
      categories: ["petsandanimals", "appreciationday"],
    },
    {
      title: "Mother Mother's Day Celebration",
      src: "/videos/mother_mothersday_celebration_1A.mp4",
      slug: "mother_mothersday_celebration_1A",
      categories: ["mothersday", "celebration"],
    },
    {
      title: "Mother Mother's Day General",
      src: "/videos/mother_mothersday_general_1A.mp4",
      slug: "mother_mothersday_general_1A",
      categories: ["mothersday", "general"],
    },
    {
      title: "Hugs Anniversary Love",
      src: "/videos/hugs_anniversary_love_1A.mp4",
      slug: "hugs_anniversary_love_1A",
      categories: ["anniversary", "love"],
    },
    {
      title: "Eagle July 4th Independence Day",
      src: "/videos/eagle_July4th_independenceday_1A.mp4",
      slug: "eagle_July4th_independenceday_1A",
      categories: ["july4th", "independenceday"],
    },
    {
      title: "Zombie Halloween Birthday",
      src: "/videos/zombie_halloween_birthday_1A.mp4",
      slug: "zombie_halloween_birthday_1A",
      categories: ["halloween", "birthday"],
    },
  ];

  return NextResponse.json(videos);
}
