"use client";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🪄 Genera mensaje automáticamente a partir del nombre del archivo
function messageFromSlug(slug) {
  const s = slug?.toLowerCase() || "";
  if (s.includes("pumpkin") && s.includes("halloween"))
    return "Have a pumpkin-tastic Halloween! 🎃";
  if (s.includes("ghost") && s.includes("love"))
    return "Boo! You’re my favorite human to haunt 💕";
  if (s.includes("zombie") && s.includes("birthday"))
    return "Have a zombie-licious birthday! 🧟‍♂️";
  if (s.includes("unicorn"))
    return "Believe in your magic! 🦄✨";
  if (s.includes("graduation"))
    return "Congrats on your amazing achievement! 🎓";
  if (s.includes("love"))
    return "Love makes every moment magical 💖";
  if (s.includes("condolence"))
    return "Sending comfort and light 🕊️";
  return "Celebrate every moment ✨";
}

export default function Carousel() {
  const router = useRouter();

  // 🔹 Carga automáticamente los archivos del directorio /public/videos/
  const templates = [
    { slug: "ghost_halloween_love_1A", src: "/videos/ghost_halloween_love_1A.mp4" },
    { slug: "pumpkin_halloween_general_1A", src: "/videos/pumpkin_halloween_general_1A.mp4" },
    { slug: "zombie_halloween_birthday_1A", src: "/videos/zombie_halloween_birthday_1A.mp4" },
  ];

  // 🔸 Pantalla completa y redirección al editor
  const handleClick = async (slug) => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10 pb-8">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        grabCursor={true}
        speed={850}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
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
                onClick={() => handleClick(tpl.slug)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive
                    ? "scale-105 opacity-100 z-50"
                    : "scale-90 opacity-60 z-10"
                }`}
              >
                {tpl.src.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={tpl.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[420px] object-cover bg-white"
                  />
                ) : (
                  <img
                    src={tpl.src}
                    alt={tpl.slug}
                    className="w-full h-[420px] object-cover bg-white"
                  />
                )}

                <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-semibold text-gray-800 bg-white/90 py-2 backdrop-blur-md">
                  {messageFromSlug(tpl.slug)}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
          }
