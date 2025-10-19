"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // 🧠 Cargar videos dinámicos desde la API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setCategories(data.categories || {});
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }
    fetchVideos();
  }, []);

  const allCategories = Object.keys(categories);

  const filtered = allCategories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pink-50 text-center pt-24 pb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Explore our Categories
        </h1>
        <p className="text-gray-700 mb-8">Find the perfect card for every moment 💌</p>

        <div className="mb-12">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full max-w-md mx-auto block p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length > 0 ? (
          filtered.map((cat, idx) => (
            <div key={idx} className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl md:text-2xl font-bold capitalize">
                  {cat.replace(/-/g, " ")}
                </h2>
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
                {(categories[cat] || []).map((video, i) => (
                  <SwiperSlide key={i}>
                    <Link href={`/view/${video.slug}`}>
                      <video
                        src={video.src}
                        className="rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform aspect-square w-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">
            {search ? "No matches found 🤔" : "Loading videos... 🎬"}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
    }
