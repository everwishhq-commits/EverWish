"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Import dinámico de todos los videos en /public/videos
const importAll = (r) => r.keys().map(r);
const videos = importAll(require.context("/public/videos", false, /\.(mp4)$/));

export default function Carousel() {
  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 1.4, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl"
      >
        {videos.map((src, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-500 
                ${isActive ? "scale-105 z-50" : "scale-90 opacity-70 z-10"}`}
              >
                <video
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[450px] object-cover"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
                    }
