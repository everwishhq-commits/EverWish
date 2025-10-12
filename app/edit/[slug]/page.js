"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🪄 Genera un mensaje predeterminado según el slug
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  const isHalloween = /halloween/.test(s);
  const isLove = /love|romance/.test(s);
  const isBirthday = /birthday|cumple/.test(s);
  const isGhost = /ghost|fantasma/.test(s);
  const isPumpkin = /pumpkin|calabaza/.test(s);
  const isZombie = /zombie/.test(s);

  if (isHalloween && isLove)
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (isHalloween && isBirthday)
    return "May your day rise again with pumpkin magic and sweet joy! 🎃🎂";
  if (isZombie && isBirthday)
    return "Wishing you laughs, brains, and cake on your special day! 🧟‍♂️🎂";
  if (isGhost && isLove)
    return "Sending ghostly hugs and endless love from the beyond. 👻💞";
  if (isPumpkin && isHalloween)
    return "May your night glow with magic and endless treats. ✨🍬";
  if (isLove)
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (isBirthday)
    return "Happy Birthday! Wishing you a day full of joy and surprises. 🎉";
  return "Celebrate this moment with a smile. Wishing you light, peace, and joy. ✨";
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        // 🕒 Mostrar mensaje después de 3 segundos
        setTimeout(() => setShowMessage(true), 3000);
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="w-screen h-screen bg-[#fff8f5] flex flex-col items-center justify-center overflow-hidden relative">
      {/* 🔹 1A: Imagen o video fullscreen */}
      <section className="relative w-full h-full flex flex-col items-center justify-center">
        {item?.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={item?.src}
            alt={item?.title || slug}
            className="w-full h-full object-contain"
          />
        )}

        {/* 🔹 1B: Aparece después de 3 segundos */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-t-3xl p-6 text-center"
          >
            <motion.h1
              key={message}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 drop-shadow-[0_2px_2px_rgba(255,150,150,0.8)]"
              style={{
                WebkitTextStroke: "1px white",
                textShadow: "0 0 15px rgba(255,150,150,0.8)",
              }}
            >
              {message}
            </motion.h1>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 text-lg transition"
              onClick={() =>
                alert(`Sent successfully ✨\n\nCard: ${slug}`)
              }
            >
              Send 💌
            </motion.button>
          </motion.div>
        )}
      </section>
    </main>
  );
          }
