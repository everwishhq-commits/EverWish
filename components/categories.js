"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 🔹 Cargar index.json desde /public/videos
  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("/videos/index.json");
        const data = await res.json();
        setItems(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Error cargando index.json:", err);
      }
    }
    loadFiles();
  }, []);

  // 🔍 Filtrar dinámicamente por nombre o tags
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      )
    );
  }, [search, items]);

  return (
    <section id="categories" className="text-center py-12 px-2">
      {/* 🏷️ Único título */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, love, birthday..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel circular */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={12}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={900}
        breakpoints={{
          0: { slidesPerView: 2.2, spaceBetween: 10 },
          640: { slidesPerView: 3.2, spaceBetween: 12 },
          1024: { slidesPerView: 5, spaceBetween: 16 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <SwiperSlide key={i}>
              <Link href={item.link || "#"}>
                <div
                  className="rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] mx-auto"
                  style={{ backgroundColor: item.color || "#fde68a" }}
                >
                  {item.image?.endsWith(".mp4") ? (
                    <video
                      src={item.image}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                  {item.name}
                </p>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matches found for “{search}”
          </p>
        )}
      </Swiper>
    </section>
  );
            }
