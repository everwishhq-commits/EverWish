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
    <div className="py-10">
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 20 },   // móvil
          640: { slidesPerView: 2.2, spaceBetween: 30 },   // tablet
          1024: { slidesPerView: 3, spaceBetween: -60 },   // desktop
        }}
        className="w-full max-w-5xl"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center 
                            justify-center bg-white transition-all duration-500
                            ${
                              isActive
                                ? "scale-105 z-30"
                                : "scale-90 opacity-70 z-10"
                            }`}
              >
                <div
                  className={`w-full max-w-xs flex flex-col justify-between items-center p-4 
                              ${
                                isActive
                                  ? "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/9]"
                                  : "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/9]"
                              }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-28 h-28 object-contain mb-4 rounded-xl"
                  />
                  <h3
                    className={`font-semibold transition-all text-center ${
                      isActive ? "text-lg" : "text-sm"
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
