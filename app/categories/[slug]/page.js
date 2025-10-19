"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const categoryData = {
  halloween: {
    title: "Halloween 🎃",
    description: "Discover beautiful Everwish cards for halloween ✨",
    cards: [
      {
        title: "Ghost Halloween Love 1A",
        image: "/videos/ghost_halloween_love_1a.mp4",
      },
      {
        title: "Pumpkin Halloween General 1A",
        image: "/videos/pumpkin_halloween_general_1a.mp4",
      },
      {
        title: "Zombie Halloween Birthday 1A",
        image: "/videos/zombie_halloween_birthday_1a.mp4",
      },
    ],
  },
  christmas: {
    title: "Christmas 🎄",
    description: "Celebrate the magic of Christmas with Everwish 🎁",
    cards: [
      {
        title: "Merry Christmas 1A",
        image: "/videos/merry_christmas_1a.mp4",
      },
      {
        title: "Santa Claus 1A",
        image: "/videos/santa_claus_1a.mp4",
      },
    ],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [query, setQuery] = useState("");

  const category = categoryData[slug];

  if (!category) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-pink-50">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Category not found 😢
        </h1>
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  const filteredCards = category.cards.filter((card) =>
    card.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
          {category.title}
        </h1>

        <p className="text-gray-700 text-lg">{category.description}</p>

        <div className="mt-6">
          <input
            type="text"
            placeholder={`Search in ${category.title}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-gray-700"
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              {/* 🎬 Auto video loop sin controles */}
              <video
                src={card.image}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 truncate">
                  {card.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No cards found 😅
          </p>
        )}
      </div>
    </main>
  );
      }
