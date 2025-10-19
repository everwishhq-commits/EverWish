"use client";
import { useState, useEffect } from "react";
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

  // ✅ carga segura de videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && typeof data === "object" && data.categories) {
          setVideoCategories(data.categories);
        } else {
          setVideoCategories({});
        }
      } catch (err) {
        console.error("⚠️ Error cargando videos:", err);
        setVideoCategories({});
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const categorySections = [
    {
      title: "Seasonal & Holidays 🎉",
      items: [
        { name: "Valentine’s Day", emoji: "💘", color: "bg-pink-200", slug: "valentines" },
        { name: "Easter", emoji: "🐣", color: "bg-purple-100", slug: "easter" },
        { name: "Halloween", emoji: "🎃", color: "bg-orange-200", slug: "halloween" },
        { name: "Christmas", emoji: "🎄", color: "bg-green-100", slug: "christmas" },
      ],
    },
    {
      title: "Love & Emotions 💖",
      items: [
        { name: "Anniversary", emoji: "💍", color: "bg-pink-100", slug: "anniversary" },
        { name: "I Miss You", emoji: "💭", color: "bg-sky-100", slug: "missyou" },
        { name: "Apology", emoji: "💐", color: "bg-yellow-100", slug: "apology" },
      ],
    },
  ];

  const allItems = categorySections.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title }))
  );

  const filtered = allItems.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

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
                {section.items.map((cat, i) => {
                  const videos =
                    videoCategories && typeof videoCategories === "object"
                      ? videoCategories[cat.slug] || []
                      : [];
                  const latestVideo = videos.length > 0 ? videos[0] : null;

                  return (
                    <SwiperSlide key={i}>
                      <Link href={`/categories/${cat.slug}`}>
                        <div
                          className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square relative overflow-hidden`}
                        >
                          {latestVideo?.src && (
                            <video
                              src={latestVideo.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-50"
                            />
                          )}
                          <span className="text-4xl mb-2 relative z-10">
                            {cat.emoji}
                          </span>
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
