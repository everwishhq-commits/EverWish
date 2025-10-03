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
        spaceBetween={-60}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl min-h-[420px]"
        breakpoints={{
          0: {
            slidesPerView: 1, // en celulares solo 1 grande
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 1.5, // en móviles grandes: 1 central y medio de los lados
            spaceBetween: -40,
          },
          1024: {
            slidesPerView: 3, // escritorio: 3 visibles
            spaceBetween: -80,
          },
        }}
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center 
                            justify-center bg-white transition-all duration-500
                            ${
                              isActive
                                ? "scale-110 translate-y-0 z-30 h-96"
                                : "scale-90 translate-y-10 opacity-70 z-10 h-72"
                            }`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-32 h-32 md:w-40 md:h-40 object-contain mb-2 rounded-xl"
                />
                <h3
                  className={`font-semibold transition-all ${
                    isActive ? "text-lg md:text-xl" : "text-sm md:text-base"
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
