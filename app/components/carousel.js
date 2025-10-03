<div className="relative mt-20 md:mt-28 py-12 md:py-20 min-h-[540px] md:min-h-[720px] overflow-visible">
  <Swiper
    centeredSlides={true}
    loop={true}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    pagination={{ clickable: true }}
    modules={[Pagination, Autoplay]}
    breakpoints={{
      320: { slidesPerView: 3, spaceBetween: 10 },   // móvil
      640: { slidesPerView: 3, spaceBetween: 20 },   // tablet
      1024: { slidesPerView: 3, spaceBetween: 40 },  // desktop
    }}
    className="w-full max-w-6xl overflow-visible !pb-20"
  >
    {templates.map((card, index) => (
      <SwiperSlide key={index}>
        {({ isActive }) => (
          <div
            className={`rounded-2xl shadow-lg flex flex-col items-center justify-center 
              transition-all duration-500 aspect-[3/4] ${card.color}
              ${isActive ? "scale-120 z-30" : "scale-90 opacity-70 z-10"}`}
          >
            <span className="text-5xl md:text-7xl mb-4">{card.icon}</span>
            <h3
              className={`font-semibold ${
                isActive ? "text-lg md:text-2xl" : "text-base md:text-lg"
              }`}
            >
              {card.title}
            </h3>
          </div>
        )}
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Dots */}
  <div className="flex justify-center mt-8 mb-4 custom-pagination" />
</div>
