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
        slidesPerView={1.2} // 👈 en móvil se verá 1 central y cachitos de los lados
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: -40 }, // tablet chica
          768: { slidesPerView: 2.2, spaceBetween: -60 }, // tablet mediana
          1024: { slidesPerView: 3, spaceBetween: -80 },  // desktop
        }}
        initialSlide={1}
        spaceBetween={-50}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl min-h-[480px]"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center 
                            justify-center bg-white transition-all duration-500
                            ${
                              isActive
                                ? "scale-110 z-30 h-[420px] -translate-y-2"
                                : "scale-90 opacity-70 z-10 h-[320px] translate-y-4"
                            }`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-32 h-32 object-contain mb-4 rounded-xl"
                />
                <h3
                  className={`font-semibold transition-all ${
                    isActive ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                  }`}
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
