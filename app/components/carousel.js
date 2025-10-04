"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  // 👇 Aquí lista de imágenes en public/top10
  const images = [
    "/top10/have-a-magical-day.png",
    "/top10/welcome-little-one.png",
    "/top10/besos-y-abrazos.png",
    "/top10/unicornio.png",
    "/top10/elefante.png"
  ];

  return (
    <div className="relative mt-2 py-6 min-h-[420px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 10 },
          480: { slidesPerView: 1.4, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center h-[400px]">
              <img
                src={src}
                alt={`card-${index}`}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-4 mb-2 custom-pagination" />
    </div>
  );
}
