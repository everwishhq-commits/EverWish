"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ forma segura para obtener el slug
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function CategoryPage() {
  const { slug } = useParams() || {}; // 👈 evita undefined
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; // 👈 espera a tener slug antes de cargar
    async function load() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data.categories?.[slug] || []);
      } catch (err) {
        console.error("❌ Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // 🌀 Pantalla de carga
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-600">
        <p className="animate-pulse">
          Loading {slug ? slug.replace("-", " ") : "cards"}...
        </p>
      </main>
    );
  }

  // ⚠️ Sin resultados
  if (!videos.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-700">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {slug ? slug.replace("-", " ") : "Category"}
        </h1>
        <p>No cards yet in this category 🎥</p>
        <Link href="/categories" className="mt-4 text-blue-500 underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  // 💫 Vista principal
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4 md:px-8">
      {/* Encabezado */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 capitalize bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {slug ? slug.replace("-", " ") : "Category"}
        </h1>
        <p className="text-gray-600">
          Choose your favorite card — it moves for you 💌
        </p>
      </div>

      {/* 🎞️ Carrusel automático */}
      <Swiper
        slidesPerView={2.3}
        spaceBetween={15}
        autoplay={{
          delay: 1800,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={1600}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 25 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {videos.map((v, i) => (
          <SwiperSlide key={i}>
            <Link href={v.editUrl || "#"}>
              <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative w-full aspect-[4/5]">
                  {/* 🎬 Video autoplay, silencioso y sin descarga */}
                  <video
                    src={v.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="w-full h-full object-cover rounded-3xl"
                  />

                  {/* 🌸 Overlay suave */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 rounded-3xl"></div>

                  {/* 🏷️ Título */}
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-sm font-semibold text-white drop-shadow-md truncate">
                      {v.title}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔙 Regresar */}
      <div className="text-center mt-10">
        <Link
          href="/categories"
          className="text-sm text-gray-500 hover:text-pink-500 transition"
        >
          ← Back to Categories
        </Link>
      </div>
    </main>
  );
}
