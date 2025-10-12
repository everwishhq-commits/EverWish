"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🪄 Genera un mensaje predeterminado según el nombre del archivo
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  const isHalloween = /halloween/.test(s);
  const isLove = /love|romance/.test(s);
  const isBirthday = /birthday|cumple/.test(s);
  const isGhost = /ghost|fantasma/.test(s);
  const isPumpkin = /pumpkin|calabaza/.test(s);
  const isZombie = /zombie/.test(s);

  if (isHalloween && isLove)
    return "Entre sustos y suspiros, mi corazón te elige a ti. 🖤🎃";
  if (isHalloween && isBirthday)
    return "¡Que tu día renazca con magia y dulces encantados! 🎃🎂";
  if (isZombie && isBirthday)
    return "¡Que tu día esté lleno de risas, cerebros y pastel! 🧟‍♂️🎂";
  if (isGhost && isLove)
    return "Te mando abrazos espectrales y amor desde el más allá. 👻💞";
  if (isPumpkin && isHalloween)
    return "Que tu noche brille con magia y dulces a montones. ✨🍬";
  if (isLove)
    return "Gracias por existir. Que hoy te abrace la magia del amor. 💖";
  if (isBirthday)
    return "¡Feliz cumpleaños! Que tu día esté lleno de alegría y sorpresas. 🎉";
  return "Celebra este momento con una sonrisa. Te deseo luz, paz y recuerdos bonitos. ✨";
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [anim, setAnim] = useState("none");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));
      } catch (e) {
        console.error("Error cargando /api/videos", e);
      }
    })();
  }, [slug]);

  // 🎇 Render de efectos según animación seleccionada
  const renderEffect = () => {
    if (anim === "sparkles")
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-yellow-300 text-xl"
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -80],
                x: [0, Math.random() * 100 - 50],
                scale: [0.5, 1.2, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              ✨
            </motion.span>
          ))}
        </div>
      );

    if (anim === "hearts")
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-pink-400 text-2xl"
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -100],
                x: [0, Math.random() * 80 - 40],
                scale: [0.8, 1.2, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              💖
            </motion.span>
          ))}
        </div>
      );

    if (anim === "confetti")
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              initial={{ opacity: 0, y: -10, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 120],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                color: ["#ff80b5", "#ffd700", "#4dd4ff", "#baffc9"][
                  Math.floor(Math.random() * 4)
                ],
                left: `${Math.random() * 100}%`,
              }}
            >
              •
            </motion.span>
          ))}
        </div>
      );

    return null;
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative">
      {/* 1A: video o imagen */}
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
            alt={item?.title || slug}
            className="w-full h-[420px] object-contain"
          />
        )}
      </div>

      {/* 1B: mensaje editable y animado */}
      <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
        {renderEffect()}

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl font-semibold text-center mb-4"
        >
          Customize your message ✨
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
          placeholder="Your name (optional)"
        />

        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400 text-center"
        >
          <option value="none">No animation</option>
          <option value="sparkles">Sparkles ✨</option>
          <option value="confetti">Confetti 🎉</option>
          <option value="hearts">Hearts 💖</option>
        </select>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition"
          onClick={() =>
            alert(
              `Preview listo ✨\n\nMensaje: ${message}\nNombre: ${name}\nAnimación: ${anim}\nTarjeta: ${slug}`
            )
          }
        >
          Preview & Send
        </motion.button>

        <p className="text-center text-sm text-gray-500 mt-2">
          You’re editing: <span className="font-mono">{slug}</span>
        </p>
      </section>
    </main>
  );
    }
