"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🎃 Mensaje automático según el nombre
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
  const [name, setName] = useState("");
  const [anim, setAnim] = useState("none");
  const [showFull, setShowFull] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        // Mostrar full screen 3 segundos y luego vista editable
        setTimeout(() => setShowFull(false), 3000);
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  if (!item) return null;

  // 💫 Pantalla completa inicial (3 seg)
  if (showFull) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center overflow-hidden">
        {item?.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item?.src}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  // 💌 Vista editable (1B)
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen">
      <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
        {item?.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-[420px] object-contain"
          />
        ) : (
          <img
            src={item?.src}
            alt={slug}
            className="w-full h-[420px] object-contain"
          />
        )}
      </div>

      <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl font-semibold text-center mb-4"
        >
          Personaliza tu mensaje ✨
        </motion.h2>

        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-pink-400 text-center font-medium text-gray-700"
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-pink-400 text-center"
          placeholder="Tu nombre (opcional)"
        />

        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400 text-center"
        >
          <option value="none">Sin animación</option>
          <option value="sparkles">Destellos ✨</option>
          <option value="confetti">Confetti 🎉</option>
          <option value="hearts">Corazones 💖</option>
        </select>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition"
          onClick={() =>
            alert(
              `Vista previa lista ✨\n\nMensaje: ${message}\nNombre: ${name}\nAnimación: ${anim}`
            )
          }
        >
          Vista previa y envío
        </motion.button>
      </section>
    </main>
  );
}
