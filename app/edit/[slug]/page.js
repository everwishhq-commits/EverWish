"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Genera mensaje predeterminado según el nombre del archivo (slug)
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();

  const isHalloween = /halloween/.test(s);
  const isLove = /love|romance/.test(s);
  const isBirthday = /birthday|cumple/.test(s);
  const isGhost = /ghost|fantasma/.test(s);
  const isPumpkin = /pumpkin|calabaza/.test(s);
  const isZombie = /zombie/.test(s);

  // Puedes ajustar estas prioridades si quieres
  if (isHalloween && isLove)
    return "Entre sustos y suspiros, mi corazón te elige a ti. Feliz Halloween con amor. 🖤🎃";
  if (isHalloween && isBirthday)
    return "¡Que tu día renazca con sabor a calabaza y magia! Feliz cumpleaños. 🎃🎂";
  if (isZombie && isBirthday)
    return "¡Que tu día esté lleno de risas, cerebros y pastel! Feliz cumple zombie. 🧟‍♂️🎂";
  if (isGhost && isLove)
    return "Te mando abrazos espectrales y amor infinito desde el más allá. 👻💞";
  if (isPumpkin && isHalloween)
    return "Que tu noche brille con magia y dulces a montones. ¡Feliz Halloween! ✨🍬";

  // Genérico elegante
  if (isLove) return "Gracias por existir. Que hoy te abrace la magia del amor. 💖";
  if (isBirthday) return "¡Feliz cumpleaños! Que tu día esté lleno de alegría y sorpresas. 🎉";
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* 1A estática arriba (si el source es mp4 lo dejamos como poster animado silenciado o lo mostramos como video muted/loop) */}
      <div className="w-full rounded-3xl shadow-md overflow-hidden bg-white">
        <div className="w-full bg-white flex items-center justify-center">
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
      </div>

      {/* 1B – Editor de mensaje */}
      <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-center">Customize your message ✨</h2>

        <div className="mt-4 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Escribe tu mensaje…"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tu nombre (opcional)"
          />

          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="none">No animation</option>
            <option value="sparkles">Sparkles ✨</option>
            <option value="confetti">Confetti 🎉</option>
            <option value="hearts">Hearts 💖</option>
          </select>

          <button
            className="w-full mt-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition"
            onClick={() => alert(`Preview listo:\n\nMensaje: ${message}\nNombre: ${name}\nAnim: ${anim}\nSlug: ${slug}`)}
          >
            Preview & Send
          </button>

          <p className="text-center text-sm text-gray-500">
            You’re editing: <span className="font-mono">{slug}</span>
          </p>
        </div>
      </section>
    </main>
  );
                }
