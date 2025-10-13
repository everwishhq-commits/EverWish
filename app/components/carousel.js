"use client";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🔹 Mensaje automático según nombre
function messageFromSlug(slug) {
  const s = slug?.toLowerCase() || "";
  if (/pumpkin/.test(s)) return "Have a pumpkin-tastic Halloween! 🎃";
  if (/ghost/.test(s)) return "Boo! You’re my favorite human to haunt 💕";
  if (/zombie/.test(s)) return "Have a zombie-licious birthday! 🧟‍♂️";
  if (/unicorn/.test(s)) return "Believe in your magic! 🦄✨";
  if (/graduation/.test(s)) return "Congrats on your amazing achievement! 🎓";
  if (/love/.test(s)) return "Love makes every moment magical 💖";
  if (/condolence/.test(s)) return "Sending comfort and light 🕊️";
  return "Celebrate every moment ✨";
}

export default function Carousel() {
  const router = useRouter();

  // 🔸 Tus 7 templates predefinidos (usa tus rutas reales)
  const templates = [
    { slug: "pumpkin_halloween", src: "/cards/pumpkin.png" },
    { slug: "ghost_halloween", src: "/cards/ghost.png" },
    { slug: "zombie_birthday", src: "/cards/zombie.png" },
    { slug: "unicorn_magic", src: "/cards/unicorn.png" },
    { slug: "graduation_celebration", src: "/cards/graduation.png" },
    { slug: "love_romantic", src: "/cards/love.png" },
    { slug: "condolence_peace", src: "/cards/condolence.png" },
  ];

  // 🔹 Pantalla completa + redirección
  const handleClick = async (slug, e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10 pb-8">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        loopAdditionalSlides={7}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        speed={850}
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className}" style="
              background-color: #ffcce0;
              width: 7px;
              height: 7px;
              margin: 0 5px;
              border-radius: 50%;
              display: inline-block;
              opacity: 0.5;
              transition: all 0.3s ease;
            "></span>`,
        }}
        onSlideChange={(swiper) => {
          const bullets = document.querySelectorAll(".swiper-pagination-bullet");
          bullets.forEach((b, i) => {
            if (i === swiper.realIndex % templates.length) {
              b.style.opacity = "1";
              b.style.backgroundColor = "#ff7eb9";
              b.style.boxShadow = "0 0 6px 2px rgba(255,126,185,0.4)";
              b.style.transform = "scale(1.3)";
            } else {
              b.style.opacity = "0.5";
              b.style.backgroundColor = "#ffcce0";
              b.style.boxShadow = "none";
              b.style.transform = "scale(1)";
            }
          });
        }}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          480: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full max-w-5xl select-none"
      >
        {templates.map((tpl, index) => (
          <SwiperSlide
            key={index}
            className="!w-[280px] sm:!w-[300px] md:!w-[340px] flex justify-center"
          >
            {({ isActive }) => (
              <div
                onClick={(e) => handleClick(tpl.slug, e)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive
                    ? "scale-105 opacity-100 z-50"
                    : "scale-90 opacity-60 z-10"
                }`}
              >
                <div className="relative">
                  <img
                    src={tpl.src}
                    alt={tpl.slug}
                    className="w-full h-[420px] object-cover bg-white"
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-semibold text-gray-800 bg-white/90 py-2 backdrop-blur-md">
                    {messageFromSlug(tpl.slug)}
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
    }
