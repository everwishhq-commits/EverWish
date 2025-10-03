"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const templates = [
  { title: "Template 1", image: "/templates/template1.png" },
  { title: "Template 2", image: "/templates/template2.png" },
  { title: "Template 3", image: "/templates/template3.png" },
  { title: "Template 4", image: "/templates/template4.png" },
  { title: "Template 5", image: "/templates/template5.png" },
  { title: "Template 6", image: "/templates/template6.png" },
  { title: "Template 7", image: "/templates/template7.png" },
  { title: "Template 8", image: "/templates/template8.png" },
  { title: "Template 9", image: "/templates/template9.png" },
  { title: "Template 10", image: "/templates/template10.png" },
];

export default function Carousel() {
  return (
    <div className="py-14"> {/* un poco más de espacio arriba */}
      <Swiper
        centeredSlides={true}
        initialSlide={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl min-h-[420px]"
        breakpoints={{
          0: { slidesPerView: 1.1, spaceBetween: -30, centeredSlides: true }, // móvil
          640: { slidesPerView: 1.3, spaceBetween: -40, centeredSlides: true }, // tablet
          1024: { slidesPerView: 3, spaceBetween: -80, centeredSlides: true }, // desktop
        }}
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center 
                            justify-center bg-white transition-all duration-500 overflow-hidden
                            ${
                              isActive
                                ? "scale-110 translate-y-0 z-30 h-96 md:aspect-[16/9]"
                                : "scale-90 translate-y-10 opacity-70 z-10 h-72 md:aspect-[16/9]"
                            }`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <h3
                  className={`absolute bottom-4 font-semibold bg-white/80 px-3 py-1 rounded-lg
                              ${isActive ? "text-lg" : "text-sm"}`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots fijos debajo */}
      <div className="flex justify-center mt-4 custom-pagination" />
    </div>
  );
}
