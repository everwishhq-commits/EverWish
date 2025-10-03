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
    <div className="pt-6 pb-4">
      <Swiper
        centeredSlides={true}
        initialSlide={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl min-h-[460px]"
        breakpoints={{
          0: {
            slidesPerView: 1.15, // central completa + pedacito de laterales en mobile
            spaceBetween: -30,
          },
          640: {
            slidesPerView: 1.4, // tablet
            spaceBetween: -50,
          },
          1024: {
            slidesPerView: 3, // desktop
            spaceBetween: -80,
          },
        }}
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center 
                            justify-between bg-white transition-all duration-500
                            ${
                              isActive
                                ? "scale-110 translate-y-0 z-30 h-[420px] w-[280px]" // central más grande
                                : "scale-90 translate-y-8 opacity-70 z-10 h-[360px] w-[240px]" // laterales más chicas
                            }`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-3/4 object-cover rounded-t-2xl"
                />
                <h3
                  className={`py-2 font-semibold transition-all ${
                    isActive ? "text-lg" : "text-sm"
                  }`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots fijos */}
      <div className="flex justify-center mt-3 custom-pagination" />
    </div>
  );
}
