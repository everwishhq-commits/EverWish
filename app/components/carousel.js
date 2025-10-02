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
    <div className="py-10 bg-[#EAF6FA]">
      <Swiper
        centeredSlides={true}
        slidesPerView={3}
        initialSlide={1}
        spaceBetween={-60}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-between bg-white transition-all duration-500
                  ${isActive ? "scale-125 z-20" : "scale-90 opacity-70"}`}
                style={{
                  aspectRatio: "3/4", // más alto que ancho
                  height: "400px",    // altura fija para todo el carrusel
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-3/4 object-contain rounded-t-2xl"
                />
                <h3 className="text-lg font-semibold text-center py-2">
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots debajo, fijos */}
      <div className="flex justify-center mt-4 custom-pagination" />
    </div>
  );
}
