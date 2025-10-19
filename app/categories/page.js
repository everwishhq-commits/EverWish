"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [videoCategories, setVideoCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideoCategories(data.categories || {});
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();

    // ♻️ Auto-refresh cada 5 min (o ajusta si prefieres)
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const allStaticSections = [
    {
      title: "Seasonal & Holidays 🎉",
      items: [
        { name: "New Year’s Day", emoji: "🎆", color: "bg-blue-100", slug: "newyear" },
        { name: "Valentine’s Day", emoji: "💘", color: "bg-pink-200", slug: "valentines" },
        { name: "Easter", emoji: "🐣", color: "bg-purple-100", slug: "easter" },
        { name: "Halloween", emoji: "🎃", color: "bg-orange-200", slug: "halloween" },
        { name: "Thanksgiving", emoji: "🦃", color: "bg-amber-200", slug: "thanksgiving" },
        { name: "Christmas", emoji: "🎄", color: "bg-green-100", slug: "christmas" },
      ],
    },
    {
      title: "Love & Emotions 💖",
      items: [
        { name: "Love & Romance", emoji: "💌", color: "bg-rose-200", slug: "valentines" },
        { name: "Anniversary", emoji: "💍", color: "bg-pink-100", slug: "anniversary" },
        { name: "I Miss You", emoji: "💭", color: "bg-sky-100", slug: "missing" },
        { name: "Apology", emoji: "💐", color: "bg-yellow-100", slug: "apology" },
        { name: "Thinking of You", emoji: "☁️", color: "bg-indigo-100", slug: "thinking" },
        { name: "Encouragement", emoji: "🌟", color: "bg-lime-100", slug: "encouragement" },
      ],
    },
    {
      title: "Family & Relationships 👨‍👩‍👧‍👦",
      items: [
        { name: "Mother’s Day", emoji: "🌸", color: "bg-pink-200", slug: "mothers" },
        { name: "Father’s Day", emoji: "👔", color: "bg-blue-200", slug: "fathers" },
        { name: "New Baby", emoji: "👶", color: "bg-sky-200", slug: "baby" },
        { name: "Grandparents", emoji: "👵", color: "bg-yellow-200", slug: "grandparents" },
      ],
    },
    {
      title: "Work & Professional 💼",
      items: [
        { name: "Teacher’s Day", emoji: "🍎", color: "bg-rose-100", slug: "teachers" },
        { name: "Nurses Week", emoji: "🩺", color: "bg-teal-200", slug: "nurses" },
        { name: "Doctor’s Day", emoji: "⚕️", color: "bg-blue-100", slug: "doctors" },
        { name: "Police Appreciation", emoji: "👮‍♂️", color: "bg-gray-100", slug: "police" },
        { name: "Firefighters Day", emoji: "🚒", color: "bg-orange-100", slug: "firefighters" },
      ],
    },
    {
      title: "Everyday Moments 🌞",
      items: [
        { name: "Good Morning", emoji: "🌅", color: "bg-orange-100", slug: "morning" },
        { name: "Good Night", emoji: "🌙", color: "bg-indigo-100", slug: "night" },
        { name: "Just Because", emoji: "💌", color: "bg-blue-100", slug: "general" },
        { name: "Humor", emoji: "😂", color: "bg-rose-100", slug: "humor" },
        { name: "Pets & Animals", emoji: "🐾", color: "bg-green-100", slug: "pets" },
      ],
    },
  ];

  // 🔍 Búsqueda global
  const allItems = allStaticSections.flatMap((s) =>
    s.items.map((it) => ({ ...it, section: s.title }))
  );

  const filtered = allItems.filter((c) => {
    const term = search.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term);
  });

  const isSearching = search.trim().length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pink-50 text-center pt-24 pb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Explore our Categories
        </h1>
        <p className="text-gray-700 mb-8">
          Find the perfect card for every moment 💌
        </p>

        {/* 🔍 Search bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full max-w-md mx-auto block p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Loading categories...</p>
        ) : isSearching ? (
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
          allStaticSections.map((section, idx) => (
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
                {section.items.map((cat, i) => {
                  const videos = videoCategories[cat.slug] || [];
                  const hasVideo = videos.length > 0;
                  const latestVideo = hasVideo ? videos[0] : null;

                  return (
                    <SwiperSlide key={i}>
                      <Link href={`/categories/${cat.slug}`}>
                        <div
                          className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square relative`}
                        >
                          {hasVideo && (
                            <video
                              src={latestVideo.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-50"
                            />
                          )}
                          <span className="text-4xl mb-2 relative z-10">{cat.emoji}</span>
                          <p className="font-semibold text-gray-800 relative z-10">
                            {cat.name}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          ))
        )}
      </main>
      <Footer />
    </>
  );
    }
