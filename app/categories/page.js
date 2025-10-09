"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

const categorySections = [
  {
    title: "Seasonal & Holidays 🎉",
    items: [
      { name: "New Year’s Day", emoji: "🎆", color: "bg-blue-100", slug: "new-year" },
      { name: "Valentine’s Day", emoji: "💘", color: "bg-pink-200", slug: "valentines" },
      { name: "St. Patrick’s Day", emoji: "🍀", color: "bg-green-200", slug: "st-patricks" },
      { name: "Easter", emoji: "🐣", color: "bg-purple-100", slug: "easter" },
      { name: "Independence Day", emoji: "🎇", color: "bg-red-200", slug: "july-4" },
      { name: "Halloween", emoji: "🎃", color: "bg-orange-200", slug: "halloween" },
      { name: "Thanksgiving", emoji: "🦃", color: "bg-amber-200", slug: "thanksgiving" },
      { name: "Christmas", emoji: "🎄", color: "bg-green-100", slug: "christmas" },
    ],
  },
  {
    title: "Love & Emotions 💖",
    items: [
      { name: "Love & Romance", emoji: "💌", color: "bg-rose-200", slug: "love-romance" },
      { name: "Anniversary", emoji: "💍", color: "bg-pink-100", slug: "anniversary" },
      { name: "I Miss You", emoji: "💭", color: "bg-sky-100", slug: "missing-you" },
      { name: "Apology", emoji: "💐", color: "bg-yellow-100", slug: "apology" },
      { name: "Thinking of You", emoji: "☁️", color: "bg-indigo-100", slug: "thinking-of-you" },
      { name: "Encouragement", emoji: "🌟", color: "bg-lime-100", slug: "encouragement" },
    ],
  },
  {
    title: "Family & Relationships 👨‍👩‍👧‍👦",
    items: [
      { name: "Mother’s Day", emoji: "🌸", color: "bg-pink-200", slug: "mothers-day" },
      { name: "Father’s Day", emoji: "👔", color: "bg-blue-200", slug: "fathers-day" },
      { name: "Grandparents", emoji: "👵", color: "bg-yellow-200", slug: "grandparents" },
      { name: "New Baby", emoji: "👶", color: "bg-sky-200", slug: "new-baby" },
      { name: "Siblings Day", emoji: "🧑‍🤝‍🧑", color: "bg-violet-200", slug: "siblings" },
      { name: "Family Reunion", emoji: "🏠", color: "bg-green-100", slug: "family-reunion" },
    ],
  },
  {
    title: "Celebrations & Events 🥳",
    items: [
      { name: "Birthday", emoji: "🎂", color: "bg-pink-200", slug: "birthday" },
      { name: "Graduation", emoji: "🎓", color: "bg-lime-200", slug: "graduation" },
      { name: "Wedding", emoji: "💒", color: "bg-indigo-200", slug: "wedding" },
      { name: "Engagement", emoji: "💞", color: "bg-rose-200", slug: "engagement" },
      { name: "Retirement", emoji: "🏖️", color: "bg-amber-100", slug: "retirement" },
      { name: "New Home", emoji: "🏡", color: "bg-emerald-100", slug: "new-home" },
    ],
  },
  {
    title: "Work & Professional Appreciation 💼",
    items: [
      { name: "Teacher’s Day", emoji: "🍎", color: "bg-rose-100", slug: "teachers-day" },
      { name: "Nurses Week", emoji: "🩺", color: "bg-teal-200", slug: "nurses-week" },
      { name: "Doctor’s Day", emoji: "⚕️", color: "bg-blue-100", slug: "doctors-day" },
      { name: "Police Appreciation", emoji: "👮‍♂️", color: "bg-gray-100", slug: "police-day" },
      { name: "Firefighters Day", emoji: "🚒", color: "bg-orange-100", slug: "firefighters-day" },
      { name: "Veterans Day", emoji: "🎖️", color: "bg-slate-100", slug: "veterans-day" },
    ],
  },
  {
    title: "Everyday Moments 🌞",
    items: [
      { name: "Good Morning", emoji: "🌅", color: "bg-orange-100", slug: "good-morning" },
      { name: "Good Night", emoji: "🌙", color: "bg-indigo-100", slug: "good-night" },
      { name: "Just Because", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
      { name: "Good Luck", emoji: "🍀", color: "bg-green-100", slug: "good-luck" },
      { name: "Humor", emoji: "😂", color: "bg-rose-100", slug: "humor" },
      { name: "Pets & Animals", emoji: "🐾", color: "bg-emerald-100", slug: "pets" },
    ],
  },
  {
    title: "Health & Support 💚",
    items: [
      { name: "Get Well Soon", emoji: "💊", color: "bg-teal-100", slug: "get-well" },
      { name: "Stay Strong", emoji: "💪", color: "bg-yellow-100", slug: "stay-strong" },
      { name: "Mental Health", emoji: "🧠", color: "bg-blue-200", slug: "mental-health" },
      { name: "Encouragement", emoji: "🌟", color: "bg-lime-100", slug: "encouragement" },
      { name: "Support & Hope", emoji: "🕊️", color: "bg-gray-100", slug: "support-hope" },
    ],
  },
  {
    title: "Sympathy & Remembrance 🕊️",
    items: [
      { name: "Condolences", emoji: "🕯️", color: "bg-gray-100", slug: "condolences" },
      { name: "In Memory", emoji: "🌹", color: "bg-rose-100", slug: "in-memory" },
      { name: "Loss of Pet", emoji: "🐾", color: "bg-green-100", slug: "loss-pet" },
      { name: "Peace & Comfort", emoji: "☁️", color: "bg-blue-100", slug: "peace-comfort" },
    ],
  },
  {
    title: "Inspirations & Quotes ✨",
    items: [
      { name: "Positive Vibes", emoji: "🌈", color: "bg-pink-100", slug: "positive-vibes" },
      { name: "Motivation", emoji: "💪", color: "bg-yellow-100", slug: "motivation" },
      { name: "Life Lessons", emoji: "📘", color: "bg-slate-100", slug: "life-lessons" },
      { name: "Dream Big", emoji: "🌠", color: "bg-indigo-100", slug: "dream-big" },
    ],
  },
  {
    title: "Spiritual & Mindfulness 🕯️",
    items: [
      { name: "Peace & Light", emoji: "🕊️", color: "bg-orange-100", slug: "peace-light" },
      { name: "Mindfulness", emoji: "🧘‍♀️", color: "bg-teal-100", slug: "mindfulness" },
      { name: "Healing Energy", emoji: "💫", color: "bg-lime-100", slug: "healing-energy" },
      { name: "Blessings", emoji: "🙏", color: "bg-yellow-100", slug: "blessings" },
    ],
  },
  {
    title: "Art & Cultural 🎨",
    items: [
      { name: "Art Festival", emoji: "🎭", color: "bg-purple-200", slug: "art-festival" },
      { name: "Music & Dance", emoji: "🎶", color: "bg-blue-200", slug: "music-dance" },
      { name: "Heritage Month", emoji: "🌍", color: "bg-green-200", slug: "heritage-month" },
      { name: "Diversity & Pride", emoji: "🌈", color: "bg-rose-100", slug: "diversity-pride" },
    ],
  },
  {
    title: "Kids & Teens 🧸",
    items: [
      { name: "Back to School", emoji: "🎒", color: "bg-lime-200", slug: "back-school" },
      { name: "Sports", emoji: "⚽", color: "bg-blue-100", slug: "sports" },
      { name: "Cartoons", emoji: "🎨", color: "bg-yellow-200", slug: "cartoons" },
      { name: "Superheroes", emoji: "🦸‍♂️", color: "bg-purple-100", slug: "superheroes" },
    ],
  },
  {
    title: "Humor & Fun 😂",
    items: [
      { name: "Funny Cards", emoji: "🤣", color: "bg-rose-100", slug: "funny-cards" },
      { name: "Puns & Jokes", emoji: "😆", color: "bg-yellow-100", slug: "puns-jokes" },
      { name: "Memes", emoji: "📱", color: "bg-blue-100", slug: "memes" },
    ],
  },
  {
    title: "Pets & Nature 🐾",
    items: [
      { name: "Dog Lovers", emoji: "🐶", color: "bg-green-200", slug: "dog-lovers" },
      { name: "Cat Lovers", emoji: "🐱", color: "bg-pink-100", slug: "cat-lovers" },
      { name: "Nature & Scenery", emoji: "🌄", color: "bg-blue-200", slug: "nature" },
      { name: "Earth Day", emoji: "🌎", color: "bg-emerald-100", slug: "earth-day" },
    ],
  },
  {
    title: "Gifts & Surprises 🎁",
    items: [
      { name: "Thank You", emoji: "🙏", color: "bg-violet-200", slug: "thank-you" },
      { name: "Surprises", emoji: "🎉", color: "bg-yellow-200", slug: "surprises" },
      { name: "Digital Gifts", emoji: "💌", color: "bg-blue-100", slug: "digital-gifts" },
    ],
  },
  {
    title: "Custom & AI Creations 🤖",
    items: [
      { name: "AI Art", emoji: "🌌", color: "bg-teal-100", slug: "ai-art" },
      { name: "Personalized Message", emoji: "✏️", color: "bg-yellow-200", slug: "personalized-message" },
      { name: "Create with Everwish", emoji: "💫", color: "bg-indigo-100", slug: "create-with-everwish" },
    ],
  },
];

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pink-50 text-center pt-24 pb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Explore our Categories</h1>
        <p className="text-gray-700 mb-10">Find the perfect card for every moment 💌</p>

        {categorySections.map((section, index) => (
          <div key={index} className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                {expanded === index ? "Close" : "View all →"}
              </button>
            </div>

            {expanded === index ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {section.items.map((cat, i) => (
                  <Link key={i} href={`/categories/${cat.slug}`}>
                    <div
                      className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                    >
                      <span className="text-4xl mb-2">{cat.emoji}</span>
                      <p className="font-semibold text-gray-800">{cat.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Swiper
                slidesPerView={2.3}
                spaceBetween={15}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 5, spaceBetween: 25 },
                }}
                modules={[Autoplay]}
                className="overflow-visible"
              >
                {section.items.map((cat, i) => (
                  <SwiperSlide key={i}>
                    <Link href={`/categories/${cat.slug}`}>
                      <div
                        className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                      >
                        <span className="text-4xl mb-2">{cat.emoji}</span>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
       }
