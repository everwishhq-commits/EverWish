"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";

const mainCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays" },
  { name: "Birthdays", emoji: "🎂", color: "bg-pink-200", slug: "birthdays" },
  { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships" },
  { name: "Babies & Parenting", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting" },
  { name: "Weddings & Anniversaries", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries" },
  { name: "Congratulations & Milestones", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones" },
  { name: "School & Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation" },
  { name: "Work & Professional", emoji: "💼", color: "bg-cyan-200", slug: "work-professional" },
  { name: "House & Moving", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving" },
  { name: "Health & Support", emoji: "🩺", color: "bg-teal-200", slug: "health-support" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance" },
  { name: "Encouragement & Motivation", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation" },
  { name: "Thank You & Appreciation", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation" },
  { name: "Invitations & Events", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events" },
  { name: "Spiritual & Mindfulness", emoji: "🕯️", color: "bg-orange-200", slug: "spiritual-mindfulness" },
  { name: "Art & Cultural", emoji: "🎨", color: "bg-stone-200", slug: "art-cultural" },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens" },
  { name: "Humor & Memes", emoji: "😄", color: "bg-rose-100", slug: "humor-memes" },
  { name: "Pets & Animal Lovers", emoji: "🐾", color: "bg-green-100", slug: "pets" },
  { name: "Just Because & Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
  { name: "Gifts & Surprises", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises" },
  { name: "Inspirations & Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes" },
  { name: "Custom & AI Creations", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai" },
];

export default function Categories() {
  return (
    <div className="text-center px-2 mt-14 mb-20"> {/* 🔹 Menos padding lateral y superior */}
      <Swiper
        slidesPerView={2.1}
        spaceBetween={45} // 💨 espacio central fluido
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={800}
        breakpoints={{
          640: { slidesPerView: 3.3, spaceBetween: 50 },
          1024: { slidesPerView: 5, spaceBetween: 55 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {mainCategories.map((cat, i) => (
          <SwiperSlide key={i}>
            <Link href={`/categories/${cat.slug}`}>
              <div
                className={`${cat.color} rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center w-[170px] h-[150px] sm:w-[180px] sm:h-[160px] md:w-[200px] md:h-[170px] mx-auto`} // 🔹 más grandes
              >
                <span className="text-6xl mb-3">{cat.emoji}</span> {/* 🔹 ícono más grande */}
                <p className="font-semibold text-sm md:text-base text-gray-800 text-center leading-tight">
                  {cat.name}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
   }
