"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🔹 PON aquí tus 3–10 items (o cámbialo a lo que devuelva /api/videos)
const items = [
  { slug: "zombie_halloween_birthday_1A", src: "/videos/zombie_halloween_birthday_1A.mp4" },
  { slug: "ghost_halloween_love_1A",     src: "/videos/ghost_halloween_love_1A.mp4" },
  { slug: "pumpkin_halloween_general_1A",src: "/videos/pumpkin_halloween_general_1A.mp4" },
];

export default function Carousel() {
  const router = useRouter();
  const swiperRef = useRef(null);

  // Asegura que SIEMPRE empiece en la primera y con autoplay activo
  useEffect(() => {
    const s = swiperRef.current?.swiper;
    if (!s) return;
    s.loopFix();            // corrige duplicados
    s.slideToLoop(0, 0);    // arranca en la primera
    s.autoplay.start();     // garantiza autoplay
  }, []);

  // Si el usuario toca/arrastra, reanudamos autoplay
  const resumeAutoplay = () => {
    const s = swiperRef.current?.swiper;
    s?.autoplay?.start();
  };

  const handleClick = async (slug) => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Autoplay]}
        // ------- LO IMPORTANTE -------
        loop={true}
        initialSlide={0}
        loopAdditionalSlides={items.length}
        slidesPerView={1.2}            // 1 centrada + colas a los lados
        centeredSlides={true}
        spaceBetween={16}
        speed={600}
        grabCursor={true}
        allowTouchMove={true}
        autoplay={{
          delay: 2400,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{ clickable: true }}
        onSlideChange={resumeAutoplay}
        onTouchEnd={resumeAutoplay}
        onAutoplayStop={resumeAutoplay}
        // -----------------------------
        breakpoints={{
          480:  { slidesPerView: 1.5, spaceBetween: 18 },
          768:  { slidesPerView: 2,   spaceBetween: 20 },
          1024: { slidesPerView: 3,   spaceBetween: 24 },
        }}
        className="w-full max-w-5xl select-none"
      >
        {items.map((it, i) => (
          <SwiperSlide key={i} className="!w-[290px] sm:!w-[320px] md:!w-[340px]">
            {({ isActive }) => (
              <div
                onClick={() => handleClick(it.slug)}
                className={`rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 ${
                  isActive ? "scale-105 opacity-100 z-50" : "scale-90 opacity-60 z-10"
                }`}
              >
                {it.src.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={it.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[420px] object-cover bg-white"
                  />
                ) : (
                  <img
                    src={it.src}
                    alt={it.slug}
                    className="w-full h-[420px] object-cover bg-white"
                  />
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
          }
