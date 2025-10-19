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
      {
        name: "New Year’s Day",
        emoji: "🎆",
        color: "bg-blue-100",
        slug: "new-year",
        keywords: ["new year", "año nuevo", "2025", "celebration", "fiesta"]
      },
      {
        name: "Valentine’s Day",
        emoji: "💘",
        color: "bg-pink-200",
        slug: "valentines",
        keywords: ["valentine", "amor", "heart", "corazón", "san valentín"]
      },
      {
        name: "Easter",
        emoji: "🐣",
        color: "bg-purple-100",
        slug: "easter",
        keywords: ["easter", "pascua", "eggs", "huevos", "resurrection"]
      },
      {
        name: "Halloween",
        emoji: "🎃",
        color: "bg-orange-200",
        slug: "halloween",
        keywords: ["halloween", "dulce o trato", "costume", "disfraz", "pumpkin"]
      },
      {
        name: "Thanksgiving",
        emoji: "🦃",
        color: "bg-amber-200",
        slug: "thanksgiving",
        keywords: ["thanksgiving", "acción de gracias", "turkey", "gratitude"]
      },
      {
        name: "Christmas",
        emoji: "🎄",
        color: "bg-green-100",
        slug: "christmas",
        keywords: ["christmas", "navidad", "christmas tree", "árbol de navidad", "xmas"]
      },
    ],
  },
  {
    title: "Love & Emotions 💖",
    items: [
      {
        name: "Love & Romance",
        emoji: "💌",
        color: "bg-rose-200",
        slug: "love-romance",
        keywords: ["love", "amor", "romance", "relationship", "relación"]
      },
      {
        name: "Anniversary",
        emoji: "💍",
        color: "bg-pink-100",
        slug: "anniversary",
        keywords: ["anniversary", "aniversario", "celebration", "celebración"]
      },
      {
        name: "I Miss You",
        emoji: "💭",
        color: "bg-sky-100",
        slug: "missing-you",
        keywords: ["miss you", "te extraño", "extrañar", "missing", "te hecho de menos"]
      },
      {
        name: "Apology",
        emoji: "💐",
        color: "bg-yellow-100",
        slug: "apology",
        keywords: ["apology", "perdón", "lo siento", "sorry"]
      },
      {
        name: "Thinking of You",
        emoji: "☁️",
        color: "bg-indigo-100",
        slug: "thinking-of-you",
        keywords: ["thinking", "pensando en ti", "thinking of you", "pensamiento"]
      },
      {
        name: "Encouragement",
        emoji: "🌟",
        color: "bg-lime-100",
        slug: "encouragement",
        keywords: ["encouragement", "ánimo", "motivation", "motivación"]
      },
    ],
  },
  {
    title: "Family & Relationships 👨‍👩‍👧‍👦",
    items: [
      {
        name: "Mother’s Day",
        emoji: "🌸",
        color: "bg-pink-200",
        slug: "mothers-day",
        keywords: ["mother", "mamá", "mother’s day", "día de la madre"]
      },
      {
        name: "Father’s Day",
        emoji: "👔",
        color: "bg-blue-200",
        slug: "fathers-day",
        keywords: ["father", "padre", "father’s day", "día del padre"]
      },
      {
        name: "New Baby",
        emoji: "👶",
        color: "bg-sky-200",
        slug: "new-baby",
        keywords: ["baby", "bebé", "new baby", "recién nacido"]
      },
      {
        name: "Grandparents",
        emoji: "👵",
        color: "bg-yellow-200",
        slug: "grandparents",
        keywords: ["grandparent", "abuelo", "abuela", "grandparents day"]
      },
    ],
  },
  {
    title: "Work & Professional 💼",
    items: [
      {
        name: "Teacher’s Day",
        emoji: "🍎",
        color: "bg-rose-100",
        slug: "teachers-day",
        keywords: ["teacher", "maestro", "profesor", "teacher’s day"]
      },
      {
        name: "Nurses Week",
        emoji: "🩺",
        color: "bg-teal-200",
        slug: "nurses-week",
        keywords: ["nurse", "enfermera", "nurses week", "semana de enfermería"]
      },
      {
        name: "Doctor’s Day",
        emoji: "⚕️",
        color: "bg-blue-100",
        slug: "doctors-day",
        keywords: ["doctor", "médico", "doctor’s day", "día del médico"]
      },
      {
        name: "Police Appreciation",
        emoji: "👮‍♂️",
        color: "bg-gray-100",
        slug: "police-day",
        keywords: ["police", "policía", "law enforcement", "apreciación policía"]
      },
      {
        name: "Firefighters Day",
        emoji: "🚒",
        color: "bg-orange-100",
        slug: "firefighters-day",
        keywords: ["firefighter", "bombero", "firefighters day"]
      },
    ],
  },
  {
    title: "Everyday Moments 🌞",
    items: [
      {
        name: "Good Morning",
        emoji: "🌅",
        color: "bg-orange-100",
        slug: "good-morning",
        keywords: ["good morning", "buenos días", "morning"]
      },
      {
        name: "Good Night",
        emoji: "🌙",
        color: "bg-indigo-100",
        slug: "good-night",
        keywords: ["good night", "buenas noches", "night"]
      },
      {
        name: "Just Because",
        emoji: "💌",
        color: "bg-blue-100",
        slug: "just-because",
        keywords: ["just because", "solo porque", "anytime"]
      },
      {
        name: "Humor",
        emoji: "😂",
        color: "bg-rose-100",
        slug: "humor",
        keywords: ["humor", "funny", "chiste", "joke"]
      },
      {
        name: "Pets & Animals",
        emoji: "🐾",
        color: "bg-green-100",
        slug: "pets",
        keywords: ["pet", "mascota", "animal", "dog", "cat"]
      },
    ],
  },
];

// Página con búsqueda inteligente
export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  // Todos los items con sección para búsqueda
  const allItems = categorySections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      section: section.title,
    }))
  );

  const filtered = allItems.filter((cat) => {
    const term = search.toLowerCase();
    const inName = cat.name.toLowerCase().includes(term);
    const inKeywords = cat.keywords.some((kw) =>
      kw.toLowerCase().includes(term)
    );
    return inName || inKeywords;
  });

  const isSearching = search.trim().length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pink-50 text-center pt-24 pb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Explore our Categories
        </h1>
        <p className="text-gray-700 mb-8">Find the perfect card for every moment 💌</p>

        {/* Barra global */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full max-w-md mx-auto block p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isSearching ? (
          filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((cat, i) => (
                <Link key={i} href={`/categories/${cat.slug}`}>
                  <div
                    className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                  >
                    <span className="text-4xl mb-2">{cat.emoji}</span>
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{cat.section}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No matches found — try “Create with AI” 🤖
            </p>
          )
        ) : (
          // Vista inicial tipo Netflix
          categorySections.map((section, idx) => (
            <div key={idx} className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
                <span className="text-gray-400 text-sm">View all →</span>
              </div>
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
            </div>
          ))
        )}
      </main>
      <Footer />
    </>
  );
                   }
